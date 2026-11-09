"""Burn word-by-word captions onto the video using ffmpeg's drawtext filter.

Takes a list of `[(word, start, end), ...]` per scene and produces one big
drawtext filter string that pops the current word in the lower-third with a
scale-up ease. Simpler and faster than rendering per-frame Pillow overlays
on Kaggle's CPU budget.
"""
from __future__ import annotations

from pathlib import Path

CAPTION_Y = "h-h/3"  # vertical position
BOX_PADDING = 24


def ffmpeg_caption_filter(words: list[tuple[str, float, float]], scene_offset: float,
                           font_path: Path, color_hex: str, box_hex: str) -> str:
    """Returns a drawtext filter chain for a single scene's words."""
    chunks = []
    for (w, s, e) in words:
        txt = _escape(w.upper())
        # Fade-in over 80ms, hold, then fade-out over 60ms (FFmpeg handles via alpha expr)
        start = scene_offset + s
        end   = scene_offset + e
        alpha = f"if(lt(t,{start:.3f}),0, if(lt(t,{start+0.08:.3f}),(t-{start:.3f})/0.08, if(lt(t,{end-0.06:.3f}),1, if(lt(t,{end:.3f}),({end:.3f}-t)/0.06, 0))))"
        chunks.append(
            f"drawtext=fontfile='{font_path}':text='{txt}':"
            f"fontsize=84:fontcolor={color_hex}:borderw=4:bordercolor=black@0.8:"
            f"box=1:boxcolor={box_hex}@0.9:boxborderw={BOX_PADDING}:"
            f"x=(w-text_w)/2:y={CAPTION_Y}:"
            f"alpha='{alpha}':"
            f"enable='between(t,{start:.3f},{end:.3f})'"
        )
    return ",".join(chunks)


def _escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace(":", r"\:").replace("'", r"\'")
