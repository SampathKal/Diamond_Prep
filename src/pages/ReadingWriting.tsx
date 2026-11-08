import { useState } from "react"
import { RW } from "@/data/rw"
import { PageHead, Section, Verdict } from "@/components/Page"

export default function ReadingWriting() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHead kicker={`${RW.length} strategies`} title="Reading & Writing">
        Learn the pattern in each question type, then try an original practice question. Nothing here is copied from the real test.
      </PageHead>
      <div className="space-y-6">{RW.map((s) => <Card key={s.id} id={s.id} />)}</div>
    </div>
  )
}

function Card({ id }: { id: string }) {
  const s = RW.find((x) => x.id === id)!
  const [pick, setPick] = useState<number | null>(null)
  const p = s.practice
  return (
    <article className="box p-5">
      <h2 className="mb-2 font-display text-2xl font-black">{s.name}</h2>
      <Section title="What the question looks like"><p>{s.pattern}</p></Section>
      <Section title="What to do"><ol className="list-decimal space-y-1 pl-5">{s.doThis.map((d, i) => <li key={i}>{d}</li>)}</ol></Section>
      <Section title="Traps"><ul className="list-disc space-y-1 pl-5">{s.traps.map((d, i) => <li key={i}>{d}</li>)}</ul></Section>
      <Section title="When to use it"><p>{s.whenToUse}</p></Section>
      <div className="box-flat bg-panel p-4">
        <p className="mb-1 font-display text-xs font-extrabold uppercase tracking-wider">Practice</p>
        <p className="mb-3 whitespace-pre-line italic">{p.passage}</p>
        <p className="mb-2 font-bold">{p.question}</p>
        <div className="grid gap-2">
          {p.choices.map((c, i) => (
            <button
              key={i}
              type="button"
              disabled={pick !== null}
              onClick={() => setPick(i)}
              className={`border-[3px] border-foreground px-3 py-2 text-left ${pick === null ? "bg-paper hover:bg-primary/10" : i === p.correct ? "bg-mint" : i === pick ? "bg-[#ff9d8f]" : "bg-paper opacity-70"}`}
            >
              <b className="mr-2">{String.fromCharCode(65 + i)}</b>{c}
            </button>
          ))}
        </div>
        {pick !== null && (
          <div className="mt-3">
            <Verdict ok={pick === p.correct}>{pick === p.correct ? "Correct." : `The answer is ${String.fromCharCode(65 + p.correct)}.`}</Verdict>
            <p>{p.explanation}</p>
            <button type="button" className="btn mt-3 !py-1 !text-sm" onClick={() => setPick(null)}>Reset</button>
          </div>
        )}
      </div>
    </article>
  )
}
