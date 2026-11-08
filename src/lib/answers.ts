import type { Answer } from "@/data/types"

/** Parse "12", "-3.5", "7/4", ".5" into a number. Returns null if not a number. */
export function parseNumeric(raw: string): number | null {
  const s = raw.trim().replace(/\s+/g, "")
  if (!s) return null
  const frac = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/)
  if (frac) {
    const d = parseFloat(frac[2])
    return d === 0 ? null : parseFloat(frac[1]) / d
  }
  if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return parseFloat(s)
  return null
}

export function isCorrect(answer: Answer, input: string | number | null): boolean {
  if (input === null || input === "") return false
  if (answer.kind === "mc") return Number(input) === answer.correct
  const n = parseNumeric(String(input))
  if (n === null) return false
  const tol = answer.tol ?? 1e-9
  return Math.abs(n - answer.value) <= tol + 1e-12
}

export function answerText(answer: Answer): string {
  if (answer.kind === "mc") return String.fromCharCode(65 + answer.correct) + ". " + answer.choices[answer.correct]
  return answer.display ?? String(answer.value)
}

/** Turn the LaTeX we feed Desmos into what a student types on the keyboard. */
export function toTyped(latex: string): string {
  return latex
    .replace(/\\left|\\right/g, "")
    .replace(/\\sim/g, "~")
    .replace(/\\le(?![a-z])/g, "<=")
    .replace(/\\ge(?![a-z])/g, ">=")
    .replace(/\\cdot/g, "*")
    .replace(/\\pi/g, "pi")
    .replace(/\\sqrt\{([^}]*)\}/g, "sqrt($1)")
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)")
    .replace(/\\operatorname\{([a-z]+)\}/g, "$1")
    .replace(/\\([a-z]+)/g, "$1")
    .replace(/\{/g, "(")
    .replace(/\}/g, ")")
}
