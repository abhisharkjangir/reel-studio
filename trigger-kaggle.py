#!/usr/bin/env python3
"""Push the reel-maker notebook to Kaggle and start a run.

Usage:
    ./trigger-kaggle.py          # push + run once
    ./trigger-kaggle.py --watch  # also poll status until complete

Relies on the Kaggle CLI being auth'd (one-time: `kaggle auth login`).
"""
from __future__ import annotations

import argparse
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).parent
KAGGLE_DIR = ROOT / "kaggle"
KERNEL_ID = "abhisharjangir/notebook91c156c50d"
CLI = ROOT / ".venv" / "bin" / "kaggle"


def push() -> None:
    print(f"[trigger] pushing {KAGGLE_DIR}/reel-maker.ipynb to {KERNEL_ID} …")
    # `kaggle kernels push` uploads the notebook + metadata and starts a run.
    r = subprocess.run([str(CLI), "kernels", "push", "-p", str(KAGGLE_DIR)], capture_output=True, text=True)
    print(r.stdout.strip() or r.stderr.strip())
    r.check_returncode()


def status() -> dict:
    r = subprocess.run([str(CLI), "kernels", "status", KERNEL_ID], capture_output=True, text=True)
    out = r.stdout.strip()
    # Output shape: "KERNEL_ID has status \"<status>\""
    status = "unknown"
    for line in out.splitlines():
        if "has status" in line:
            status = line.split("\"")[1] if "\"" in line else line.split()[-1]
    return {"status": status, "raw": out}


def watch() -> str:
    """Poll until the kernel is no longer running. Returns the final status."""
    print("[trigger] polling kernel status …")
    while True:
        s = status()
        print(f"  {time.strftime('%H:%M:%S')}  {s['status']}")
        if s["status"] in ("complete", "error", "cancelled", "cancelAcknowledged"):
            return s["status"]
        time.sleep(15)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--watch", action="store_true", help="poll status until the run completes")
    args = ap.parse_args()
    push()
    if args.watch:
        final = watch()
        print(f"[trigger] final status: {final}")
        sys.exit(0 if final == "complete" else 1)
