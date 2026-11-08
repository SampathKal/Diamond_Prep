import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { PROBLEMS, TOPICS } from "@/data/problems"
import { PageHead, Prose, Verdict } from "@/components/Page"
import AnswerInput from "@/components/AnswerInput"
import DesmosCalc from "@/components/DesmosCalc"
import { useStore } from "@/components/AppState"
import { answerText, isCorrect } from "@/lib/answers"
import type { Difficulty } from "@/data/types"

export default function Problems() {
  const { id } = useParams()
  const problem = PROBLEMS.find((p) => p.id === id)
  return problem ? <ProblemView key={problem.id} idx={PROBLEMS.indexOf(problem)} /> : <ProblemList />
}

function ProblemList() {
  const { done } = useStore()
  const [topic, setTopic] = useState<string>("All")
  const [diff, setDiff] = useState<Difficulty | "All">("All")
  const [q, setQ] = useState("")
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase().replace(/^#|^q/, "")
    // a bare number jumps to that question number if there is one
    const byNumber = /^\d+$/.test(needle) ? PROBLEMS.filter((p) => String(p.number) === needle) : []
    if (byNumber.length) return byNumber.filter((p) => (topic === "All" || p.topic === topic) && (diff === "All" || p.difficulty === diff))
    return PROBLEMS.filter(
      (p) =>
        (topic === "All" || p.topic === topic) &&
        (diff === "All" || p.difficulty === diff) &&
        (!needle || p.question.toLowerCase().includes(needle) || p.topic.toLowerCase().includes(needle) || String(p.number) === needle),
    )
  }, [topic, diff, q])
  return (
    <div>
      <PageHead kicker={`${PROBLEMS.length} problems`} title="Problems">Each explanation tells you whether Desmos or algebra is the faster method for that problem.</PageHead>
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <label className="text-sm font-bold">Search
          <input type="search" className="input ml-2 !w-56" value={q} onChange={(e) => setQ(e.target.value)} placeholder="word or number, e.g. circle, 14" />
        </label>
        <label className="text-sm font-bold">Topic
          <select className="input ml-2 !w-auto" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option>All</option>
            {TOPICS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="text-sm font-bold">Difficulty
          <select className="input ml-2 !w-auto" value={diff} onChange={(e) => setDiff(e.target.value as Difficulty | "All")}>
            {["All", "Easy", "Medium", "Hard"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
      </div>
      {list.length === 0 && <p className="box-flat p-4">No problems match. <button type="button" className="underline font-bold" onClick={() => { setQ(""); setTopic("All"); setDiff("All") }}>Clear filters</button></p>}
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {list.map((p) => (
          <li key={p.id} className="min-w-0">
            <Link to={`/problems/${p.id}`} className="box-flat box-hover flex items-center gap-3 p-3">
              <span className="retro w-10 text-xs">{String(p.number).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display font-extrabold">{p.topic}</span>
                <span className="block truncate text-sm text-muted-foreground">{p.question.split("\n")[0]}</span>
              </span>
              <span className={`chip diff-${p.difficulty}`}>{p.difficulty}</span>
              {done[p.id] && <span className="chip !bg-mint" aria-label="Solved">✓</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProblemView({ idx }: { idx: number }) {
  const p = PROBLEMS[idx]
  const nav = useNavigate()
  const { markDone } = useStore()
  const [result, setResult] = useState<null | { ok: boolean }>(null)
  const [revealed, setRevealed] = useState(false)
  const next = PROBLEMS[idx + 1]
  const prev = PROBLEMS[idx - 1]
  const finished = result !== null || revealed

  const submit = (v: string) => {
    const ok = isCorrect(p.answer, v)
    setResult({ ok })
    if (ok) markDone(p.id)
  }
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/problems" className="mb-4 inline-block font-bold underline">← All problems</Link>
      <div className="box p-5 md:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="retro text-xs">Q{p.number}</span>
          <span className={`chip diff-${p.difficulty}`}>{p.difficulty}</span>
          <span className="chip">{p.topic}</span>
        </div>
        <p className="mb-5 whitespace-pre-line text-lg font-medium leading-relaxed">{p.question}</p>
        {!finished && (
          <>
            <AnswerInput answer={p.answer} onSubmit={submit} />
            <button type="button" className="mt-4 text-sm font-bold underline" onClick={() => setRevealed(true)}>Show the answer and explanation</button>
          </>
        )}
        {finished && (
          <div>
            {result && <Verdict ok={result.ok}>{result.ok ? "Correct." : `Not quite. The answer is ${answerText(p.answer)}.`}</Verdict>}
            {!result && <Verdict ok={false}>Answer: {answerText(p.answer)}</Verdict>}
            <h3 className="mb-1 font-display text-sm font-extrabold uppercase tracking-wider text-primary">Explanation</h3>
            <Prose text={p.explanation} />
            {p.viz && <div className="mt-4"><DesmosCalc setup={p.viz} height={380} label="See it in Desmos" /></div>}
            {!result?.ok && !revealed && <button type="button" className="btn mt-4" onClick={() => setResult(null)}>Try again</button>}
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-between">
        <button type="button" className="btn" disabled={!prev} onClick={() => prev && nav(`/problems/${prev.id}`)}>← Previous</button>
        <button type="button" className="btn btn-primary" disabled={!next} onClick={() => next && nav(`/problems/${next.id}`)}>Next →</button>
      </div>
    </div>
  )
}
