import { useState } from "react"
import type { Answer } from "@/data/types"
import { parseNumeric } from "@/lib/answers"

/** Shared answer field: radio choices for multiple choice, a text box for numeric answers. */
export default function AnswerInput({
  answer,
  onSubmit,
  disabled,
  buttonLabel = "Check answer",
}: {
  answer: Answer
  onSubmit: (value: string) => void
  disabled?: boolean
  buttonLabel?: string
}) {
  const [value, setValue] = useState("")
  const [err, setErr] = useState("")
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (answer.kind === "num" && parseNumeric(value) === null) {
      setErr("Enter a number (for example 12, -3.5 or 7/4).")
      return
    }
    if (answer.kind === "mc" && value === "") {
      setErr("Choose an answer first.")
      return
    }
    setErr("")
    onSubmit(value)
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      {answer.kind === "mc" ? (
        <fieldset disabled={disabled} className="grid gap-2">
          <legend className="sr-only">Answer choices</legend>
          {answer.choices.map((c, i) => (
            <label
              key={i}
              className={`flex cursor-pointer items-center gap-3 border-[3px] border-foreground px-3 py-2 ${value === String(i) ? "bg-primary/15 shadow-[3px_3px_0_var(--foreground)]" : "bg-paper"}`}
            >
              <input type="radio" name="mc" value={i} checked={value === String(i)} onChange={() => setValue(String(i))} className="accent-[var(--primary)]" />
              <span className="font-display font-extrabold">{String.fromCharCode(65 + i)}</span>
              <span>{c}</span>
            </label>
          ))}
        </fieldset>
      ) : (
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider" htmlFor="ans">Your answer</label>
          <input id="ans" className="input max-w-xs" inputMode="decimal" autoComplete="off" disabled={disabled} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type a number" />
        </div>
      )}
      {err && <p className="text-sm font-semibold text-danger" role="alert">{err}</p>}
      <button type="submit" className="btn btn-primary" disabled={disabled}>{buttonLabel}</button>
    </form>
  )
}
