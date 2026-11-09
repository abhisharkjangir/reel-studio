// Scaled 1080×1920 preview used in both Looks designer and (later) Make-a-reel.
// This is a plain <div> tree so it stays in sync with the real renderer visually,
// without needing any video decoding in the browser.

"use client";

import { FORMATS, type Look } from "@/lib/constants";
import { resolveColors } from "@/lib/theme";
import { PresenterAvatar } from "./PresenterAvatar";

type Tab = "hook" | "step" | "cta" | "cover";

type Props = {
  look: Look;
  tab?: Tab;
  topic?: string;
  width?: number; // CSS width; height derived (9:16)
};

const EXAMPLE_COPY: Record<Tab, { text: string; sub?: string }> = {
  hook:  { text: "Indian cricket bat ka safar 1983 se aaj tak", sub: "⏱️ 5 min · 🆓 Free · ✅ Easy" },
  step:  { text: "step 2 · willow wood aata hai England se" },
  cta:   { text: "comment BAT, pura timeline bhejunga 📩" },
  cover: { text: "1983 → 2026\nBat ka safar" },
};

export function PhonePreview({ look, tab = "hook", topic, width = 260 }: Props) {
  const colors = resolveColors(look);
  const fmt = FORMATS.find((f) => f.id === look.format)!;
  const height = Math.round((width * 1920) / 1080);
  const copy = topic && tab === "hook" ? { text: topic, sub: EXAMPLE_COPY.hook.sub } : EXAMPLE_COPY[tab];

  return (
    <div
      className="relative overflow-hidden shadow-2xl"
      style={{
        width,
        height,
        borderRadius: look.corners,
        background: `linear-gradient(180deg, ${colors.bgTop}, ${colors.bgBottom})`,
        color: colors.text,
        fontFamily: `"${look.font}", sans-serif`,
      }}
    >
      <Pattern pattern={look.pattern} color={colors.text} />

      {/* top chip row */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] opacity-80">
        <span className="px-2 py-0.5 rounded-full" style={{ background: colors.cards }}>
          {fmt.emoji} {fmt.label}
        </span>
        {look.handle && (
          <span className="px-2 py-0.5 rounded-full" style={{ background: colors.cards, color: colors.highlight }}>
            {look.handle.startsWith("@") ? look.handle : `@${look.handle}`}
          </span>
        )}
      </div>

      {/* main text */}
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <div>
          <div
            className="font-bold leading-tight"
            style={{ fontSize: tab === "cover" ? 36 : 26, color: tab === "cta" ? colors.highlight : colors.text }}
          >
            {copy.text.split("\n").map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
          {copy.sub && (
            <div className="mt-3 text-[11px] opacity-75">{copy.sub}</div>
          )}
        </div>
      </div>

      {/* word-by-word caption mock, lower third */}
      {tab !== "cover" && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-24 px-3 py-1.5 font-bold text-sm"
          style={{
            background: colors.main,
            color: tab === "cta" ? "#000" : "#fff",
            borderRadius: 8,
            textShadow: "0 1px 0 rgba(0,0,0,0.3)",
          }}
        >
          WILLOW
        </div>
      )}

      {/* presenter in corner */}
      {look.presenter?.mode !== "none" && tab !== "cover" && (
        <div className="absolute right-3 bottom-3">
          <PresenterAvatar look={look} size={70} />
        </div>
      )}

      {/* bottom brand bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-10 flex items-center px-3 text-[10px] opacity-80"
        style={{ background: `linear-gradient(0deg, rgba(0,0,0,0.4), transparent)` }}
      >
        {look.handle ? (look.handle.startsWith("@") ? look.handle : `@${look.handle}`) : "@you"} · reel·studio
      </div>
    </div>
  );
}

function Pattern({ pattern, color }: { pattern: string; color: string }) {
  if (pattern === "none") return null;
  const hex = color;
  const bg: Record<string, string> = {
    dots:      `radial-gradient(${hex}22 1.5px, transparent 1.5px) 0 0 / 20px 20px`,
    grid:      `linear-gradient(${hex}18 1px, transparent 1px) 0 0 / 100% 24px, linear-gradient(90deg, ${hex}18 1px, transparent 1px) 0 0 / 24px 100%`,
    lines:     `repeating-linear-gradient(45deg, ${hex}10 0 1px, transparent 1px 12px)`,
    paper:     `radial-gradient(${hex}08 2px, transparent 2px) 0 0 / 7px 7px`,
    chalk:     `repeating-linear-gradient(0deg, ${hex}0a 0 1px, transparent 1px 3px)`,
    blueprint: `linear-gradient(${hex}22 1px, transparent 1px) 0 0 / 100% 40px, linear-gradient(90deg, ${hex}22 1px, transparent 1px) 0 0 / 40px 100%`,
    scan:      `repeating-linear-gradient(0deg, ${hex}10 0 1px, transparent 1px 4px)`,
    horizon:   `linear-gradient(180deg, transparent 50%, ${hex}10 50%)`,
  };
  return <div className="absolute inset-0 pointer-events-none" style={{ background: bg[pattern] ?? "none" }} />;
}
