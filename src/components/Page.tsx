import type { ReactNode } from "react"
export function PageHead({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8">
      {kicker && <span className="chip mb-3 !bg-sun">{kicker}</span>}
      <h1 className="font-display text-4xl font-black md:text-5xl">{title}</h1>
      {children && <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{children}</p>}
    </div>
  )
}
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-5">
      <h3 className="mb-1 font-display text-sm font-extrabold uppercase tracking-wider text-primary">{title}</h3>
      <div className="leading-relaxed">{children}</div>
    </section>
  )
}
export function Verdict({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div role="status" className={`box-flat fade-up mb-3 px-4 py-2 font-display font-extrabold ${ok ? "bg-mint" : "bg-[#ff9d8f]"}`}>
      {children}
    </div>
  )
}
export function Prose({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((p, i) => (
        <p key={i} className="mb-2 whitespace-pre-line">{p}</p>
      ))}
    </>
  )
}
