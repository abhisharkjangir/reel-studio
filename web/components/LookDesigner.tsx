"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BUILDS, CTAS, DEFAULT_LOOK, ELEVENLABS_VOICES, EYES, FACES, FONTS, FORMATS,
  HAIRS, HOOK_STYLES, LANGUAGES, MUSIC_BEDS, OUTFITS, PATTERNS, READY_PRESENTERS,
  SARVAM_VOICES, SKIN_SWATCHES, THEMES, type Look,
} from "@/lib/constants";
import { PhonePreview } from "./PhonePreview";
import { contrast, resolveColors } from "@/lib/theme";

type Tab = "hook" | "step" | "cta" | "cover";

const STEPS = ["Format", "Look", "Presenter", "Voice", "Sound", "Save"] as const;

export function LookDesigner({ initial }: { initial?: Look }) {
  const router = useRouter();
  const [look, setLook] = useState<Look>(() => (initial ?? { ...DEFAULT_LOOK, id: "", createdAt: "" }) as Look);
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState<Tab>("hook");
  const [saving, setSaving] = useState(false);

  const colors = useMemo(() => resolveColors(look), [look]);
  const textContrast = useMemo(() => contrast(colors.text, colors.bgTop), [colors]);

  const patch = (p: Partial<Look>) => setLook((l) => ({ ...l, ...p }));

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/looks", { method: "POST", body: JSON.stringify(look) });
      const { look: saved } = await res.json();
      router.push("/looks");
      router.refresh();
      return saved;
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-10 items-start">
      {/* LEFT · wizard */}
      <div>
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-thin pb-2">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`chip ${i === step ? "chip-active" : ""}`}
            >
              <span className="opacity-60">{i + 1}</span> {s}
            </button>
          ))}
        </div>

        {step === 0 && <StepFormat look={look} patch={patch} />}
        {step === 1 && <StepLook look={look} patch={patch} />}
        {step === 2 && <StepPresenter look={look} patch={patch} />}
        {step === 3 && <StepVoice look={look} patch={patch} />}
        {step === 4 && <StepSound look={look} patch={patch} />}
        {step === 5 && <StepSave look={look} patch={patch} onSave={save} saving={saving} />}

        <div className="flex justify-between mt-8">
          <button className="btn btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Next · {STEPS[step + 1]}</button>
          ) : (
            <button className="btn btn-primary" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save look"}</button>
          )}
        </div>
      </div>

      {/* RIGHT · live phone preview */}
      <div className="md:sticky md:top-24 self-start">
        <div className="flex gap-1 mb-3 justify-center">
          {(["hook", "step", "cta", "cover"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`chip ${tab === t ? "chip-active" : ""}`}>{t}</button>
          ))}
        </div>
        <div className="flex justify-center">
          <PhonePreview look={look} tab={tab} />
        </div>
        <div className="mt-3 text-xs text-center opacity-70">
          Text contrast {textContrast.toFixed(1)} : 1 · {textContrast >= 4.5 ? "easy to read" : "may be hard to read"}
        </div>
      </div>
    </div>
  );
}

// ── Steps ──────────────────────────────────────────────────────────────────────

function StepFormat({ look, patch }: { look: Look; patch: (p: Partial<Look>) => void }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">01 · Format</h2>
        <p className="text-sm text-[color:var(--muted)]">
          The shape of every script: a hook in the first 3 seconds, the steps, then one call to action.
        </p>
      </div>

      <div>
        <label>Supported languages (set per reel, not per look)</label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <span key={l.id} className="hint" title={l.sarvamOnly ? "Needs a Sarvam API key" : ""}>
              {l.label}{l.sarvamOnly ? " · sarvam only" : ""}
            </span>
          ))}
        </div>
      </div>

      <div>
        <label>Format</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => patch({ format: f.id })}
              className={`card p-3 text-left ${look.format === f.id ? "selected" : ""}`}
            >
              <div className="text-lg">{f.emoji}</div>
              <div className="text-sm font-semibold">{f.label}</div>
              <div className="text-xs text-[color:var(--muted)]">{f.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label>Hook styles available (chosen per reel)</label>
          <div className="flex flex-wrap gap-2">
            {HOOK_STYLES.map((h) => (
              <span key={h.id} className="hint">{h.label}</span>
            ))}
          </div>
        </div>
        <div>
          <label>Calls to action available (chosen per reel)</label>
          <div className="flex flex-wrap gap-2">
            {CTAS.map((c) => (
              <span key={c.id} className="hint">{c.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepLook({ look, patch }: { look: Look; patch: (p: Partial<Look>) => void }) {
  const colors = resolveColors(look);
  const setColor = (k: string, v: string) => patch({ colors: { ...(look.colors ?? {}), ...resolveColors(look), [k]: v } });
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">02 · Look</h2>
        <p className="text-sm text-[color:var(--muted)]">Start from one of 20 themes, then make it yours.</p>
      </div>

      <div>
        <label>Theme</label>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => patch({ theme: t.id, colors: null })}
              className={`card p-0 overflow-hidden text-left ${look.theme === t.id ? "selected" : ""}`}
            >
              <div className="h-14" style={{ background: `linear-gradient(135deg, ${t.colors.bgTop}, ${t.colors.bgBottom})` }} />
              <div className="px-2 py-1.5 text-xs flex items-center justify-between">
                <span>{t.label}</span>
                <span className="opacity-50">{t.mode}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([
          ["main", "Main"], ["second", "Second"], ["highlight", "Highlight"],
          ["bgTop", "BG top"], ["bgBottom", "BG bottom"], ["text", "Text"], ["cards", "Cards"],
        ] as const).map(([k, label]) => (
          <div key={k}>
            <label>{label}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors[k as keyof typeof colors] ?? "#000000"}
                onChange={(e) => setColor(k, e.target.value)}
                style={{ width: 44, height: 36, padding: 0 }}
              />
              <input value={colors[k as keyof typeof colors] ?? ""} onChange={(e) => setColor(k, e.target.value)} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label>Font</label>
          <select value={look.font} onChange={(e) => patch({ font: e.target.value })}>
            <option value="theme-default">theme default</option>
            {FONTS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label>Background pattern</label>
          <div className="flex flex-wrap gap-2">
            {PATTERNS.map((p) => (
              <button key={p} className={`chip ${look.pattern === p ? "chip-active" : ""}`} onClick={() => patch({ pattern: p })}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label>Corners · {look.corners}px</label>
        <input type="range" min={0} max={48} value={look.corners} onChange={(e) => patch({ corners: Number(e.target.value) })} />
      </div>

      <button className="btn btn-ghost" onClick={() => patch({ colors: null })}>Reset to theme</button>
    </section>
  );
}

function StepPresenter({ look, patch }: { look: Look; patch: (p: Partial<Look>) => void }) {
  const mode = look.presenter?.mode ?? "ready-made";
  const custom = (look.presenter?.custom ?? {}) as Record<string, string>;
  const setCustom = (k: string, v: string) => patch({
    presenter: { mode: "custom", preset: undefined, custom: { ...custom, [k]: v } },
  });
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">03 · Presenter</h2>
        <p className="text-sm text-[color:var(--muted)]">The character that talks in the corner of every reel.</p>
      </div>

      <div className="flex gap-2">
        {(["ready-made", "custom", "none"] as const).map((m) => (
          <button key={m} className={`chip ${mode === m ? "chip-active" : ""}`} onClick={() => patch({ presenter: { ...look.presenter, mode: m } })}>
            {m}
          </button>
        ))}
      </div>

      {mode === "ready-made" && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {READY_PRESENTERS.map((p) => (
            <button
              key={p.id}
              onClick={() => patch({ presenter: { mode: "ready-made", preset: p.id, custom: null } })}
              className={`card p-3 flex flex-col items-center gap-1 ${look.presenter?.preset === p.id ? "selected" : ""}`}
            >
              <div style={{ width: 60, height: 70, background: p.skin, borderRadius: 999 }} />
              <div className="text-xs font-medium">{p.label}</div>
            </button>
          ))}
        </div>
      )}

      {mode === "custom" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <SkinPicker value={custom.skin ?? "#d4a574"} onChange={(v) => setCustom("skin", v)} />
          <SelectField label="Face" value={custom.face ?? "oval"} options={FACES} onChange={(v) => setCustom("face", v)} />
          <SelectField label="Hair" value={custom.hair ?? "short"} options={HAIRS} onChange={(v) => setCustom("hair", v)} />
          <ColorField label="Hair colour" value={custom.hairColor ?? "#1a1a1a"} onChange={(v) => setCustom("hairColor", v)} />
          <SelectField label="Eyes" value={custom.eyes ?? "round"} options={EYES} onChange={(v) => setCustom("eyes", v)} />
          <SelectField label="Build" value={custom.build ?? "regular"} options={BUILDS} onChange={(v) => setCustom("build", v)} />
          <SelectField label="Outfit" value={custom.outfit ?? "tshirt"} options={OUTFITS} onChange={(v) => setCustom("outfit", v)} />
          <ColorField label="Outfit colour" value={custom.outfitColor ?? "#1e40af"} onChange={(v) => setCustom("outfitColor", v)} />
        </div>
      )}
    </section>
  );
}

function StepVoice({ look, patch }: { look: Look; patch: (p: Partial<Look>) => void }) {
  const [provider, setProvider] = useState<"elevenlabs" | "sarvam">(look.voice?.provider ?? "elevenlabs");
  const voices = provider === "elevenlabs" ? ELEVENLABS_VOICES : SARVAM_VOICES;
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">04 · Voice</h2>
        <p className="text-sm text-[color:var(--muted)]">
          ElevenLabs is primary (English / Hindi / Hinglish). Sarvam is the fallback — add its key to Kaggle to unlock other Indian languages.
        </p>
      </div>

      <div className="flex gap-2">
        {(["elevenlabs", "sarvam"] as const).map((p) => (
          <button key={p} className={`chip ${provider === p ? "chip-active" : ""}`} onClick={() => setProvider(p)}>{p}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
        {voices.map((v) => {
          const active = look.voice?.voiceId === v.id;
          return (
            <button
              key={v.id}
              onClick={() => patch({ voice: { provider, voiceId: v.id, speed: look.voice?.speed ?? 1 } })}
              className={`card p-3 text-left ${active ? "selected" : ""}`}
            >
              <div className="text-sm font-semibold">{v.label} <span className="opacity-60">· {v.gender}</span></div>
              <div className="text-xs text-[color:var(--muted)]">{v.description}</div>
            </button>
          );
        })}
      </div>

      <div>
        <label>Speed · {look.voice?.speed?.toFixed(2) ?? "1.00"}×</label>
        <input
          type="range" min={0.7} max={1.3} step={0.05}
          value={look.voice?.speed ?? 1}
          onChange={(e) => patch({ voice: { ...look.voice!, speed: Number(e.target.value) } })}
        />
      </div>
    </section>
  );
}

function StepSound({ look, patch }: { look: Look; patch: (p: Partial<Look>) => void }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">05 · Sound</h2>
        <p className="text-sm text-[color:var(--muted)]">A quiet music bed that ducks under the voice, plus pops and whooshes.</p>
      </div>

      <div className="grid gap-2">
        {MUSIC_BEDS.map((m) => (
          <button
            key={m.id}
            onClick={() => patch({ music: m.id })}
            className={`card p-3 text-left ${look.music === m.id ? "selected" : ""}`}
          >
            <div className="text-sm font-semibold">{m.label}</div>
            <div className="text-xs text-[color:var(--muted)]">{m.description}</div>
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={look.sfx} onChange={(e) => patch({ sfx: e.target.checked })} style={{ width: "auto" }} />
        Sound effects (pops on element appear, whooshes on scene change)
      </label>
    </section>
  );
}

function StepSave({ look, patch, onSave, saving }: { look: Look; patch: (p: Partial<Look>) => void; onSave: () => void; saving: boolean }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">06 · Save this look</h2>
        <p className="text-sm text-[color:var(--muted)]">Saved looks appear when you make a reel.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label>Name *</label>
          <input value={look.name} onChange={(e) => patch({ name: e.target.value })} placeholder="my-look" />
        </div>
        <div>
          <label>Instagram handle (watermark)</label>
          <input value={look.handle} onChange={(e) => patch({ handle: e.target.value })} placeholder="@yourhandle" />
        </div>
      </div>
      <button className="btn btn-primary" disabled={saving || !look.name} onClick={onSave}>
        {saving ? "Saving…" : "Save look"}
      </button>
    </section>
  );
}

// ── Small UI atoms ─────────────────────────────────────────────────────────────

function SkinPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label>Skin</label>
      <div className="flex gap-1 flex-wrap">
        {SKIN_SWATCHES.map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            style={{ width: 28, height: 28, background: s, borderRadius: 999, border: value === s ? "2px solid var(--accent)" : "1px solid var(--border)" }}
          />
        ))}
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: 28, height: 28, padding: 0 }} />
      </div>
    </div>
  );
}
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label>{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: 44, height: 36, padding: 0 }} />
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}
