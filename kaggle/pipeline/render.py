"""Compose the final 1080×1920 mp4 using a single ffmpeg invocation.

Inputs assembled by the caller:
  scenes = [{voice_wav, duration, words, cover_png (scene bg), onScreenText}]
  cover_png (hero cover)
  presenter_png (optional static overlay)
  music_mp3 (optional)

Approach: render one visual timeline track = a sequence of per-scene cover PNGs
shown for `duration` seconds each, then overlay (1) presenter PNG (static),
(2) drawtext captions with word timings, (3) optional on-screen text headline.
Audio = concatenated voice wavs, optionally ducked over music via sidechaincompress.
"""
from __future__ import annotations

import os
import shutil
import subprocess
from pathlib import Path

from .captions import ffmpeg_caption_filter
from .constants import resolve_colors
from .cover import render_cover

W, H = 1080, 1920


def render_reel(
    scenes: list[dict],
    look: dict,
    presenter_png: Path | None,
    music_mp3: Path | None,
    assets_dir: Path,
    work_dir: Path,
    out_mp4: Path,
    font_path: Path,
) -> Path:
    work_dir.mkdir(parents=True, exist_ok=True)

    # 1. Render one background PNG per scene (reuse cover.py for consistent style).
    scene_pngs: list[Path] = []
    for i, sc in enumerate(scenes):
        p = work_dir / f"scene-{i:02d}.png"
        render_cover(look, sc["onScreenText"] or sc["voiceText"][:40], p, font_path)
        scene_pngs.append(p)

    # 2. Concat the scene PNGs into a silent video track. Each scene shown for sc["duration"] s.
    concat_list = work_dir / "concat.txt"
    with concat_list.open("w") as f:
        for sc, png in zip(scenes, scene_pngs):
            f.write(f"file '{png.resolve()}'\nduration {sc['duration']:.3f}\n")
        f.write(f"file '{scene_pngs[-1].resolve()}'\n")  # last frame requirement

    bg_mp4 = work_dir / "bg.mp4"
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error",
         "-f", "concat", "-safe", "0", "-i", str(concat_list),
         "-vf", f"scale={W}:{H},fps=30,format=yuv420p",
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
         str(bg_mp4)],
        check=True,
    )

    # 3. Concat the per-scene voice wavs into one voice track.
    voice_list = work_dir / "voice.txt"
    with voice_list.open("w") as f:
        for sc in scenes:
            f.write(f"file '{sc['voice_wav'].resolve()}'\n")
    voice_wav = work_dir / "voice.wav"
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error",
         "-f", "concat", "-safe", "0", "-i", str(voice_list),
         "-c", "copy", str(voice_wav)],
        check=True,
    )
    total_duration = sum(sc["duration"] for sc in scenes)

    # 4. Build the filter_complex for overlays (presenter + captions).
    colors = resolve_colors(look)
    scene_offset = 0.0
    caption_chunks = []
    for sc in scenes:
        if sc.get("words"):
            caption_chunks.append(ffmpeg_caption_filter(sc["words"], scene_offset, font_path, colors["highlight"].lstrip("#"), colors["main"].lstrip("#")))
        scene_offset += sc["duration"]
    caption_filter = ",".join(c for c in caption_chunks if c)

    # Inputs: 0=bg video, 1=voice, (2=presenter png if any), (3=music if any)
    inputs = ["-i", str(bg_mp4), "-i", str(voice_wav)]
    overlay_filter = "[0:v]"
    next_index = 2
    if presenter_png:
        inputs += ["-loop", "1", "-i", str(presenter_png)]
        overlay_filter = f"[0:v][{next_index}:v]overlay=0:0:format=auto[withp]; [withp]"
        next_index += 1

    if caption_filter:
        overlay_filter += caption_filter
    else:
        overlay_filter += "null"
    overlay_filter += "[vout]"

    audio_filter = ""
    if music_mp3:
        inputs += ["-i", str(music_mp3)]
        music_idx = next_index
        audio_filter = (
            f"[{music_idx}:a]volume=0.22,aloop=loop=-1:size=2e+09,atrim=0:{total_duration:.3f}[m]; "
            f"[1:a][m]sidechaincompress=threshold=0.04:ratio=8:attack=5:release=400:makeup=4[aout]"
        )
    else:
        audio_filter = "[1:a]anull[aout]"

    filter_complex = f"{overlay_filter}; {audio_filter}"

    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        *inputs,
        "-filter_complex", filter_complex,
        "-map", "[vout]", "-map", "[aout]",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "21",
        "-c:a", "aac", "-b:a", "192k",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        "-t", f"{total_duration:.3f}",
        str(out_mp4),
    ]
    subprocess.run(cmd, check=True)
    return out_mp4
