"""Mirror of web/lib/constants.ts for the Kaggle worker. Keep in sync."""

LANGUAGES = [
    {"id": "hinglish",  "label": "Hinglish",  "sarvam_only": False, "elevenlabs": True},
    {"id": "english",   "label": "English",   "sarvam_only": False, "elevenlabs": True},
    {"id": "hindi",     "label": "Hindi",     "sarvam_only": False, "elevenlabs": True},
    {"id": "telugu",    "label": "Telugu",    "sarvam_only": True,  "elevenlabs": False},
    {"id": "malayalam", "label": "Malayalam", "sarvam_only": True,  "elevenlabs": False},
    {"id": "marathi",   "label": "Marathi",   "sarvam_only": True,  "elevenlabs": False},
    {"id": "bengali",   "label": "Bengali",   "sarvam_only": True,  "elevenlabs": False},
    {"id": "gujarati",  "label": "Gujarati",  "sarvam_only": True,  "elevenlabs": False},
    {"id": "punjabi",   "label": "Punjabi",   "sarvam_only": True,  "elevenlabs": False},
    {"id": "odia",      "label": "Odia",      "sarvam_only": True,  "elevenlabs": False},
]
LANGUAGE_BY_ID = {l["id"]: l for l in LANGUAGES}

# Language code mappings to provider-native codes
LANG_TO_ELEVENLABS = {
    "english": "en", "hindi": "hi", "hinglish": "hi",
}
LANG_TO_SARVAM = {
    "hinglish": "hi-IN", "english": "en-IN", "hindi": "hi-IN",
    "telugu": "te-IN", "malayalam": "ml-IN", "marathi": "mr-IN",
    "bengali": "bn-IN", "gujarati": "gu-IN", "punjabi": "pa-IN", "odia": "od-IN",
}

# Format beat-structures used to guide the LLM
FORMATS = {
    "classic-explainer":   {"beats": ["hook", "step-1", "step-2", "step-3", "cta"],       "default_music": "lofi"},
    "top-5-list":          {"beats": ["hook", "no-5", "no-4", "no-3", "no-2", "no-1", "cta"], "default_music": "upbeat"},
    "myth-vs-fact":        {"beats": ["hook", "myth-1", "myth-2", "myth-3", "cta"],       "default_music": "tech"},
    "how-to-steps":        {"beats": ["hook", "step-1", "step-2", "step-3", "step-4", "cta"], "default_music": "lofi"},
    "x-vs-y":              {"beats": ["hook", "x-case", "y-case", "when-x", "when-y", "cta"], "default_music": "tech"},
    "news-60s":            {"beats": ["hook", "what-happened", "why-matters", "what-next", "cta"], "default_music": "tech"},
    "story-case-study":    {"beats": ["hook", "problem", "turning-point", "lesson", "cta"], "default_music": "cinematic"},
    "timeline-history":    {"beats": ["hook", "era-1", "era-2", "era-3", "today", "cta"],  "default_music": "cinematic"},
    "quiz-challenge":      {"beats": ["hook", "q1", "a1", "q2", "a2", "q3", "a3", "cta"], "default_music": "upbeat"},
    "jargon-buster":       {"beats": ["hook", "scary-def", "plain-def", "example", "cta"], "default_music": "lofi"},
    "mistakes-to-avoid":   {"beats": ["hook", "mistake-1", "mistake-2", "mistake-3", "cta"], "default_music": "tech"},
    "tips-hacks":          {"beats": ["hook", "tip-1", "tip-2", "tip-3", "tip-4", "cta"], "default_music": "upbeat"},
    "by-the-numbers":      {"beats": ["hook", "num-1", "num-2", "num-3", "num-4", "cta"], "default_music": "tech"},
    "app-walkthrough":     {"beats": ["hook", "screen-1", "screen-2", "screen-3", "cta"], "default_music": "tech"},
    "rapid-fire-faq":      {"beats": ["hook", "q1", "q2", "q3", "q4", "cta"],             "default_music": "upbeat"},
    "before-after":        {"beats": ["hook", "before", "shift", "after", "cta"],         "default_music": "cinematic"},
    "pros-cons":           {"beats": ["hook", "pro-1", "pro-2", "con-1", "con-2", "cta"], "default_music": "tech"},
    "eli5":                {"beats": ["hook", "big-question", "analogy", "unpack", "cta"], "default_music": "calm"},
    "two-sides":           {"beats": ["hook", "side-a", "side-b", "vote", "cta"],         "default_music": "cinematic"},
    "book-in-60s":         {"beats": ["hook", "big-idea", "key-1", "key-2", "takeaway", "cta"], "default_music": "calm"},
}

HOOK_STYLE_GUIDE = {
    "auto":       "Pick the hook style that fits this format best.",
    "curiosity":  "Open with a question that creates a knowledge gap the viewer wants closed.",
    "story":      "Open with a mini-narrative: a specific person, a specific moment.",
    "painful":    "Open by naming the viewer's pain: 'Are you tired of X?'",
    "relatable":  "Open with an everyday scene the viewer has lived.",
    "freebie":    "Open by promising a free thing they'll get by watching.",
    "shock-stat": "Open with a surprising number that reframes the topic.",
    "contrarian": "Open by challenging an assumption most people hold.",
    "challenge":  "Open with a dare: 'Try this for 7 days.'",
}

CTA_GUIDE = {
    "auto":    "Pick the CTA that this script's content most naturally invites.",
    "comment": "Ask viewers to drop a keyword in the comments.",
    "save":    "Ask viewers to save the reel for later.",
    "share":   "Ask viewers to share with one person.",
    "follow":  "Ask viewers to follow for more.",
    "try":     "Ask viewers to try the thing themselves today.",
}

# A music bed file lives under kaggle/assets/music/<id>.mp3
MUSIC_BEDS = ["lofi", "upbeat", "cinematic", "tech", "calm", "none"]

ELEVENLABS_VOICES = {
    "EXAVITQu4vr4xnSDxMaL": "Sarah",
    "nPczCjzI2devNBz1zQrb": "Brian",
    "onwK4e9ZLuTAKqWW03F9": "Daniel",
    "JBFqnCBsd6RMkjVDRZzb": "George",
    "TX3LPaxmHKxFdv7VOQHJ": "Liam",
    "pFZP5JQG7iQjIQuC4Bku": "Lily",
}

# Fonts available (bundled under kaggle/assets/fonts/<name>.ttf)
FONTS = [
    "Space Grotesk", "JetBrains Mono", "IBM Plex Mono", "Space Mono",
    "Baloo 2", "Sora", "Lexend", "Manrope", "Poppins", "Fredoka",
    "Bricolage Grotesque", "Playfair Display", "Caveat", "Merriweather",
    "Outfit", "Rubik", "Nunito", "Syne", "Unbounded", "Kalam",
]

# Theme colors (fallback when look.colors is null)
THEME_COLORS = {
    "midnight":   {"main": "#8b5cf6", "second": "#6366f1", "highlight": "#f59e0b", "bgTop": "#0a0b14", "bgBottom": "#111827", "text": "#f3f4f6", "cards": "#1f2937"},
    "chai":       {"main": "#b45309", "second": "#92400e", "highlight": "#dc2626", "bgTop": "#fef3c7", "bgBottom": "#fde68a", "text": "#1c1917", "cards": "#ffffff"},
    "neon-city":  {"main": "#ec4899", "second": "#06b6d4", "highlight": "#fde047", "bgTop": "#0f0520", "bgBottom": "#1e0535", "text": "#f9fafb", "cards": "#1e1b4b"},
    "ocean":      {"main": "#0ea5e9", "second": "#06b6d4", "highlight": "#facc15", "bgTop": "#082f49", "bgBottom": "#0c4a6e", "text": "#f0f9ff", "cards": "#0369a1"},
    "forest":     {"main": "#22c55e", "second": "#84cc16", "highlight": "#f59e0b", "bgTop": "#052e16", "bgBottom": "#14532d", "text": "#f0fdf4", "cards": "#166534"},
    "sunset":     {"main": "#f97316", "second": "#ef4444", "highlight": "#fde047", "bgTop": "#431407", "bgBottom": "#7c2d12", "text": "#fff7ed", "cards": "#9a3412"},
    "candy":      {"main": "#ec4899", "second": "#a855f7", "highlight": "#f97316", "bgTop": "#fce7f3", "bgBottom": "#fbcfe8", "text": "#581c87", "cards": "#ffffff"},
    "mono":       {"main": "#d4d4d8", "second": "#a1a1aa", "highlight": "#ffffff", "bgTop": "#09090b", "bgBottom": "#18181b", "text": "#fafafa", "cards": "#27272a"},
    "newspaper":  {"main": "#1f2937", "second": "#4b5563", "highlight": "#dc2626", "bgTop": "#fafaf9", "bgBottom": "#f5f5f4", "text": "#18181b", "cards": "#ffffff"},
    "chalkboard": {"main": "#fef3c7", "second": "#fde68a", "highlight": "#fda4af", "bgTop": "#1c1917", "bgBottom": "#292524", "text": "#fafaf9", "cards": "#44403c"},
    "blueprint":  {"main": "#60a5fa", "second": "#93c5fd", "highlight": "#fef3c7", "bgTop": "#1e3a8a", "bgBottom": "#1e40af", "text": "#dbeafe", "cards": "#1d4ed8"},
    "terminal":   {"main": "#4ade80", "second": "#86efac", "highlight": "#fde047", "bgTop": "#020617", "bgBottom": "#0f172a", "text": "#4ade80", "cards": "#0f172a"},
    "royal":      {"main": "#fbbf24", "second": "#f59e0b", "highlight": "#f87171", "bgTop": "#1e1b4b", "bgBottom": "#312e81", "text": "#fef9c3", "cards": "#3730a3"},
    "mint":       {"main": "#10b981", "second": "#059669", "highlight": "#f97316", "bgTop": "#ecfdf5", "bgBottom": "#d1fae5", "text": "#064e3b", "cards": "#ffffff"},
    "desert":     {"main": "#d97706", "second": "#b45309", "highlight": "#dc2626", "bgTop": "#fef3c7", "bgBottom": "#fde68a", "text": "#78350f", "cards": "#ffffff"},
    "sakura":     {"main": "#f472b6", "second": "#fb7185", "highlight": "#a78bfa", "bgTop": "#fdf2f8", "bgBottom": "#fce7f3", "text": "#831843", "cards": "#ffffff"},
    "lava":       {"main": "#ef4444", "second": "#f97316", "highlight": "#fde047", "bgTop": "#450a0a", "bgBottom": "#7f1d1d", "text": "#fef2f2", "cards": "#991b1b"},
    "arctic":     {"main": "#0ea5e9", "second": "#0284c7", "highlight": "#f97316", "bgTop": "#f0f9ff", "bgBottom": "#e0f2fe", "text": "#0c4a6e", "cards": "#ffffff"},
    "synthwave":  {"main": "#ec4899", "second": "#8b5cf6", "highlight": "#06b6d4", "bgTop": "#2e1065", "bgBottom": "#4c1d95", "text": "#faf5ff", "cards": "#6d28d9"},
    "kraft":      {"main": "#854d0e", "second": "#713f12", "highlight": "#dc2626", "bgTop": "#fef3c7", "bgBottom": "#fde68a", "text": "#422006", "cards": "#fef3c7"},
}


def resolve_colors(look):
    """Returns the effective color palette for a Look (overrides on top of theme)."""
    base = dict(THEME_COLORS.get(look.get("theme", "midnight"), THEME_COLORS["midnight"]))
    overrides = look.get("colors") or {}
    base.update(overrides)
    return base


def resolve_music(look):
    """Returns the music bed id, or None for silence."""
    music = look.get("music", "format-default")
    if music == "format-default":
        music = FORMATS.get(look.get("format", "classic-explainer"), {}).get("default_music", "lofi")
    if music == "none":
        return None
    return music
