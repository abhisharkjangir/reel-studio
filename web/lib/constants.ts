// All taxonomies for Reel Studio — mirrored in kaggle/pipeline/constants.py.
// Edit both or regenerate from one source if you change anything.

export const LANGUAGES = [
  { id: "hinglish", label: "Hinglish", sarvamOnly: false, elevenlabs: true },
  { id: "english", label: "English", sarvamOnly: false, elevenlabs: true },
  { id: "hindi", label: "Hindi", sarvamOnly: false, elevenlabs: true },
  { id: "telugu", label: "Telugu", sarvamOnly: true, elevenlabs: false },
  { id: "malayalam", label: "Malayalam", sarvamOnly: true, elevenlabs: false },
  { id: "marathi", label: "Marathi", sarvamOnly: true, elevenlabs: false },
  { id: "bengali", label: "Bengali", sarvamOnly: true, elevenlabs: false },
  { id: "gujarati", label: "Gujarati", sarvamOnly: true, elevenlabs: false },
  { id: "punjabi", label: "Punjabi", sarvamOnly: true, elevenlabs: false },
  { id: "odia", label: "Odia", sarvamOnly: true, elevenlabs: false },
] as const;

export type LanguageId = (typeof LANGUAGES)[number]["id"];

export const FORMATS = [
  { id: "classic-explainer", emoji: "💡", label: "Classic Explainer", description: "How something works, step by step.", defaultMusic: "lofi" },
  { id: "top-5-list", emoji: "🏆", label: "Top 5 List", description: "Countdown of 5 items, best saved for last.", defaultMusic: "upbeat" },
  { id: "myth-vs-fact", emoji: "🧐", label: "Myth vs Fact", description: "Bust 3 popular myths, one per scene.", defaultMusic: "tech" },
  { id: "how-to-steps", emoji: "🛠️", label: "How-To Steps", description: "A practical tutorial: do X in N steps.", defaultMusic: "lofi" },
  { id: "x-vs-y", emoji: "⚔️", label: "X vs Y", description: "Fair comparison of two options and when to choose which.", defaultMusic: "tech" },
  { id: "news-60s", emoji: "📰", label: "News in 60 Seconds", description: "What happened, why it matters, what next.", defaultMusic: "tech" },
  { id: "story-case-study", emoji: "📖", label: "Story / Case Study", description: "A real story: problem → turning point → lesson.", defaultMusic: "cinematic" },
  { id: "timeline-history", emoji: "🕰️", label: "Timeline / History", description: "How something changed over time, era by era.", defaultMusic: "cinematic" },
  { id: "quiz-challenge", emoji: "❓", label: "Quiz Challenge", description: "Ask 3 questions, pause, reveal answers.", defaultMusic: "upbeat" },
  { id: "jargon-buster", emoji: "🔤", label: "Jargon Buster", description: "Explain one confusing word in plain language.", defaultMusic: "lofi" },
  { id: "mistakes-to-avoid", emoji: "🚫", label: "Mistakes to Avoid", description: "3-4 common mistakes and what to do instead.", defaultMusic: "tech" },
  { id: "tips-hacks", emoji: "⚡", label: "Tips & Hacks", description: "Quick useful tricks people can try today.", defaultMusic: "upbeat" },
  { id: "by-the-numbers", emoji: "📊", label: "By the Numbers", description: "A topic told through 4-5 striking numbers.", defaultMusic: "tech" },
  { id: "app-walkthrough", emoji: "📱", label: "App / Feature Walkthrough", description: "Show how a feature works screen by screen.", defaultMusic: "tech" },
  { id: "rapid-fire-faq", emoji: "🙋", label: "Rapid-Fire FAQ", description: "Answer the 4 most asked questions quickly.", defaultMusic: "upbeat" },
  { id: "before-after", emoji: "🔄", label: "Before / After", description: "Show the change: the old way vs the new way.", defaultMusic: "cinematic" },
  { id: "pros-cons", emoji: "⚖️", label: "Pros & Cons", description: "Balanced look at the good and the bad.", defaultMusic: "tech" },
  { id: "eli5", emoji: "🧸", label: "Explain Like I'm 5", description: "A hard idea explained with a simple analogy.", defaultMusic: "calm" },
  { id: "two-sides", emoji: "🗣️", label: "Two Sides", description: "Present both sides of a debate, let viewers vote.", defaultMusic: "cinematic" },
  { id: "book-in-60s", emoji: "📚", label: "Book / Article in 60s", description: "Key ideas of a book, report or long article.", defaultMusic: "calm" },
] as const;

export type FormatId = (typeof FORMATS)[number]["id"];

export const HOOK_STYLES = [
  { id: "auto", label: "Let the AI pick" },
  { id: "curiosity", label: "Curiosity" },
  { id: "story", label: "Story" },
  { id: "painful", label: "Painful" },
  { id: "relatable", label: "Relatable" },
  { id: "freebie", label: "Freebie" },
  { id: "shock-stat", label: "Shock stat" },
  { id: "contrarian", label: "Contrarian" },
  { id: "challenge", label: "Challenge" },
] as const;

export const CTAS = [
  { id: "auto", label: "Let the AI pick" },
  { id: "comment", label: "Comment" },
  { id: "save", label: "Save" },
  { id: "share", label: "Share" },
  { id: "follow", label: "Follow" },
  { id: "try", label: "Try" },
] as const;

export const THEMES = [
  { id: "midnight", label: "Midnight", mode: "dark", colors: { main: "#8b5cf6", second: "#6366f1", highlight: "#f59e0b", bgTop: "#0a0b14", bgBottom: "#111827", text: "#f3f4f6", cards: "#1f2937" } },
  { id: "chai", label: "Chai", mode: "light", colors: { main: "#b45309", second: "#92400e", highlight: "#dc2626", bgTop: "#fef3c7", bgBottom: "#fde68a", text: "#1c1917", cards: "#ffffff" } },
  { id: "neon-city", label: "Neon City", mode: "dark", colors: { main: "#ec4899", second: "#06b6d4", highlight: "#fde047", bgTop: "#0f0520", bgBottom: "#1e0535", text: "#f9fafb", cards: "#1e1b4b" } },
  { id: "ocean", label: "Ocean", mode: "dark", colors: { main: "#0ea5e9", second: "#06b6d4", highlight: "#facc15", bgTop: "#082f49", bgBottom: "#0c4a6e", text: "#f0f9ff", cards: "#0369a1" } },
  { id: "forest", label: "Forest", mode: "dark", colors: { main: "#22c55e", second: "#84cc16", highlight: "#f59e0b", bgTop: "#052e16", bgBottom: "#14532d", text: "#f0fdf4", cards: "#166534" } },
  { id: "sunset", label: "Sunset", mode: "dark", colors: { main: "#f97316", second: "#ef4444", highlight: "#fde047", bgTop: "#431407", bgBottom: "#7c2d12", text: "#fff7ed", cards: "#9a3412" } },
  { id: "candy", label: "Candy", mode: "light", colors: { main: "#ec4899", second: "#a855f7", highlight: "#f97316", bgTop: "#fce7f3", bgBottom: "#fbcfe8", text: "#581c87", cards: "#ffffff" } },
  { id: "mono", label: "Mono", mode: "dark", colors: { main: "#d4d4d8", second: "#a1a1aa", highlight: "#ffffff", bgTop: "#09090b", bgBottom: "#18181b", text: "#fafafa", cards: "#27272a" } },
  { id: "newspaper", label: "Newspaper", mode: "light", colors: { main: "#1f2937", second: "#4b5563", highlight: "#dc2626", bgTop: "#fafaf9", bgBottom: "#f5f5f4", text: "#18181b", cards: "#ffffff" } },
  { id: "chalkboard", label: "Chalkboard", mode: "dark", colors: { main: "#fef3c7", second: "#fde68a", highlight: "#fda4af", bgTop: "#1c1917", bgBottom: "#292524", text: "#fafaf9", cards: "#44403c" } },
  { id: "blueprint", label: "Blueprint", mode: "dark", colors: { main: "#60a5fa", second: "#93c5fd", highlight: "#fef3c7", bgTop: "#1e3a8a", bgBottom: "#1e40af", text: "#dbeafe", cards: "#1d4ed8" } },
  { id: "terminal", label: "Terminal", mode: "dark", colors: { main: "#4ade80", second: "#86efac", highlight: "#fde047", bgTop: "#020617", bgBottom: "#0f172a", text: "#4ade80", cards: "#0f172a" } },
  { id: "royal", label: "Royal", mode: "dark", colors: { main: "#fbbf24", second: "#f59e0b", highlight: "#f87171", bgTop: "#1e1b4b", bgBottom: "#312e81", text: "#fef9c3", cards: "#3730a3" } },
  { id: "mint", label: "Mint", mode: "light", colors: { main: "#10b981", second: "#059669", highlight: "#f97316", bgTop: "#ecfdf5", bgBottom: "#d1fae5", text: "#064e3b", cards: "#ffffff" } },
  { id: "desert", label: "Desert", mode: "light", colors: { main: "#d97706", second: "#b45309", highlight: "#dc2626", bgTop: "#fef3c7", bgBottom: "#fde68a", text: "#78350f", cards: "#ffffff" } },
  { id: "sakura", label: "Sakura", mode: "light", colors: { main: "#f472b6", second: "#fb7185", highlight: "#a78bfa", bgTop: "#fdf2f8", bgBottom: "#fce7f3", text: "#831843", cards: "#ffffff" } },
  { id: "lava", label: "Lava", mode: "dark", colors: { main: "#ef4444", second: "#f97316", highlight: "#fde047", bgTop: "#450a0a", bgBottom: "#7f1d1d", text: "#fef2f2", cards: "#991b1b" } },
  { id: "arctic", label: "Arctic", mode: "light", colors: { main: "#0ea5e9", second: "#0284c7", highlight: "#f97316", bgTop: "#f0f9ff", bgBottom: "#e0f2fe", text: "#0c4a6e", cards: "#ffffff" } },
  { id: "synthwave", label: "Synthwave", mode: "dark", colors: { main: "#ec4899", second: "#8b5cf6", highlight: "#06b6d4", bgTop: "#2e1065", bgBottom: "#4c1d95", text: "#faf5ff", cards: "#6d28d9" } },
  { id: "kraft", label: "Kraft", mode: "light", colors: { main: "#854d0e", second: "#713f12", highlight: "#dc2626", bgTop: "#fef3c7", bgBottom: "#fde68a", text: "#422006", cards: "#fef3c7" } },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const FONTS = [
  "Space Grotesk", "JetBrains Mono", "IBM Plex Mono", "Space Mono",
  "Baloo 2", "Sora", "Lexend", "Manrope", "Poppins", "Fredoka",
  "Bricolage Grotesque", "Playfair Display", "Caveat", "Merriweather",
  "Outfit", "Rubik", "Nunito", "Syne", "Unbounded", "Kalam",
] as const;

export const PATTERNS = ["none", "dots", "grid", "lines", "paper", "chalk", "blueprint", "scan", "horizon"] as const;

export const READY_PRESENTERS = [
  { id: "meera", label: "Meera", gender: "f", skin: "#f3c892", hair: "long", hairColor: "#1a1a1a", outfit: "saree", outfitColor: "#8b5cf6" },
  { id: "arjun", label: "Arjun", gender: "m", skin: "#c78a5c", hair: "short", hairColor: "#000000", outfit: "shirt", outfitColor: "#1e40af" },
  { id: "bolt", label: "Bolt", gender: "m", skin: "#d4a574", hair: "spiky", hairColor: "#dc2626", outfit: "tshirt", outfitColor: "#18181b" },
  { id: "miko", label: "Miko", gender: "f", skin: "#f1d7b8", hair: "bob", hairColor: "#ec4899", outfit: "jacket", outfitColor: "#06b6d4" },
  { id: "kabir", label: "Kabir", gender: "m", skin: "#a8724a", hair: "sidepart", hairColor: "#1f2937", outfit: "blazer", outfitColor: "#1e293b" },
  { id: "zara", label: "Zara", gender: "f", skin: "#c48c5f", hair: "curly", hairColor: "#422006", outfit: "shirt", outfitColor: "#f59e0b" },
  { id: "dadi", label: "Dadi", gender: "f", skin: "#e6b996", hair: "bun", hairColor: "#f5f5f4", outfit: "saree", outfitColor: "#b91c1c" },
  { id: "chintu", label: "Chintu", gender: "m", skin: "#d8a276", hair: "short", hairColor: "#18181b", outfit: "tshirt", outfitColor: "#22c55e" },
  { id: "owlie", label: "Owlie", gender: "m", skin: "#d4a574", hair: "buzz", hairColor: "#44403c", outfit: "hoodie", outfitColor: "#7c3aed" },
  { id: "pixel", label: "Pixel", gender: "f", skin: "#edb98a", hair: "ponytail", hairColor: "#06b6d4", outfit: "tshirt", outfitColor: "#18181b" },
] as const;

export const FACES = ["oval", "round", "long", "square"] as const;
export const HAIRS = ["short", "spiky", "curly", "sidepart", "buzz", "long", "wavy", "bob", "bun", "ponytail", "afro", "bald"] as const;
export const EYES = ["round", "big", "almond", "sleepy"] as const;
export const BROWS = ["arched", "thin", "thick"] as const;
export const BEARDS = ["none", "stubble", "moustache", "goatee", "beard"] as const;
export const GLASSES = ["none", "round", "square", "sunglasses"] as const;
export const HEADWEAR = ["none", "cap", "beanie", "headphones"] as const;
export const EARRINGS = ["none", "hoops", "studs"] as const;
export const EXTRAS = ["none", "bindi", "freckles"] as const;
export const BUILDS = ["slim", "regular", "broad"] as const;
export const OUTFITS = ["hoodie", "tshirt", "shirt", "kurta", "blazer", "saree", "jacket"] as const;

export const SKIN_SWATCHES = ["#f6d7b0", "#edb98a", "#d4a574", "#c78a5c", "#a8724a", "#875633", "#5c3a1f", "#3d2512"];

export const ELEVENLABS_VOICES = [
  { id: "EXAVITQu4vr4xnSDxMaL", label: "Sarah", gender: "F", description: "Soft, friendly, young", presenterDefault: true },
  { id: "nPczCjzI2devNBz1zQrb", label: "Brian", gender: "M", description: "Deep, confident narrator" },
  { id: "onwK4e9ZLuTAKqWW03F9", label: "Daniel", gender: "M", description: "Authoritative news style" },
  { id: "JBFqnCBsd6RMkjVDRZzb", label: "George", gender: "M", description: "Warm, mature storyteller" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", label: "Liam", gender: "M", description: "Young, energetic" },
  { id: "pFZP5JQG7iQjIQuC4Bku", label: "Lily", gender: "F", description: "Warm, polished" },
] as const;

// Sarvam voices: slug used as Sarvam API speaker name (lowercase, hyphenless)
export const SARVAM_VOICES = [
  { id: "priya", label: "Priya", gender: "F", description: "Cheerful & Engaging", recommended: true },
  { id: "shalini-enhi-companion", label: "Shalini Enhi Companion", gender: "F", description: "Slow, expressive, rough, English+Hindi", recommended: true },
  { id: "shubh", label: "Shubh", gender: "M", description: "Confident & Bold", recommended: true },
  { id: "shubh-enhi-companion", label: "Shubh Enhi Companion", gender: "M", description: "Low, lively, expressive, English+Hindi", presenterDefault: true, recommended: true },
  { id: "aayan", label: "Aayan", gender: "M", description: "Professional & Clear" },
  { id: "aditya", label: "Aditya", gender: "M", description: "Modern & Crisp" },
  { id: "advait", label: "Advait", gender: "M", description: "Contemporary & Storytelling" },
  { id: "amit", label: "Amit", gender: "M", description: "Steady & Trustworthy" },
  { id: "anand", label: "Anand", gender: "M", description: "Warm & Reassuring" },
  { id: "anand-hi-documentary", label: "Anand Hi Documentary", gender: "M", description: "Clear, low, slow, Hindi" },
  { id: "aparna-en-edtech", label: "Aparna En Edtech", gender: "F", description: "Engaging, low, lively, English" },
  { id: "aparna-hi-customer", label: "Aparna Hi Customer", gender: "F", description: "Warm, low, lively, Hindi" },
  { id: "ashok-hi-news", label: "Ashok Hi News", gender: "M", description: "Crisp, brisk, expressive, Hindi" },
  { id: "ashutosh", label: "Ashutosh", gender: "M", description: "Traditional & Narrative" },
  { id: "dev", label: "Dev", gender: "M", description: "Casual & Relatable" },
  { id: "gokul", label: "Gokul", gender: "M", description: "Trustworthy & Dependable" },
  { id: "ishita", label: "Ishita", gender: "F", description: "Polished & Articulate" },
  { id: "ishita-enhi-companion", label: "Ishita Enhi Companion", gender: "F", description: "Intimate, slow, expressive, English+Hindi" },
  { id: "kabir", label: "Kabir", gender: "M", description: "Rich & Cinematic" },
  { id: "kavitha", label: "Kavitha", gender: "F", description: "Graceful & Articulate" },
  { id: "kavya", label: "Kavya", gender: "F", description: "Polished & Articulate" },
  { id: "manan", label: "Manan", gender: "M", description: "Clear & Professional" },
  { id: "mani", label: "Mani", gender: "M", description: "Calm & Composed" },
  { id: "mohit", label: "Mohit", gender: "M", description: "Versatile & Adaptable" },
  { id: "neha", label: "Neha", gender: "F", description: "Energetic & Warm" },
  { id: "pooja", label: "Pooja", gender: "F", description: "Cheerful & Engaging" },
  { id: "rahul", label: "Rahul", gender: "M", description: "Deep & Authoritative" },
  { id: "ratan", label: "Ratan", gender: "M", description: "Rich & Mature" },
  { id: "rehan", label: "Rehan", gender: "M", description: "Youthful & Energetic" },
  { id: "ritu", label: "Ritu", gender: "F", description: "Expressive & Lively" },
  { id: "rohan", label: "Rohan", gender: "M", description: "Confident & Bold" },
  { id: "roopa", label: "Roopa", gender: "F", description: "Gentle & Soothing" },
  { id: "roopa-hi-companion", label: "Roopa Hi Companion", gender: "F", description: "Soothing, soft-spoken, Hindi" },
  { id: "rupali", label: "Rupali", gender: "F", description: "Elegant & Refined" },
  { id: "sanchita-en-companion", label: "Sanchita En Companion", gender: "F", description: "Lively, full, English" },
  { id: "shreya", label: "Shreya", gender: "F", description: "Energetic & Warm" },
  { id: "shruti", label: "Shruti", gender: "F", description: "Sweet & Melodious" },
  { id: "shubh-enhi-banking", label: "Shubh Enhi Banking", gender: "M", description: "Warm, soft-spoken, English+Hindi" },
  { id: "shubh-hi-ecomm", label: "Shubh Hi Ecomm", gender: "M", description: "Warm, hushed, brisk, Hindi" },
  { id: "simran", label: "Simran", gender: "F", description: "Rich & Mature" },
  { id: "soham", label: "Soham", gender: "M", description: "Balanced & Natural" },
  { id: "suhani", label: "Suhani", gender: "F", description: "Pleasant & Soothing" },
  { id: "sumit", label: "Sumit", gender: "M", description: "Deep & Authoritative" },
  { id: "sunny", label: "Sunny", gender: "M", description: "Cheerful & Upbeat" },
  { id: "tanya", label: "Tanya", gender: "F", description: "Friendly & Modern" },
  { id: "tarun", label: "Tarun", gender: "M", description: "Professional & Clear" },
  { id: "varun", label: "Varun", gender: "M", description: "Deep & dramatic, suspense/villain only" },
  { id: "vijay", label: "Vijay", gender: "M", description: "Confident & Authoritative" },
] as const;

export const MUSIC_BEDS = [
  { id: "format-default", label: "Format default", description: "Uses the recommended bed for the chosen format." },
  { id: "lofi", label: "Lo-fi", description: "80 BPM swung drums, jazzy keys, vinyl crackle. Relaxed." },
  { id: "upbeat", label: "Upbeat", description: "118 BPM four-on-the-floor with plucky arpeggios. Energetic." },
  { id: "cinematic", label: "Cinematic", description: "Slow pads, deep sub swells and distant toms. Dramatic." },
  { id: "tech", label: "Tech", description: "110 BPM pulsing synth arpeggio, clean drums. Analytical." },
  { id: "calm", label: "Calm", description: "Warm ambient pad, no drums. Gentle." },
  { id: "none", label: "No music", description: "Narration and sound effects only." },
] as const;

export const DEFAULT_LOOK = {
  name: "default",
  handle: "",
  format: "classic-explainer" as const,
  theme: "midnight" as const,
  colors: null, // null = use theme defaults
  font: "Space Grotesk",
  pattern: "dots" as const,
  corners: 32,
  presenter: { mode: "ready-made" as const, preset: "arjun", custom: null },
  voice: { provider: "elevenlabs" as const, voiceId: "EXAVITQu4vr4xnSDxMaL", speed: 1.0 },
  music: "format-default" as const,
  sfx: true,
};

export type Look = {
  id: string;
  name: string;
  handle: string;
  format: FormatId;
  theme: ThemeId;
  colors: null | Record<string, string>;
  font: string;
  pattern: (typeof PATTERNS)[number];
  corners: number;
  presenter: {
    mode: "ready-made" | "custom" | "none";
    preset?: string;
    custom?: Record<string, unknown> | null;
  };
  voice: {
    provider: "elevenlabs" | "sarvam";
    voiceId: string;
    speed: number;
  };
  music: (typeof MUSIC_BEDS)[number]["id"];
  sfx: boolean;
  createdAt: string;
};

export type Job = {
  id: string;
  status: "pending" | "claimed" | "rendering" | "done" | "failed";
  createdAt: string;
  updatedAt: string;
  input: {
    topic: string;
    ownScript: string;
    language: LanguageId;
    hookStyle: (typeof HOOK_STYLES)[number]["id"];
    cta: (typeof CTAS)[number]["id"];
    notes: string;
    lookId: string;
  };
  output: null | {
    mp4Url: string;
    coverUrl: string;
    caption: string;
    hashtags: string[];
    keywords: string[];
    scenes: Array<{ voiceText: string; onScreenText: string; emoji: string }>;
  };
  error: string | null;
};
