import { useCallback, useEffect, useRef, useState } from "react"
import { ExternalLink, Eraser, RotateCcw } from "lucide-react"
import type { DesmosExpr, DesmosSetup } from "@/data/types"
import { loadDesmos, type DesmosCalculator } from "@/lib/desmos"

function toApi(e: DesmosExpr, i: number) {
  if (e.type === "table") {
    return { id: `t${i}`, type: "table", columns: e.columns?.map((c) => ({ latex: c.latex, values: c.values })) }
  }
  const o: Record<string, unknown> = { id: `e${i}`, latex: e.latex }
  if (e.sliderBounds) o.sliderBounds = e.sliderBounds
  if (e.color) o.color = e.color
  if (e.hidden) o.hidden = true
  return o
}

/**
 * A real Desmos Graphing Calculator (official API v1.11), preloaded through setExpressions.
 * Students can edit anything, clear the graph, reset to the example, or open full Desmos.
 */
export default function DesmosCalc({
  setup,
  height = 460,
  className = "",
  label = "Preloaded example",
}: {
  setup?: DesmosSetup
  height?: number | string
  className?: string
  label?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const calc = useRef<DesmosCalculator | null>(null)
  const [state, setState] = useState<"loading" | "ready" | "error">("loading")
  const [msg, setMsg] = useState("")
  const [attempt, setAttempt] = useState(0)

  const apply = useCallback((s?: DesmosSetup) => {
    const c = calc.current
    if (!c) return
    try {
      c.setBlank()
      try { c.updateSettings({ degreeMode: !!s?.degrees }) } catch { /* older builds */ }
      if (s?.expressions.length) c.setExpressions(s.expressions.map(toApi))
      if (s?.bounds) c.setMathBounds(s.bounds)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not load the example.")
    }
  }, [])

  // create / destroy the calculator
  useEffect(() => {
    let cancelled = false
    let ro: ResizeObserver | undefined
    setState("loading")
    loadDesmos()
      .then((D) => {
        if (cancelled || !host.current) return
        const c = D.GraphingCalculator(host.current, {
          keypad: true,
          expressions: true,
          settingsMenu: true,
          zoomButtons: true,
          expressionsTopbar: true,
          degreeMode: !!setup?.degrees,
        })
        calc.current = c
        apply(setup)
        ro = new ResizeObserver(() => c.resize())
        ro.observe(host.current)
        setState("ready")
      })
      .catch((e: Error) => {
        if (cancelled) return
        setMsg(e.message)
        setState("error")
      })
    return () => {
      cancelled = true
      ro?.disconnect()
      calc.current?.destroy()
      calc.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt])

  // load a new example whenever the setup changes
  useEffect(() => {
    if (state === "ready") apply(setup)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setup, state])

  return (
    <div className={`box-flat overflow-hidden bg-paper ${className}`}>
      <div className="flex flex-wrap items-center gap-2 border-b-[3px] border-foreground bg-panel px-3 py-2">
        <span className="font-display text-xs font-extrabold uppercase tracking-wider">Desmos · {label}</span>
        <div className="ml-auto flex flex-wrap gap-2">
          <button type="button" className="btn !px-2.5 !py-1 !text-xs" onClick={() => apply(setup)} disabled={state !== "ready"}>
            <RotateCcw size={13} /> Reset
          </button>
          <button type="button" className="btn !px-2.5 !py-1 !text-xs" onClick={() => calc.current?.setBlank()} disabled={state !== "ready"}>
            <Eraser size={13} /> Clear
          </button>
          <a className="btn !px-2.5 !py-1 !text-xs" href="https://www.desmos.com/calculator" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={13} /> Open Desmos
          </a>
        </div>
      </div>
      <div className="relative" style={{ height }}>
        <div ref={host} className="absolute inset-0" />
        {state === "loading" && (
          <div className="absolute inset-0 grid place-items-center bg-paper/90 retro text-[10px]">LOADING DESMOS…</div>
        )}
        {state === "error" && (
          <div className="absolute inset-0 grid place-items-center bg-paper p-6 text-center">
            <div>
              <p className="mb-3 font-semibold">{msg || "The calculator couldn't load."}</p>
              <button type="button" className="btn btn-primary" onClick={() => setAttempt((a) => a + 1)}>Try again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
