import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Loader2, Upload } from "lucide-react"
import { PageHead, Section } from "@/components/Page"
import DesmosCalc from "@/components/DesmosCalc"
import type { DesmosExpr, DesmosSetup } from "@/data/types"

interface ScanResult {
  is_sat_math: boolean
  topic?: string
  pattern?: string
  structure?: string
  techniques?: { id: string; name: string }[]
  use_desmos?: "yes" | "no" | "either"
  why?: string
  desmos_lines?: string[]
  read_the_result?: string
  method?: string[]
  algebra_version?: string
  pitfalls?: string[]
  answer?: string
  confidence?: "high" | "medium" | "low"
  needs_clarification?: string
}

/** "table: x1 = 3, 8 | y1 = 7, 22" becomes a real Desmos table; other lines become expressions. */
function toExpr(line: string): DesmosExpr | null {
  const t = line.trim()
  if (/^table\s*:/i.test(t)) {
    const cols = t.replace(/^table\s*:/i, "").split("|").map((c) => {
      const [name, vals] = c.split("=")
      return { latex: (name ?? "").trim().replace(/^([xy])(\d)$/, "$1_$2"), values: (vals ?? "").split(",").map((v) => v.trim()).filter(Boolean) }
    }).filter((c) => c.latex && c.values.length)
    return cols.length ? { type: "table", columns: cols } : null
  }
  const clean = t.replace(/\s*\(slider[^)]*\)\s*$/i, "").replace(/^\(first:.*\)$/i, "")
  return clean ? { latex: clean } : null
}

const toB64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "")
    r.onerror = () => reject(new Error("Couldn't read that file."))
    r.readAsDataURL(file)
  })

export default function Scan() {
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")
  const [res, setRes] = useState<ScanResult | null>(null)
  const input = useRef<HTMLInputElement>(null)

  const pick = (f: File | null) => {
    setErr("")
    if (f && !/^image\/(png|jpeg|webp|gif)$/.test(f.type)) return setErr("Please choose a PNG, JPEG, WebP or GIF image.")
    if (f && f.size > 4 * 1024 * 1024) return setErr("That image is over 4 MB. Try a smaller screenshot.")
    setFile(f)
  }

  const run = async () => {
    if (!file && !text.trim()) return setErr("Add a photo or paste the question text first.")
    setBusy(true); setErr(""); setRes(null)
    try {
      const image = file ? { mediaType: file.type, data: await toB64(file) } : undefined
      const r = await fetch("/api/scan", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text, image }) })
      const data = (await r.json().catch(() => null)) as (ScanResult & { error?: string }) | null
      if (!data) {
        throw new Error(
          "The scanner server isn't running here. It only works on Vercel, or locally with `npx vercel dev` (plus OPENAI_API_KEY in .env.local). `npm run dev` can't run it.",
        )
      }
      if (!r.ok) throw new Error(data.error || `Something went wrong (status ${r.status}).`)
      setRes(data)
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.")
    } finally {
      setBusy(false)
    }
  }

  const exprs = (res?.desmos_lines ?? []).map(toExpr).filter((e): e is DesmosExpr => !!e)
  const setup: DesmosSetup | undefined = exprs.length ? { expressions: exprs } : undefined
  const noDesmos = res?.is_sat_math && res.use_desmos === "no"

  return (
    <div className="mx-auto max-w-4xl">
      <PageHead kicker="Scanner" title="Scan a Question">
        Upload a screenshot or paste a question. You get the pattern, whether Desmos is the fastest tool, and the exact setup.
      </PageHead>
      <div className="box mb-6 space-y-4 p-5">
        <div>
          <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={(e) => pick(e.target.files?.[0] ?? null)} aria-label="Upload a question image" />
          <button type="button" className="btn" onClick={() => input.current?.click()}><Upload size={16} /> {file ? "Change image" : "Upload image"}</button>
          {file && <span className="ml-3 text-sm font-semibold">{file.name} <button type="button" className="underline" onClick={() => { setFile(null); if (input.current) input.current.value = "" }}>remove</button></span>}
        </div>
        <div>
          <label htmlFor="q" className="mb-1 block text-xs font-bold uppercase tracking-wider">Or paste the question</label>
          <textarea id="q" rows={5} maxLength={4000} className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the question and answer choices here" />
        </div>
        {err && <p role="alert" className="font-semibold text-danger">{err}</p>}
        <button type="button" className="btn btn-primary" onClick={run} disabled={busy}>{busy ? <><Loader2 className="animate-spin" size={16} /> Analyzing…</> : "Analyze question"}</button>
      </div>

      {res && (
        <div className="box fade-up p-5">
          {!res.is_sat_math ? (
            <p>{res.why || "That doesn't look like an SAT math question."}</p>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                {res.topic && <span className="chip">{res.topic}</span>}
                {res.use_desmos && <span className={`chip ${res.use_desmos === "yes" ? "!bg-mint" : res.use_desmos === "no" ? "!bg-[#ff9d8f]" : "!bg-sun"}`}>Desmos: {res.use_desmos === "no" ? "not the best tool" : res.use_desmos === "either" ? "optional" : "helpful"}</span>}
                {res.confidence && <span className={`chip ${res.confidence === "low" ? "!bg-[#ff9d8f]" : ""}`}>Confidence: {res.confidence}</span>}
              </div>
              {res.needs_clarification && (
                <div role="note" className="box-flat mb-4 bg-sun/60 p-3"><b>Not sure about this one:</b> {res.needs_clarification} Add the missing detail above and scan again.</div>
              )}
              {res.structure && <Section title="How the question is built"><p>{res.structure}</p></Section>}
              {res.pattern && <Section title="Pattern"><p>{res.pattern}</p></Section>}
              {!!res.techniques?.length && (
                <Section title="Matching Desmos technique">
                  <ul className="flex flex-wrap gap-2">
                    {res.techniques.map((t) => <li key={t.id}><Link to={`/desmos/${t.id}`} className="btn !py-1 !text-sm">{t.name} →</Link></li>)}
                  </ul>
                </Section>
              )}
              {noDesmos && <div role="note" className="box-flat mb-4 bg-[#ff9d8f]/50 p-3 font-semibold">No library technique makes this faster. Use the traditional method below.</div>}
              {res.why && <Section title={noDesmos ? "Why not Desmos" : "Why this method"}><p>{res.why}</p></Section>}
              {!!res.desmos_lines?.length && <Section title="Type into Desmos"><div className="space-y-1">{res.desmos_lines.map((l, i) => <div key={i} className="code">{l}</div>)}</div></Section>}
              {res.read_the_result && <Section title="How to read the result"><p>{res.read_the_result}</p></Section>}
              {!!res.method?.length && <Section title="Traditional solution"><ol className="list-decimal space-y-1 pl-5">{res.method.map((m, i) => <li key={i}>{m}</li>)}</ol></Section>}
              {res.algebra_version && <Section title="Algebra notes"><p>{res.algebra_version}</p></Section>}
              {!!res.pitfalls?.length && <Section title="Watch out"><ul className="list-disc pl-5">{res.pitfalls.map((m, i) => <li key={i}>{m}</li>)}</ul></Section>}
              {res.answer && <p className="mt-2 font-display font-extrabold">Answer: {res.answer}</p>}
              <p className="mt-3 text-xs text-muted-foreground">AI-generated: double-check the result before trusting it.</p>
              {setup && !noDesmos && <div className="mt-4"><DesmosCalc setup={setup} height={380} label="Suggested setup" /></div>}
            </>
          )}
        </div>
      )}
    </div>
  )
}
