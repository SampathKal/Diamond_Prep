import { useState } from "react"
import { CHALLENGE } from "@/data/challenge"
import { PageHead, Prose, Verdict } from "@/components/Page"
import AnswerInput from "@/components/AnswerInput"
import { useStore } from "@/components/AppState"
import { answerText, isCorrect } from "@/lib/answers"

export default function Challenge() {
  const { done } = useStore()
  const count = CHALLENGE.filter((c) => done[c.id]).length
  return (
    <div className="mx-auto max-w-3xl">
      <PageHead kicker="720+" title="Challenge">
        Seven hard questions picked from the areas students miss most. No method is suggested: decide for yourself. A wrong answer unlocks a small hint and you can try again. The full explanation appears when you finish.
      </PageHead>
      <p className="mb-6 font-display font-extrabold">{count} / {CHALLENGE.length} solved</p>
      <div className="space-y-6">{CHALLENGE.map((c) => <Card key={c.id} id={c.id} />)}</div>
    </div>
  )
}

function Card({ id }: { id: string }) {
  const c = CHALLENGE.find((x) => x.id === id)!
  const { markDone } = useStore()
  const [hints, setHints] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [phase, setPhase] = useState<"working" | "correct" | "gaveup">("working")

  const check = (v: string) => {
    if (isCorrect(c.answer, v)) {
      setPhase("correct")
      markDone(c.id)
    } else {
      // every wrong attempt unlocks the next hint (a small one first), and the student can try again
      setWrong((w) => w + 1)
      setHints((h) => Math.min(3, h + 1))
    }
  }
  return (
    <article className="box p-5">
      <div className="mb-3 flex items-center gap-2"><span className="retro text-xs">Q{c.number}</span><span className="chip !bg-danger !text-white">Hard</span></div>
      <p className="mb-4 whitespace-pre-line text-lg font-medium">{c.question}</p>
      {hints > 0 && (
        <ol className="mb-4 space-y-2">
          {c.hints.slice(0, hints).map((h, i) => <li key={i} className="box-flat bg-sun/50 px-3 py-2 text-sm"><b>Hint {i + 1}:</b> {h}</li>)}
        </ol>
      )}
      {phase === "working" ? (
        <>
          {wrong > 0 && <Verdict ok={false}>Not yet{hints < 3 ? ": here's a hint. Try again." : ". You've seen all three hints."}</Verdict>}
          <AnswerInput key={wrong} answer={c.answer} onSubmit={check} />
          <div className="mt-3 flex flex-wrap gap-4 text-sm font-bold">
            {hints < 3 && <button type="button" className="underline" onClick={() => setHints(hints + 1)}>{hints === 0 ? "Give me a hint" : "Another hint"}</button>}
            <button type="button" className="underline" onClick={() => setPhase("gaveup")}>I'm done: show the explanation</button>
          </div>
        </>
      ) : (
        <div>
          <Verdict ok={phase === "correct"}>{phase === "correct" ? `Correct${wrong ? ` after ${wrong} wrong ${wrong === 1 ? "try" : "tries"}` : " on the first try"}.` : `Answer: ${answerText(c.answer)}`}</Verdict>
          <Prose text={c.explanation} />
        </div>
      )}
    </article>
  )
}
