"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CTAS, HOOK_STYLES, LANGUAGES, type Look } from "@/lib/constants";

export function TopicForm({ looks }: { looks: Look[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<"topic" | "own">("topic");
  const [topic, setTopic] = useState("");
  const [ownScript, setOwnScript] = useState("");
  const [language, setLanguage] = useState("hinglish");
  const [hookStyle, setHookStyle] = useState("auto");
  const [cta, setCta] = useState("auto");
  const [notes, setNotes] = useState("");
  const [lookId, setLookId] = useState(looks[0]?.id ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topic: mode === "topic" ? topic : "",
          ownScript: mode === "own" ? ownScript : "",
          language, hookStyle, cta, notes, lookId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "failed to queue");
      router.push("/reels");
    } catch (err) {
      setError(err instanceof Error ? err.message : "something broke");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid md:grid-cols-[1fr_320px] gap-10 items-start">
      <div className="space-y-6">
        <div>
          <label>Look</label>
          <div className="flex items-center gap-2">
            <select value={lookId} onChange={(e) => setLookId(e.target.value)}>
              <option value="">Default look</option>
              {looks.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <Link href="/looks/new" className="btn btn-ghost whitespace-nowrap">Design one</Link>
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <button type="button" className={`chip ${mode === "topic" ? "chip-active" : ""}`} onClick={() => setMode("topic")}>Topic</button>
            <button type="button" className={`chip ${mode === "own" ? "chip-active" : ""}`} onClick={() => setMode("own")}>My own script</button>
          </div>
          {mode === "topic" ? (
            <>
              <label>Topic *</label>
              <input placeholder="How to make websites and earn money" value={topic} onChange={(e) => setTopic(e.target.value)} />
              <p className="text-xs text-[color:var(--muted)] mt-1">The AI writes the script. Be specific.</p>
            </>
          ) : (
            <>
              <label>Your script * <span className="opacity-60">{ownScript.length} / 6000</span></label>
              <textarea rows={8} value={ownScript} maxLength={6000} onChange={(e) => setOwnScript(e.target.value)} placeholder="Hook, steps, call to action. The AI splits it into scenes and keeps your words." />
            </>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}{l.sarvamOnly ? " · sarvam" : ""}</option>)}
            </select>
          </div>
          <div>
            <label>Hook style</label>
            <select value={hookStyle} onChange={(e) => setHookStyle(e.target.value)}>
              {HOOK_STYLES.map((h) => <option key={h.id} value={h.id}>{h.label}</option>)}
            </select>
          </div>
          <div>
            <label>Call to action</label>
            <select value={cta} onChange={(e) => setCta(e.target.value)}>
              {CTAS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label>Notes for the script writer (optional)</label>
          <input placeholder="e.g. mention Canva and Hostinger; keep it beginner friendly" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {error && <div className="card p-3 text-sm" style={{ borderColor: "#dc2626", color: "#fca5a5" }}>{error}</div>}

        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? "Queueing…" : "Make reel →"}
        </button>
      </div>

      <aside className="card p-5 text-sm space-y-3">
        <div className="font-semibold">How it works</div>
        <ol className="space-y-2 list-decimal list-inside text-[color:var(--muted)]">
          <li>Type a topic (or paste your own script) and press Make reel. Add as many as you like.</li>
          <li>On Kaggle, open your Reel Maker and click Save Version → Save.</li>
          <li>Your reels appear in the Reels tab in about 20–30 minutes each.</li>
        </ol>
        <a href="https://www.kaggle.com" target="_blank" rel="noreferrer" className="btn btn-ghost w-full justify-center">Open Kaggle ↗</a>
      </aside>
    </form>
  );
}
