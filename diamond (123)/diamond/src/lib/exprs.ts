import type { DesmosExpr, DesmosSetup } from "@/data/types"
import { toTyped } from "./answers"

/** Human-readable "type this into Desmos" lines for a setup. */
export function exprLines(setup: DesmosSetup): string[] {
  const out: string[] = []
  for (const e of setup.expressions) out.push(describe(e))
  if (setup.degrees) out.unshift("(first: wrench icon → Degrees)")
  return out
}

function describe(e: DesmosExpr): string {
  if (e.type === "table") {
    const cols = (e.columns ?? []).map((c) => `${toTyped(c.latex).replace(/_(\d)/, "₍$1₎")} = ${c.values.join(", ")}`)
    return "table → " + cols.join("   |   ")
  }
  const base = toTyped(e.latex ?? "")
  if (e.sliderBounds) return `${base}   (slider ${e.sliderBounds.min} to ${e.sliderBounds.max})`
  return base
}
