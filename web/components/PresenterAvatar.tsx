// A tiny SVG presenter head used in previews on the web.
// The real Kaggle renderer re-draws a higher-fidelity version with Pillow;
// this one only needs to look right in the preview box.

import { READY_PRESENTERS, type Look } from "@/lib/constants";

type Props = { look: Look; size?: number };

export function PresenterAvatar({ look, size = 96 }: Props) {
  if (look.presenter?.mode === "none") return null;
  const preset = look.presenter?.mode === "ready-made"
    ? READY_PRESENTERS.find((p) => p.id === (look.presenter.preset ?? "arjun"))
    : null;
  const custom = look.presenter?.mode === "custom" ? (look.presenter.custom as Record<string, string>) : null;

  const skin = (custom?.skin as string) ?? preset?.skin ?? "#d4a574";
  const hairColor = (custom?.hairColor as string) ?? preset?.hairColor ?? "#1a1a1a";
  const hair = (custom?.hair as string) ?? preset?.hair ?? "short";
  const outfit = (custom?.outfit as string) ?? preset?.outfit ?? "tshirt";
  const outfitColor = (custom?.outfitColor as string) ?? preset?.outfitColor ?? "#1e40af";

  return (
    <svg viewBox="0 0 120 140" width={size} height={size * 1.17} className="block">
      {/* body / outfit */}
      <path
        d={outfit === "hoodie"
          ? "M20,140 Q20,110 45,105 L75,105 Q100,110 100,140 Z"
          : "M25,140 Q30,112 50,108 L70,108 Q90,112 95,140 Z"}
        fill={outfitColor}
      />
      {/* neck */}
      <rect x="52" y="90" width="16" height="20" fill={skin} />
      {/* head */}
      <ellipse cx="60" cy="60" rx="32" ry="38" fill={skin} />
      {/* hair */}
      {hair !== "bald" && (
        <path
          d={
            hair === "long"   ? "M28,55 Q28,20 60,20 Q92,20 92,55 L92,95 L82,95 L82,50 L38,50 L38,95 L28,95 Z"
            : hair === "bun"  ? "M30,55 Q30,22 60,22 Q90,22 90,55 Q90,42 60,42 Q30,42 30,55 Z M55,16 a8,8 0 1,1 10,0 Z"
            : hair === "bob"  ? "M28,55 Q28,22 60,22 Q92,22 92,55 L92,78 L80,78 L80,52 L40,52 L40,78 L28,78 Z"
            : hair === "spiky"? "M30,45 L36,22 L42,45 L48,22 L54,45 L60,22 L66,45 L72,22 L78,45 L84,22 L90,45 Z"
            : hair === "curly"? "M28,55 Q25,30 45,25 Q55,15 70,20 Q90,22 92,50 Q85,42 75,45 Q65,32 55,42 Q45,35 36,46 Q30,52 28,55 Z"
            :                   "M30,52 Q30,22 60,22 Q90,22 90,52 Q90,36 60,36 Q30,36 30,52 Z"
          }
          fill={hairColor}
        />
      )}
      {/* eyes */}
      <ellipse cx="48" cy="62" rx="3" ry="4" fill="#1f2937" />
      <ellipse cx="72" cy="62" rx="3" ry="4" fill="#1f2937" />
      {/* mouth (closed; in video this cycles between 3 shapes with audio RMS) */}
      <path d="M50,80 Q60,86 70,80" stroke="#7a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
