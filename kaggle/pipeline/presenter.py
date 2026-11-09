"""Render a 1080×1920 PNG of the presenter avatar in the bottom-right corner.

For the MVP we render ONE idle frame (closed mouth) and overlay it as a static
image — the mouth-sync is a nice-to-have we can add once the full pipeline is
working end-to-end. The function returns the PNG path, or None if the look has
presenter.mode == "none".
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw


READY_PRESETS = {
    "arjun": {"skin": "#c78a5c", "hair": "short",    "hair_color": "#000000", "outfit": "shirt",  "outfit_color": "#1e40af"},
    "meera": {"skin": "#f3c892", "hair": "long",     "hair_color": "#1a1a1a", "outfit": "saree",  "outfit_color": "#8b5cf6"},
    "bolt":  {"skin": "#d4a574", "hair": "spiky",    "hair_color": "#dc2626", "outfit": "tshirt", "outfit_color": "#18181b"},
    "miko":  {"skin": "#f1d7b8", "hair": "bob",      "hair_color": "#ec4899", "outfit": "jacket", "outfit_color": "#06b6d4"},
    "kabir": {"skin": "#a8724a", "hair": "sidepart", "hair_color": "#1f2937", "outfit": "blazer", "outfit_color": "#1e293b"},
    "zara":  {"skin": "#c48c5f", "hair": "curly",    "hair_color": "#422006", "outfit": "shirt",  "outfit_color": "#f59e0b"},
    "dadi":  {"skin": "#e6b996", "hair": "bun",      "hair_color": "#f5f5f4", "outfit": "saree",  "outfit_color": "#b91c1c"},
    "chintu":{"skin": "#d8a276", "hair": "short",    "hair_color": "#18181b", "outfit": "tshirt", "outfit_color": "#22c55e"},
    "owlie": {"skin": "#d4a574", "hair": "buzz",     "hair_color": "#44403c", "outfit": "hoodie", "outfit_color": "#7c3aed"},
    "pixel": {"skin": "#edb98a", "hair": "ponytail", "hair_color": "#06b6d4", "outfit": "tshirt", "outfit_color": "#18181b"},
}


def render_presenter_png(look: dict, out: Path) -> Path | None:
    p = look.get("presenter") or {}
    if p.get("mode") == "none":
        return None
    preset = READY_PRESETS.get(p.get("preset", "arjun"), READY_PRESETS["arjun"])
    custom = p.get("custom") or {}
    skin   = custom.get("skin")        or preset["skin"]
    hair   = custom.get("hair")        or preset["hair"]
    hair_c = custom.get("hairColor")   or preset["hair_color"]
    outfit_c = custom.get("outfitColor") or preset["outfit_color"]

    # 420×480 is the final size; render larger then downscale for smoothing
    W, H = 840, 960
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # outfit
    d.polygon([(W*0.17, H*0.99), (W*0.17, H*0.78), (W*0.37, H*0.75), (W*0.63, H*0.75), (W*0.83, H*0.78), (W*0.83, H*0.99)], fill=outfit_c)
    # neck
    d.rectangle([(W*0.43, H*0.62), (W*0.57, H*0.78)], fill=skin)
    # head
    d.ellipse([(W*0.25, H*0.12), (W*0.75, H*0.68)], fill=skin)
    # hair
    if hair != "bald":
        if hair == "long":
            d.polygon([(W*0.24, H*0.38), (W*0.24, H*0.12), (W*0.76, H*0.12), (W*0.76, H*0.68), (W*0.70, H*0.68), (W*0.70, H*0.33), (W*0.30, H*0.33), (W*0.30, H*0.68), (W*0.24, H*0.68)], fill=hair_c)
        elif hair == "bun":
            d.pieslice([(W*0.23, H*0.10), (W*0.77, H*0.42)], 180, 360, fill=hair_c)
            d.ellipse([(W*0.42, H*0.02), (W*0.58, H*0.14)], fill=hair_c)
        elif hair == "bob":
            d.polygon([(W*0.22, H*0.52), (W*0.22, H*0.14), (W*0.78, H*0.14), (W*0.78, H*0.52), (W*0.70, H*0.52), (W*0.70, H*0.34), (W*0.30, H*0.34), (W*0.30, H*0.52)], fill=hair_c)
        elif hair == "spiky":
            pts = []
            for i in range(8):
                x = W*0.24 + (W*0.52) * (i/8)
                pts.append((x, H*0.30))
                pts.append((x + W*0.03, H*0.08))
            pts.append((W*0.76, H*0.30))
            d.polygon(pts, fill=hair_c)
        elif hair == "curly":
            for cx, cy in [(0.32, 0.22), (0.50, 0.16), (0.68, 0.22), (0.25, 0.32), (0.75, 0.32)]:
                d.ellipse([(W*cx-50, H*cy-40), (W*cx+50, H*cy+40)], fill=hair_c)
        else:  # short / sidepart / wavy / ponytail / buzz / afro
            d.pieslice([(W*0.22, H*0.08), (W*0.78, H*0.42)], 180, 360, fill=hair_c)
    # eyes
    d.ellipse([(W*0.38, H*0.40), (W*0.44, H*0.46)], fill="#1f2937")
    d.ellipse([(W*0.56, H*0.40), (W*0.62, H*0.46)], fill="#1f2937")
    # mouth
    d.arc([(W*0.40, H*0.52), (W*0.60, H*0.60)], start=0, end=180, fill="#7a2a2a", width=6)

    img = img.resize((420, 480), Image.LANCZOS)
    # Place in a 1080×1920 transparent canvas, bottom-right-anchored with 60px margin
    canvas = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    canvas.paste(img, (1080 - 420 - 60, 1920 - 480 - 240), img)
    canvas.save(out)
    return out
