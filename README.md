# Reel Studio · personal

Type a topic → get a finished Instagram reel. Script via Google Gemini (free tier, no card needed), voice via ElevenLabs (Sarvam fallback), rendered on your free Kaggle T4×2 GPU.

Single user, no login, no payments, no database. Jobs are JSON files in Vercel Blob; the Kaggle notebook polls them.

```
web/      Next.js 16 UI — Make a reel / Reels / Looks designer
kaggle/   Python worker + reel-maker.ipynb (upload to Kaggle)
```

---

## 1 · One-time setup

### Accounts you need
1. **Vercel Blob store** — Vercel dashboard → Storage → Blob → Create → copy the `BLOB_READ_WRITE_TOKEN`.
2. **Google Gemini** — free API key at https://aistudio.google.com/apikey (1,500 req/day free, no credit card).
3. **ElevenLabs** — any plan (10k free credits / month is enough to start).
4. **Kaggle** account with phone verified (otherwise GPU + internet are off).
5. *(Optional)* **Sarvam** — unlocks Tamil/Telugu/Malayalam/Marathi/Bengali/Gujarati/Punjabi/Odia and acts as a free-credit overflow fallback for ElevenLabs.

### Local env
```bash
cd web
cp .env.example .env.local
# fill BLOB_READ_WRITE_TOKEN only — the web UI doesn't need the LLM/TTS keys
npm run dev
```
Open http://localhost:3000.

### Push the repo somewhere Kaggle can `git clone` it
Kaggle fetches `kaggle/` from GitHub on every run so you can iterate without re-uploading the notebook. Any public repo works (Kaggle doesn't need credentials for a public repo).

```bash
cd ..                     # back to reel-studio/
git init && git add -A && git commit -m "init"
# create a public repo on GitHub, then:
git remote add origin git@github.com:YOU/reel-studio.git
git push -u origin main
```

Edit `kaggle/reel-maker.ipynb` cell 1 — change `REPO = "https://github.com/YOU/reel-studio.git"` to your URL.

### Kaggle one-time
1. Go to kaggle.com → *Create* → *New Notebook* → *File → Import Notebook* → upload `kaggle/reel-maker.ipynb`.
2. Settings → Accelerator → **GPU T4 x2**.
3. Settings → Internet → **On**.
4. Add-ons → Secrets → add:
   - `GEMINI_API_KEY`
   - `ELEVENLABS_API_KEY`
   - `BLOB_READ_WRITE_TOKEN`
   - `SARVAM_API_KEY` *(optional)*
5. Hit **Save Version → Save & Run All (Commit)**. The worker starts, picks up any pending reels, renders them, then idle-exits after 5 min.

---

## 2 · Every time you want reels

1. In the web UI (`npm run dev`), **Make a reel** → type a topic, pick language / hook / CTA → *Make reel*. Queue as many as you like.
2. On Kaggle, open your Reel Maker → **Save Version → Save**. (Same two clicks as Animo.)
3. Reels appear in */reels* within ~20–30 min each. Each card has Copy caption / Copy hashtags / Download mp4.

---

## 3 · Designing a Look

*/looks → Design a new look* opens a 6-step wizard with a live phone preview:

1. **Format** — one of 20 beat-structures (Classic Explainer, Top 5 List, Myth vs Fact, …). Drives the shape of every scene.
2. **Look** — pick one of 20 themes, override individual colors, change the font (20 options), background pattern (9 options) and corner radius.
3. **Presenter** — Ready-made (10 avatars) · Build your own (face/hair/eyes/outfit) · None.
4. **Voice** — ElevenLabs (6 voices) or Sarvam (48 voices) + a 0.7×–1.3× speed slider.
5. **Sound** — 6 music beds (plus *Format default*) + SFX toggle.
6. **Save** — name + optional Instagram handle for the watermark.

---

## 4 · What the Kaggle worker does per reel (~20–30 min on T4×2)

```
script.py   Google Gemini (gemini-2.0-flash) · JSON schema · scenes + caption + hashtags + keywords
voice.py    ElevenLabs /text-to-speech/<id>/with-timestamps (word timings)
            → fallback to Sarvam on 401/429/5xx or non-English-Hindi-Hinglish
cover.py    Pillow 1080×1920 PNG with gradient + hook text + chips
presenter.py Pillow SVG-ish avatar, static corner overlay
captions.py ffmpeg drawtext per-word pop-in in lower-third
music.py    Picks bed from assets/music/<id>.mp3 (if present)
render.py   One ffmpeg filter_complex: bg concat + presenter overlay
            + captions + voice (sidechain-ducked over music)
            → 1080×1920 H.264 / AAC mp4
```

Output lands in Blob under `outputs/<jobId>.mp4` and `outputs/<jobId>.jpg`. The job file at `queue/<jobId>.json` is PATCHed to `status: done` with the URLs.

---

## 5 · Troubleshooting

**Jobs stay `pending` forever.** Kaggle's worker isn't running. Open the notebook on Kaggle → Save Version → Save. A box at the bottom-left should say *Running* within a minute.

**Jobs go to `failed` with "TTS failed".** ElevenLabs credits are out — add a `SARVAM_API_KEY` Kaggle Secret and re-run. Or wait for your ElevenLabs monthly reset.

**No music.** Add `.mp3` beds under `kaggle/assets/music/`:
```
lofi.mp3   upbeat.mp3   cinematic.mp3   tech.mp3   calm.mp3
```
Any royalty-free, >60 s, 44.1 kHz works. Without them, reels still render but silent-bed.

**No fonts.** Add `.ttf` files under `kaggle/assets/fonts/` named after the font (`SpaceGrotesk-Bold.ttf`, etc.). Worker falls back to DejaVu Sans Bold / Helvetica so it never hard-fails.

**Blob says `The blob path contains invalid characters`.** Job IDs are nanoid-12; this shouldn't happen. If it does, delete the job file via `vercel blob del queue/<id>.json` and retry.

---

## 6 · What's intentionally missing (and where to add it)

- No signup / login / payments. Everything assumes one user.
- No `/setup` page or `ANIMO_TOKEN` dance — the notebook uses your `BLOB_READ_WRITE_TOKEN` directly.
- No marketing landing page.
- No multi-presenter animation (mouth sync). The hooks are there in `pipeline/presenter.py` — swap the static PNG for a per-frame overlay driven by RMS and you'll have it.
