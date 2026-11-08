/** Loader for the official Desmos Graphing Calculator API (v1.11). */

// The Desmos API key is public by design (it is passed in the script URL).
// Set VITE_DESMOS_API_KEY in your host's env. The fallback is Desmos' documented
// demo key, which is fine for development but should be replaced for production.
const DEMO_KEY = "dcb31709b452b1cf9dc26972add0fda6"
export const DESMOS_KEY: string = (import.meta.env.VITE_DESMOS_API_KEY as string | undefined) || DEMO_KEY

export interface DesmosCalculator {
  setExpressions(exprs: unknown[]): void
  setBlank(): void
  setMathBounds(b: { left: number; right: number; bottom: number; top: number }): void
  updateSettings(s: Record<string, unknown>): void
  destroy(): void
  resize(): void
}
export interface DesmosGlobal {
  GraphingCalculator(el: HTMLElement, options?: Record<string, unknown>): DesmosCalculator
}
declare global {
  interface Window { Desmos?: DesmosGlobal }
}

let loading: Promise<DesmosGlobal> | null = null

export function loadDesmos(): Promise<DesmosGlobal> {
  if (window.Desmos) return Promise.resolve(window.Desmos)
  if (loading) return loading
  loading = new Promise<DesmosGlobal>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${encodeURIComponent(DESMOS_KEY)}`
    script.async = true
    script.onload = () => (window.Desmos ? resolve(window.Desmos) : reject(new Error("Desmos loaded but the global is missing.")))
    script.onerror = () => {
      loading = null
      script.remove()
      reject(new Error("Could not load the Desmos calculator. Check your connection and try again."))
    }
    document.head.appendChild(script)
  })
  return loading
}
