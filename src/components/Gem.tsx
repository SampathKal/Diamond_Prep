import { useState } from "react"
import { mix } from "@/lib/color"
import { GEM_IMAGES } from "@/data/gems"

export const GEMS = ["Stone", "Quartz", "Jade", "Ruby", "Diamond"] as const
export type GemName = (typeof GEMS)[number]

const BASE: Record<GemName, string> = {
  Stone: "#8d929c",
  Quartz: "#f0b6cc",
  Jade: "#35b987",
  Ruby: "#d9263f",
  Diamond: "#a9e6ff",
}

/** Original, code-drawn gem glyphs (no external images). */
export function Gem({ name, size = 40, className }: { name: GemName; size?: number; className?: string }) {
  const [broken, setBroken] = useState(false)
  const url = GEM_IMAGES[name]
  if (url && !broken) {
    return <img src={url} alt={`${name} gem`} width={size} height={size} className={className} style={{ objectFit: "contain" }} onError={() => setBroken(true)} />
  }
  const c = BASE[name]
  const hi = mix(c, "#ffffff", 0.55)
  const lite = mix(c, "#ffffff", 0.25)
  const dark = mix(c, "#000000", 0.28)
  const deep = mix(c, "#000000", 0.5)
  const ink = "#101426"
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-label={`${name} gem`}>
      <polygon points="28,18 72,18 62,38 38,38" fill={hi} />
      <polygon points="28,18 38,38 8,38" fill={lite} />
      <polygon points="72,18 92,38 62,38" fill={c} />
      <polygon points="8,38 38,38 50,92" fill={c} />
      <polygon points="38,38 62,38 50,92" fill={lite} />
      <polygon points="62,38 92,38 50,92" fill={dark} />
      <polygon points="38,38 50,92 8,38" fill="none" />
      <path d="M28 18H72L92 38L50 92L8 38Z M8 38H92 M38 38L50 92L62 38 M28 18L38 38 M72 18L62 38" fill="none" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      <polygon points="34,22 44,22 40,30 32,30" fill="#fff" opacity="0.45" />
      <circle cx="0" cy="0" r="0" fill={deep} />
    </svg>
  )
}

export function Avatar({ gem, size = 40 }: { gem: GemName; size?: number }) {
  return (
    <span
      className="inline-grid place-items-center border-[3px] border-foreground bg-paper"
      style={{ width: size, height: size, boxShadow: "3px 3px 0 var(--foreground)" }}
    >
      <Gem name={gem} size={size * 0.72} />
    </span>
  )
}
