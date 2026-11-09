"""Render a 1080×1920 cover PNG for the reel. Used as poster + Instagram grid thumbnail."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from .constants import FORMATS, resolve_colors

W, H = 1080, 1920


def render_cover(look: dict, hook_text: str, out: Path, font_path: Path) -> Path:
    colors = resolve_colors(look)
    img = Image.new("RGB", (W, H), colors["bgTop"])
    _vertical_gradient(img, colors["bgTop"], colors["bgBottom"])
    d = ImageDraw.Draw(img, "RGBA")

    # format chip (top)
    fmt = FORMATS.get(look.get("format", "classic-explainer"), {})
    chip_text = f"{look.get('format', 'classic-explainer').replace('-', ' ')}"
    _chip(d, chip_text.upper(), (60, 80), font_path, 36, colors["cards"], colors["text"])

    # handle chip (top right)
    handle = (look.get("handle") or "").lstrip("@")
    if handle:
        _chip(d, f"@{handle}", (W - 60, 80), font_path, 36, colors["cards"], colors["highlight"], align_right=True)

    # hook text, centered, wrapped
    font_big = _font(font_path, 120)
    lines = _wrap(hook_text, font_big, max_w=W - 180, draw=d)
    total_h = sum(font_big.getbbox(l)[3] for l in lines) + (len(lines) - 1) * 24
    y = (H - total_h) // 2
    for line in lines:
        w = d.textlength(line, font=font_big)
        d.text(((W - w) / 2, y), line, fill=colors["text"], font=font_big, stroke_width=6, stroke_fill="black")
        y += font_big.getbbox(line)[3] + 24

    # footer stripe
    d.rectangle([(0, H - 180), (W, H)], fill=(0, 0, 0, 120))
    d.text((60, H - 150), "reel · studio", fill=colors["text"], font=_font(font_path, 40))

    img.save(out, quality=92)
    return out


def _vertical_gradient(img: Image.Image, top_hex: str, bottom_hex: str) -> None:
    tr, tg, tb = _rgb(top_hex)
    br, bg, bb = _rgb(bottom_hex)
    px = img.load()
    for y in range(H):
        t = y / (H - 1)
        r = int(tr + (br - tr) * t); g = int(tg + (bg - tg) * t); b = int(tb + (bb - tb) * t)
        for x in range(W):
            px[x, y] = (r, g, b)


def _rgb(hex_: str) -> tuple[int, int, int]:
    h = hex_.lstrip("#")
    if len(h) == 3:
        h = "".join(c + c for c in h)
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def _font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(str(path), size)
    except Exception:
        return ImageFont.load_default()


def _wrap(text: str, font: ImageFont.FreeTypeFont, max_w: int, draw: ImageDraw.ImageDraw) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for w in words:
        test = f"{cur} {w}".strip()
        if draw.textlength(test, font=font) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines[:5]


def _chip(d: ImageDraw.ImageDraw, text: str, pos: tuple[int, int], font_path: Path,
          size: int, bg: str, fg: str, align_right: bool = False) -> None:
    font = _font(font_path, size)
    tw = d.textlength(text, font=font)
    th = font.getbbox(text)[3]
    pad_x, pad_y = 24, 10
    x, y = pos
    if align_right:
        x -= (tw + pad_x * 2)
    d.rounded_rectangle([(x, y - pad_y), (x + tw + pad_x * 2, y + th + pad_y)], radius=20, fill=bg)
    d.text((x + pad_x, y), text, fill=fg, font=font)
