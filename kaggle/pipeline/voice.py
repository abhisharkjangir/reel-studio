"""Scene-by-scene TTS. ElevenLabs is primary; Sarvam is the fallback.

Returns, per scene: path to a wav file + a list of (word, start_s, end_s) timings.
If the provider doesn't return word timings, we approximate by distributing the
scene duration over words proportional to character length — good enough for pop-in captions.
"""
from __future__ import annotations

import json
import os
import re
import wave
from dataclasses import dataclass
from pathlib import Path

import requests

from .constants import LANG_TO_ELEVENLABS, LANG_TO_SARVAM

ELEVEN_BASE = "https://api.elevenlabs.io/v1"
SARVAM_BASE = "https://api.sarvam.ai"


@dataclass
class SceneAudio:
    path: Path
    duration_s: float
    words: list[tuple[str, float, float]]  # (word, start, end)


def synth_scene(voice_text: str, out_wav: Path, look: dict, language: str) -> SceneAudio:
    voice = look.get("voice", {})
    provider = voice.get("provider", "elevenlabs")
    voice_id = voice.get("voiceId", "EXAVITQu4vr4xnSDxMaL")
    speed    = float(voice.get("speed", 1.0))

    # Hard route: non-EL-supported Indian languages → Sarvam directly
    if language not in ("english", "hindi", "hinglish") and provider == "elevenlabs":
        return _sarvam(voice_text, out_wav, voice_id, language, speed)

    try:
        if provider == "elevenlabs":
            return _elevenlabs(voice_text, out_wav, voice_id, language, speed)
        return _sarvam(voice_text, out_wav, voice_id, language, speed)
    except Exception as e:
        # Fallback the other direction
        if provider == "elevenlabs" and os.environ.get("SARVAM_API_KEY"):
            return _sarvam(voice_text, out_wav, voice_id, language, speed)
        if provider == "sarvam" and os.environ.get("ELEVENLABS_API_KEY"):
            return _elevenlabs(voice_text, out_wav, voice_id, language, speed)
        raise RuntimeError(f"TTS failed with no usable fallback: {e}") from e


def _elevenlabs(text: str, out_wav: Path, voice_id: str, language: str, speed: float) -> SceneAudio:
    key = os.environ["ELEVENLABS_API_KEY"]
    lang_code = LANG_TO_ELEVENLABS.get(language, "en")

    # with-timestamps returns audio_base64 + a per-character timings array
    url = f"{ELEVEN_BASE}/text-to-speech/{voice_id}/with-timestamps"
    resp = requests.post(
        url,
        headers={"xi-api-key": key, "accept": "application/json", "content-type": "application/json"},
        json={
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "speed": speed},
            "language_code": lang_code,
            "output_format": "mp3_44100_128",
        },
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()

    import base64
    tmp_mp3 = out_wav.with_suffix(".mp3")
    tmp_mp3.write_bytes(base64.b64decode(data["audio_base64"]))
    # transcode to wav via ffmpeg (bundled in Kaggle image)
    os.system(f'ffmpeg -y -loglevel error -i "{tmp_mp3}" -ar 44100 -ac 1 "{out_wav}"')
    tmp_mp3.unlink(missing_ok=True)

    duration = _wav_duration(out_wav)
    timings = data.get("alignment") or data.get("normalized_alignment") or {}
    words = _words_from_char_timings(text, timings, fallback_total=duration)
    return SceneAudio(path=out_wav, duration_s=duration, words=words)


def _sarvam(text: str, out_wav: Path, voice_id: str, language: str, speed: float) -> SceneAudio:
    key = os.environ.get("SARVAM_API_KEY")
    if not key:
        raise RuntimeError(
            "ElevenLabs failed and no SARVAM_API_KEY is set. "
            "Add one in Kaggle Secrets to enable fallback / other Indian languages."
        )
    lang_code = LANG_TO_SARVAM.get(language, "hi-IN")

    # Sarvam bulbul:v3 speaker list (as of Nov 2026). If the user picked an ElevenLabs voice
    # or an old Sarvam alias, default to a sensible current one.
    SARVAM_SPEAKERS = {
        "aditya", "ritu", "ashutosh", "priya", "neha", "rahul", "pooja", "rohan", "simran",
        "kavya", "amit", "dev", "ishita", "shreya", "ratan", "varun", "manan", "sumit",
        "roopa", "kabir", "aayan", "shubh", "advait", "anand", "tanya", "tarun", "sunny",
        "mani", "gokul", "vijay", "shruti", "suhani", "mohit", "kavitha", "rehan", "soham", "rupali",
    }
    vid = (voice_id or "").lower()
    # Collapse old aliases like "shubh-enhi-companion" → "shubh"
    short = vid.split("-")[0] if vid else ""
    sarvam_voice = vid if vid in SARVAM_SPEAKERS else (short if short in SARVAM_SPEAKERS else "shubh")
    resp = requests.post(
        f"{SARVAM_BASE}/text-to-speech",
        headers={"api-subscription-key": key, "content-type": "application/json"},
        json={
            "inputs": [text],
            "target_language_code": lang_code,
            "speaker": sarvam_voice,
            "pitch": 0, "pace": speed, "loudness": 1.0,
            "speech_sample_rate": 22050, "enable_preprocessing": True,
            "model": "bulbul:v3",
        },
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()
    import base64
    audio_b64 = data["audios"][0]
    tmp = out_wav.with_suffix(".tmp.wav")
    tmp.write_bytes(base64.b64decode(audio_b64))
    os.system(f'ffmpeg -y -loglevel error -i "{tmp}" -ar 44100 -ac 1 "{out_wav}"')
    tmp.unlink(missing_ok=True)
    duration = _wav_duration(out_wav)
    words = _approximate_word_timings(text, duration)
    return SceneAudio(path=out_wav, duration_s=duration, words=words)


# ── helpers ───────────────────────────────────────────────────────────────────

def _wav_duration(path: Path) -> float:
    with wave.open(str(path), "rb") as w:
        return w.getnframes() / float(w.getframerate())


def _approximate_word_timings(text: str, total: float) -> list[tuple[str, float, float]]:
    words = [w for w in re.split(r"\s+", text.strip()) if w]
    if not words:
        return []
    weights = [max(1, len(w)) for w in words]
    total_w = sum(weights)
    out: list[tuple[str, float, float]] = []
    t = 0.0
    for w, wt in zip(words, weights):
        d = total * (wt / total_w)
        out.append((w, t, t + d))
        t += d
    return out


def _words_from_char_timings(text: str, timings: dict, fallback_total: float) -> list[tuple[str, float, float]]:
    """ElevenLabs returns `alignment = {characters, character_start_times_seconds, character_end_times_seconds}`."""
    chars = timings.get("characters") or []
    starts = timings.get("character_start_times_seconds") or []
    ends   = timings.get("character_end_times_seconds") or []
    if not chars or len(chars) != len(starts) or len(starts) != len(ends):
        return _approximate_word_timings(text, fallback_total)
    out: list[tuple[str, float, float]] = []
    buf, w_start = "", None
    for ch, s, e in zip(chars, starts, ends):
        if ch.isspace():
            if buf:
                out.append((buf, w_start or 0.0, e))
                buf, w_start = "", None
        else:
            if w_start is None:
                w_start = s
            buf += ch
    if buf:
        out.append((buf, w_start or 0.0, ends[-1]))
    return out


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--text", required=True)
    ap.add_argument("--voice-id", default="EXAVITQu4vr4xnSDxMaL")
    ap.add_argument("--provider", default="elevenlabs")
    ap.add_argument("--language", default="english")
    ap.add_argument("--out", default="out.wav")
    args = ap.parse_args()
    a = synth_scene(args.text, Path(args.out), {"voice": {"provider": args.provider, "voiceId": args.voice_id, "speed": 1}}, args.language)
    print(json.dumps({"duration": a.duration_s, "words": a.words}, indent=2, ensure_ascii=False))
