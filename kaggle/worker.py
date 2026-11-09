"""Reel-maker worker — the thing that runs inside the Kaggle notebook.

Loop:
  1. List queue/*.json — pick the oldest with status == "pending".
  2. Claim it (PUT status=claimed) so repeated starts don't double-render.
  3. Fetch the Look for the job.
  4. Script → voice → cover + bg → presenter → render → upload.
  5. PUT queue/<id>.json with status=done and output URLs.
  6. Idle for 5 minutes with no work → exit, so Kaggle shuts the session down.
"""
from __future__ import annotations

import datetime
import os
import shutil
import time
import traceback
from pathlib import Path

from pipeline import blob_client, script, voice, presenter, music, render
from pipeline.constants import FONTS

ASSETS   = Path(__file__).parent / "assets"
WORK_ROOT = Path("/tmp/reel-studio-work")
IDLE_EXIT_SECS = 5 * 60
POLL_SECS = 15


def main() -> None:
    print("[worker] starting", flush=True)
    WORK_ROOT.mkdir(parents=True, exist_ok=True)
    last_job_ts = time.time()

    while True:
        job = claim_next_job()
        if job is None:
            if time.time() - last_job_ts > IDLE_EXIT_SECS:
                print(f"[worker] idle for {IDLE_EXIT_SECS}s — exiting.")
                return
            time.sleep(POLL_SECS)
            continue

        last_job_ts = time.time()
        jid = job["id"]
        work = WORK_ROOT / jid
        work.mkdir(exist_ok=True)
        try:
            process_job(job, work)
        except Exception as e:
            traceback.print_exc()
            fail(job, f"{type(e).__name__}: {e}")
        finally:
            # Keep the directory for debugging if we failed.
            if get_blob_job(jid).get("status") == "done":
                shutil.rmtree(work, ignore_errors=True)


# ── job lifecycle ─────────────────────────────────────────────────────────────

def claim_next_job() -> dict | None:
    blobs = blob_client.list_("queue/")
    pendings = []
    for b in blobs:
        if not b["pathname"].endswith(".json"):
            continue
        j = blob_client.get_json(b["pathname"])
        if j and j.get("status") == "pending":
            pendings.append(j)
    pendings.sort(key=lambda j: j.get("createdAt", ""))
    for j in pendings:
        j["status"] = "claimed"
        j["updatedAt"] = _now()
        blob_client.put_json(f"queue/{j['id']}.json", j)
        print(f"[worker] claimed {j['id']}", flush=True)
        return j
    return None


def process_job(job: dict, work: Path) -> None:
    jid = job["id"]
    print(f"[worker] processing {jid}", flush=True)
    mark(job, "rendering")

    look = blob_client.get_json(f"looks/{job['input']['lookId']}.json") or {}
    if not look:
        raise RuntimeError(f"Look {job['input']['lookId']} not found")

    # 1. Script
    print(f"[worker] {jid} · script", flush=True)
    scripted = script.generate_script(job["input"], look)
    (work / "script.json").write_text(__import__("json").dumps(scripted, ensure_ascii=False, indent=2))

    # 2. Voice per scene
    scenes_out: list[dict] = []
    for i, sc in enumerate(scripted["scenes"]):
        print(f"[worker] {jid} · voice {i+1}/{len(scripted['scenes'])}", flush=True)
        wav = work / f"scene-{i:02d}.wav"
        a = voice.synth_scene(sc["voiceText"], wav, look, job["input"]["language"])
        scenes_out.append({
            "onScreenText": sc.get("onScreenText", ""),
            "voiceText":    sc["voiceText"],
            "emoji":        sc.get("emoji", ""),
            "voice_wav":    wav,
            "duration":     max(2.0, a.duration_s),
            "words":        a.words,
        })

    # 3. Cover (hero) PNG from first scene
    font_path = _resolve_font(look.get("font", "Space Grotesk"))
    cover_png = work / "cover.jpg"
    from pipeline.cover import render_cover
    render_cover(look, scripted["scenes"][0].get("onScreenText") or scripted["scenes"][0]["voiceText"][:40], cover_png, font_path)

    # 4. Presenter
    pres_png = presenter.render_presenter_png(look, work / "presenter.png")

    # 5. Music
    music_mp3, _ = music.music_filter(look, ASSETS, sum(s["duration"] for s in scenes_out))

    # 6. Render
    print(f"[worker] {jid} · render", flush=True)
    out_mp4 = work / "reel.mp4"
    render.render_reel(
        scenes=scenes_out, look=look,
        presenter_png=pres_png, music_mp3=music_mp3,
        assets_dir=ASSETS, work_dir=work / "render",
        out_mp4=out_mp4, font_path=font_path,
    )

    # 7. Upload mp4 + cover
    print(f"[worker] {jid} · upload", flush=True)
    mp4_url   = blob_client.put_file(f"outputs/{jid}.mp4", out_mp4, "video/mp4")
    cover_url = blob_client.put_file(f"outputs/{jid}.jpg", cover_png, "image/jpeg")

    # 8. Mark done
    job["status"] = "done"
    job["updatedAt"] = _now()
    job["output"] = {
        "mp4Url":   mp4_url,
        "coverUrl": cover_url,
        "caption":  scripted.get("caption", ""),
        "hashtags": scripted.get("hashtags", []),
        "keywords": scripted.get("keywords", []),
        "scenes":   [{"voiceText": s["voiceText"], "onScreenText": s["onScreenText"], "emoji": s["emoji"]} for s in scenes_out],
    }
    blob_client.put_json(f"queue/{jid}.json", job)
    print(f"[worker] {jid} done · {mp4_url}", flush=True)


def mark(job: dict, status: str) -> None:
    job["status"] = status
    job["updatedAt"] = _now()
    blob_client.put_json(f"queue/{job['id']}.json", job)


def fail(job: dict, message: str) -> None:
    job["status"] = "failed"
    job["error"] = message
    job["updatedAt"] = _now()
    blob_client.put_json(f"queue/{job['id']}.json", job)
    print(f"[worker] {job['id']} FAILED: {message}", flush=True)


def get_blob_job(jid: str) -> dict:
    return blob_client.get_json(f"queue/{jid}.json") or {}


def _now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def _resolve_font(name: str) -> Path:
    # Pick a bundled font if present; otherwise fall back to a system font so render still works.
    safe = name.replace(" ", "")
    candidates = [
        ASSETS / "fonts" / f"{safe}.ttf",
        ASSETS / "fonts" / f"{safe}-Bold.ttf",
        ASSETS / "fonts" / "SpaceGrotesk-Bold.ttf",
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
        Path("/System/Library/Fonts/Helvetica.ttc"),
    ]
    for p in candidates:
        if p.exists():
            return p
    raise RuntimeError("No font available. Add one to kaggle/assets/fonts/.")


if __name__ == "__main__":
    main()
