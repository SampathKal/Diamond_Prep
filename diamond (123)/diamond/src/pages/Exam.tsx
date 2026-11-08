import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Calculator, Clock, VolumeX } from "lucide-react"
import { PROBLEMS } from "@/data/problems"
import type { Problem } from "@/data/types"
import { PageHead, Prose } from "@/components/Page"
import AnswerInput from "@/components/AnswerInput"
import DesmosCalc from "@/components/DesmosCalc"
import { useMusic, useStore } from "@/components/AppState"
import { answerText, isCorrect } from "@/lib/answers"

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

function pickProblems(n: number): Problem[] {
  const a = [...PROBLEMS]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, n)
}

type Phase = "setup" | "running" | "done"

export default function Exam() {
  const { lock } = useMusic()
  const { markDone } = useStore()
  const [phase, setPhase] = useState<Phase>("setup")
  const [count, setCount] = useState(10)
  const [minutes, setMinutes] = useState(15)
  const [qs, setQs] = useState<Problem[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [cur, setCur] = useState(0)
  const [left, setLeft] = useState(0)
  const [calc, setCalc] = useState(false)
  const endAt = useRef(0)

  // Music is paused and locked for the whole time the exam clock is running.
  useEffect(() => {
    if (phase !== "running") return
    const release = lock()
    return release
  }, [phase, lock])

  const finish = useCallback(() => {
    setPhase("done")
    setCalc(false)
  }, [])

  // countdown from a wall-clock end time, so a throttled background tab can't cheat the timer
  useEffect(() => {
    if (phase !== "running") return
    const tick = () => {
      const s = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000))
      setLeft(s)
      if (s === 0) finish()
    }
    tick()
    const id = window.setInterval(tick, 500)
    return () => clearInterval(id)
  }, [phase, finish])

  useEffect(() => {
    if (phase !== "running") return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [phase])

  const start = () => {
    const picked = pickProblems(count)
    setQs(picked)
    setAnswers({})
    setCur(0)
    endAt.current = Date.now() + minutes * 60_000
    setLeft(minutes * 60)
    setPhase("running")
  }

  const results = useMemo(() => qs.map((q) => ({ q, given: answers[q.id], ok: answers[q.id] !== undefined && isCorrect(q.answer, answers[q.id]) })), [qs, answers])
  useEffect(() => {
    if (phase === "done") results.forEach((r) => r.ok && markDone(r.q.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHead kicker="Timed" title="Timed Exam">A mixed set from the problem bank with a countdown. Music pauses while the clock runs. Desmos stays available.</PageHead>
        <div className="box space-y-5 p-5">
          <fieldset>
            <legend className="mb-2 text-xs font-bold uppercase tracking-wider">Questions</legend>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((n) => (
                <button key={n} type="button" aria-pressed={count === n} className={`btn ${count === n ? "btn-ink" : ""}`} onClick={() => { setCount(n); setMinutes(Math.round(n * 1.5)) }}>{n}</button>
              ))}
            </div>
          </fieldset>
          <label className="block text-sm font-bold">Minutes
            <input type="number" min={1} max={120} className="input mt-1 !w-28" value={minutes} onChange={(e) => setMinutes(Math.max(1, Math.min(120, Number(e.target.value) || 1)))} />
          </label>
          <p className="text-sm text-muted-foreground">Default pace is 1.5 minutes per question. Unanswered questions count as wrong. The exam ends when time runs out.</p>
          <button type="button" className="btn btn-primary" onClick={start}><Clock size={16} /> Start exam</button>
        </div>
      </div>
    )
  }

  if (phase === "done") {
    const score = results.filter((r) => r.ok).length
    return (
      <div className="mx-auto max-w-3xl">
        <PageHead kicker="Finished" title={`${score} / ${qs.length} correct`}>Review each question below. Solved questions are marked on your Problems page.</PageHead>
        <ul className="space-y-4">
          {results.map(({ q, given, ok }, i) => (
            <li key={q.id} className="box p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="retro text-xs">{i + 1}</span>
                <span className={`chip ${ok ? "!bg-mint" : "!bg-[#ff9d8f]"}`}>{ok ? "Correct" : given === undefined ? "Unanswered" : "Wrong"}</span>
                <span className="chip">{q.topic}</span>
              </div>
              <p className="mb-2 whitespace-pre-line font-medium">{q.question}</p>
              <p className="text-sm"><b>Your answer:</b> {given === undefined ? "none" : q.answer.kind === "mc" ? q.answer.choices[Number(given)] : given} · <b>Correct:</b> {answerText(q.answer)}</p>
              {!ok && <details className="mt-2"><summary className="cursor-pointer font-bold underline">Explanation</summary><div className="mt-2"><Prose text={q.explanation} /></div></details>}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex gap-3"><button type="button" className="btn btn-primary" onClick={() => setPhase("setup")}>New exam</button><Link to="/problems" className="btn">Problems</Link></div>
      </div>
    )
  }

  const q = qs[cur]
  const answered = Object.keys(answers).length
  const low = left <= 60
  return (
    <div className="mx-auto max-w-4xl">
      <div className="box-flat sticky top-[70px] z-30 mb-4 flex flex-wrap items-center gap-3 bg-paper px-4 py-2">
        <span className={`retro text-sm ${low ? "text-danger" : ""}`} role="timer" aria-label="Time left">{fmt(left)}</span>
        <span className="text-sm font-bold">Question {cur + 1} of {qs.length} · {answered} answered</span>
        <span className="chip !bg-sun"><VolumeX size={12} /> music paused</span>
        <button type="button" className="btn ml-auto !py-1 !text-sm" onClick={() => setCalc((c) => !c)} aria-pressed={calc}><Calculator size={14} /> {calc ? "Hide" : "Show"} Desmos</button>
        <button type="button" className="btn btn-ink !py-1 !text-sm" onClick={() => { if (confirm("Submit the exam now?")) finish() }}>Submit</button>
      </div>
      <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Question navigator">
        {qs.map((x, i) => (
          <button key={x.id} type="button" aria-label={`Question ${i + 1}${answers[x.id] !== undefined ? ", answered" : ""}`} aria-current={i === cur} onClick={() => setCur(i)} className={`h-9 w-9 border-[3px] border-foreground font-display font-extrabold ${i === cur ? "bg-foreground text-background" : answers[x.id] !== undefined ? "bg-mint" : "bg-paper"}`}>{i + 1}</button>
        ))}
      </div>
      <div className={`grid gap-4 ${calc ? "lg:grid-cols-2" : ""}`}>
        <div className="box min-w-0 p-5">
          <p className="mb-4 whitespace-pre-line text-lg font-medium">{q.question}</p>
          <AnswerInput key={q.id} answer={q.answer} buttonLabel={cur < qs.length - 1 ? "Save & next" : "Save"} onSubmit={(v) => { setAnswers((a) => ({ ...a, [q.id]: v })); if (cur < qs.length - 1) setCur(cur + 1) }} />
          {answers[q.id] !== undefined && <p className="mt-3 text-sm font-semibold">Saved: {q.answer.kind === "mc" ? q.answer.choices[Number(answers[q.id])] : answers[q.id]} (you can change it and save again)</p>}
        </div>
        {calc && <div className="min-w-0"><DesmosCalc height={420} label="Exam calculator" /></div>}
      </div>
    </div>
  )
}
