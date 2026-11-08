import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { TECHNIQUES } from "@/data/techniques"
import { PageHead, Prose, Section, Verdict } from "@/components/Page"
import DesmosCalc from "@/components/DesmosCalc"
import AnswerInput from "@/components/AnswerInput"
import { exprLines } from "@/lib/exprs"
import { answerText, isCorrect } from "@/lib/answers"

export default function DesmosTricks() {
  const { id } = useParams()
  const t = TECHNIQUES.find((x) => x.id === id)
  return t ? <Detail key={t.id} id={t.id} /> : <List />
}

function List() {
  const cats = useMemo(() => ["All", ...Array.from(new Set(TECHNIQUES.map((t) => t.category)))], [])
  const [cat, setCat] = useState("All")
  const list = TECHNIQUES.filter((t) => cat === "All" || t.category === cat)
  return (
    <div>
      <PageHead kicker={`${TECHNIQUES.length} techniques`} title="Desmos Tricks">
        Every trick shows what it is, how to spot it, a live Desmos example, and when algebra is faster.
      </PageHead>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {cats.map((c) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={`btn !py-1 !text-sm ${cat === c ? "btn-ink" : ""}`}>{c}</button>
        ))}
      </div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {list.map((t) => (
          <li key={t.id}>
            <Link to={`/desmos/${t.id}`} className="box box-hover block h-full p-4">
              <span className="chip mb-2">{t.category}</span>
              <h2 className="font-display text-xl font-black">{t.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.recognize}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Detail({ id }: { id: string }) {
  const nav = useNavigate()
  const idx = TECHNIQUES.findIndex((t) => t.id === id)
  const t = TECHNIQUES[idx]
  const [verdict, setVerdict] = useState<null | boolean>(null)
  const [showEx, setShowEx] = useState(false)
  const [mode, setMode] = useState<"example" | "practice">("example")
  const lines = exprLines(t.setup)
  const setup = mode === "example" ? t.setup : t.practice.setup ?? t.setup
  return (
    <div>
      <Link to="/desmos" className="mb-4 inline-block font-bold underline">← All techniques</Link>
      <div className="mb-6">
        <span className="chip mb-2">{t.category}</span>
        <h1 className="font-display text-3xl font-black md:text-4xl">{t.name}</h1>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="min-w-0 space-y-4">
          <div className="box p-5">
            <Section title="What it is"><p>{t.what}</p></Section>
            <Section title="How to recognize it"><p>{t.recognize}</p></Section>
            <Section title="When it is useful"><p>{t.useful}</p></Section>
            <div className="box-flat -mx-1 bg-sun/60 p-3"><Section title="When NOT to use it"><p>{t.notWhen}</p></Section></div>
          </div>
          <div className="box p-5">
            <Section title="Example"><p className="whitespace-pre-line font-medium">{t.example.question}</p></Section>
            <Section title="Type this into Desmos">
              <div className="space-y-1">{lines.map((l, i) => <div key={i} className="code">{l}</div>)}</div>
            </Section>
            <Section title="Steps">
              <ol className="list-decimal space-y-1 pl-5">{t.example.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              <p className="mt-2 font-display font-extrabold">Answer: {t.example.answerText}</p>
            </Section>
            <Section title="What to look for"><p>{t.lookFor}</p></Section>
            <Section title="Common mistakes"><ul className="list-disc space-y-1 pl-5">{t.mistakes.map((m, i) => <li key={i}>{m}</li>)}</ul></Section>
            <Section title="The algebra version"><p>{t.algebraNote}</p></Section>
          </div>
        </div>
        <div className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="flex gap-2">
            <button type="button" className={`btn !py-1 ${mode === "example" ? "btn-ink" : ""}`} onClick={() => setMode("example")}>Example setup</button>
            <button type="button" className={`btn !py-1 ${mode === "practice" ? "btn-ink" : ""}`} onClick={() => setMode("practice")}>Practice setup</button>
          </div>
          <DesmosCalc setup={setup} height={460} label={mode === "example" ? "Live example" : "Practice workspace"} />
          <div className="box p-5">
            <h3 className="mb-2 font-display text-lg font-black">Try it yourself</h3>
            <p className="mb-4 whitespace-pre-line font-medium">{t.practice.question}</p>
            <AnswerInput answer={t.practice.answer} onSubmit={(v) => { setVerdict(isCorrect(t.practice.answer, v)); setShowEx(true) }} />
            {verdict !== null && (
              <div className="mt-4">
                <Verdict ok={verdict}>{verdict ? "Correct." : `Not quite. The answer is ${answerText(t.practice.answer)}.`}</Verdict>
                {showEx && <Prose text={t.practice.explanation} />}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <button type="button" className="btn" disabled={idx === 0} onClick={() => nav(`/desmos/${TECHNIQUES[idx - 1].id}`)}>← Previous</button>
        <button type="button" className="btn btn-primary" disabled={idx === TECHNIQUES.length - 1} onClick={() => nav(`/desmos/${TECHNIQUES[idx + 1].id}`)}>Next →</button>
      </div>
    </div>
  )
}
