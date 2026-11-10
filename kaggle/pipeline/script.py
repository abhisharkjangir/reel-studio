"""Call Google Gemini to turn a topic (or user script) into scene-level reel JSON.

Returns a dict shaped like:
    {
      "scenes": [{"voiceText": "...", "onScreenText": "...", "emoji": "...", "durationHint": 6.0}, ...],
      "caption": "...",
      "hashtags": ["#..."],
      "keywords": ["..."]
    }
"""
from __future__ import annotations

import json
import os
from typing import Any

from google import genai
from google.genai import types

from .constants import CTA_GUIDE, FORMATS, HOOK_STYLE_GUIDE, LANGUAGE_BY_ID

_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")

# Gemini accepts JSON Schema but ignores `additionalProperties` and the OpenAI wrapper.
# Keep it flat; required arrays are honored.
REEL_SCHEMA: dict[str, Any] = {
    "type": "object",
    "required": ["scenes", "caption", "hashtags", "keywords"],
    "properties": {
        "scenes": {
            "type": "array",
            "min_items": 3,
            "max_items": 10,
            "items": {
                "type": "object",
                "required": ["voiceText", "onScreenText", "emoji", "durationHint"],
                "properties": {
                    "voiceText":    {"type": "string", "description": "Exactly what the voice says. Natural spoken language. Keep per scene under 30 words."},
                    "onScreenText": {"type": "string", "description": "A very short (<= 6 words) headline for this scene displayed on the phone. Can be empty for the CTA."},
                    "emoji":        {"type": "string", "description": "One single emoji that labels the scene visually, e.g. '📱'."},
                    "durationHint": {"type": "number", "description": "Rough seconds for this scene, between 2 and 10."},
                },
            },
        },
        "caption":  {"type": "string", "description": "Post caption (<=220 chars). Same language as the reel."},
        "hashtags": {"type": "array", "min_items": 10, "max_items": 20, "items": {"type": "string"}},
        "keywords": {"type": "array", "min_items": 10, "max_items": 20, "items": {"type": "string"}},
    },
}


def _system_prompt(look: dict, job_input: dict) -> str:
    fmt = FORMATS.get(look.get("format", "classic-explainer"), FORMATS["classic-explainer"])
    beats = " → ".join(fmt["beats"])
    lang = LANGUAGE_BY_ID.get(job_input.get("language", "hinglish"), LANGUAGE_BY_ID["hinglish"])
    hook_guide = HOOK_STYLE_GUIDE.get(job_input.get("hookStyle", "auto"), HOOK_STYLE_GUIDE["auto"])
    cta_guide  = CTA_GUIDE.get(job_input.get("cta", "auto"), CTA_GUIDE["auto"])
    handle = (look.get("handle") or "").lstrip("@")

    return f"""You are a short-form video writer for Instagram reels aimed at Indian audiences.
Language: {lang['label']} — reply in this language only.
  - If the language is Hinglish, write in Latin script with a natural mix of English + Hindi words, the way Mumbai creators text.
  - If the language is Hindi, write in Devanagari.
  - If the language is any other Indian language (Tamil, Telugu, etc.), write in that language's native script.

Format: {look.get('format')} — follow this beat structure strictly, one scene per beat: {beats}.
Hook style: {job_input.get('hookStyle', 'auto')} — {hook_guide}
Call to action: {job_input.get('cta', 'auto')} — {cta_guide}
Notes from the creator (always apply): {job_input.get('notes') or 'none'}
Creator handle (reference them if needed, don't hallucinate others): @{handle or 'creator'}

Hard rules:
  - voiceText is what the narrator actually speaks. Natural, conversational, under 30 words per scene.
  - onScreenText is a tiny headline (<=6 words) sitting on top of the voice. Never a full sentence.
  - The very first scene MUST hook in under 3 seconds.
  - The final scene MUST be the call-to-action and nothing else.
  - hashtags: 10-20 total, each must start with '#', mixed broad + specific, all lowercase except brand names.
  - keywords: 10-20 search-intent phrases a viewer would TYPE to find this topic (not hashtags, no '#').

Return JSON that matches the provided schema."""


def generate_script(job_input: dict, look: dict) -> dict:
    """Call Gemini and return the parsed reel JSON. Raises on failure."""
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    if job_input.get("ownScript", "").strip():
        user_msg = (
            "The creator has pasted their own script below. Split it into scenes without rewording the ideas, "
            "but you may tighten sentences and pick natural scene breaks. Still produce caption + hashtags + keywords.\n\n"
            + job_input["ownScript"].strip()
        )
    else:
        user_msg = f"Topic: {job_input.get('topic', '').strip()}"

    resp = client.models.generate_content(
        model=_MODEL,
        contents=user_msg,
        config=types.GenerateContentConfig(
            system_instruction=_system_prompt(look, job_input),
            temperature=0.8,
            response_mime_type="application/json",
            response_schema=REEL_SCHEMA,
        ),
    )

    content = resp.text or "{}"
    data = json.loads(content)

    # Gemini occasionally returns hashtags without the leading '#'. Normalize.
    data["hashtags"] = [h if h.startswith("#") else f"#{h}" for h in data.get("hashtags", [])]
    return data


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--topic", default="")
    ap.add_argument("--script", default="")
    ap.add_argument("--language", default="hinglish")
    ap.add_argument("--hook", default="auto")
    ap.add_argument("--cta", default="auto")
    ap.add_argument("--format", default="classic-explainer")
    args = ap.parse_args()
    out = generate_script(
        {"topic": args.topic, "ownScript": args.script, "language": args.language,
         "hookStyle": args.hook, "cta": args.cta, "notes": ""},
        {"format": args.format, "handle": ""},
    )
    print(json.dumps(out, indent=2, ensure_ascii=False))
