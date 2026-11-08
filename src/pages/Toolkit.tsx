import { useState } from "react"
import { TOOLKIT } from "@/data/toolkit"
import { PageHead, Section } from "@/components/Page"

export default function Toolkit() {
  const [sec, setSec] = useState(TOOLKIT[0].id)
  const section = TOOLKIT.find((s) => s.id === sec)!
  return (
    <div>
      <PageHead kicker="Reference" title="Math Toolkit">
        Not a formula dump. Each entry says how to recognize the problem, when to use the formula, and what students get wrong.
      </PageHead>
      <div className="mb-6 flex flex-wrap gap-2" role="tablist">
        {TOOLKIT.map((s) => (
          <button key={s.id} role="tab" aria-selected={sec === s.id} type="button" onClick={() => setSec(s.id)} className={`btn ${sec === s.id ? "btn-ink" : ""}`}>{s.name}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {section.items.map((it) => (
          <article key={it.title} className="box min-w-0 p-5">
            <h2 className="mb-3 font-display text-xl font-black">{it.title}</h2>
            <div className="mb-4 space-y-1">{it.formula.map((f, i) => <div key={i} className="code">{f}</div>)}</div>
            {it.relationships && <Section title="Key relationships"><p>{it.relationships}</p></Section>}
            <Section title="How to recognize it"><p>{it.recognize}</p></Section>
            <Section title="When to use it"><p>{it.whenToUse}</p></Section>
            <Section title="Example"><p className="font-medium">{it.example.problem}</p><p className="text-muted-foreground">{it.example.solution}</p></Section>
            <Section title="Common mistakes"><ul className="list-disc pl-5">{it.mistakes.map((m, i) => <li key={i}>{m}</li>)}</ul></Section>
          </article>
        ))}
      </div>
    </div>
  )
}
