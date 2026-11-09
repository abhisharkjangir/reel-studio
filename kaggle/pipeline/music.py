"""Pick a music bed from kaggle/assets/music/<id>.mp3 and side-chain duck it under the voice."""
from __future__ import annotations

from pathlib import Path

from .constants import resolve_music


def music_filter(look: dict, assets_dir: Path, total_duration: float) -> tuple[Path | None, str]:
    """Returns (music_file_path, ffmpeg_filter_string). If no music, returns (None, '').

    The returned filter expects:
      - input #1 (optional) = music mp3 (we return which file to use)
      - input #N-1 = concatenated voice wav
    and produces [aout] = voice ducked over music.
    """
    bed = resolve_music(look)
    if bed is None:
        return None, ""
    path = assets_dir / "music" / f"{bed}.mp3"
    if not path.exists():
        return None, ""
    # The caller wires: [music:a]volume=0.25,atrim=0:<dur>[m]; [voice:a][m]sidechaincompress=threshold=0.05:ratio=8:attack=5:release=400[aout]
    return path, ""  # actual graph is built in render.py which has the input indices
