import { Link } from "react-router-dom"
import { ArrowRight, Calculator, Camera, Flame, PenLine, Ruler, Target } from "lucide-react"
import { PROBLEMS } from "@/data/problems"
import { TECHNIQUES } from "@/data/techniques"
import { Progress } from "@/components/ui/8bit-progress"
import { useStore } from "@/components/AppState"
import { Gem } from "@/components/Gem"

const CARDS = [
  { to: "/problems", icon: Target, title: "Practice problems", text: `${PROBLEMS.length} problems from easy to hard. Every explanation says whether Desmos or algebra is faster.`, bg: "bg-mint" },
  { to: "/desmos", icon: Calculator, title: "Desmos tricks", text: `${TECHNIQUES.length} techniques in a live calculator, each with when NOT to use it.`, bg: "bg-sun" },
  { to: "/scan", icon: Camera, title: "Scan a question", text: "Upload a question and get the pattern, the fastest method, and the Desmos setup.", bg: "bg-[#ffb4a8]" },
  { to: "/toolkit", icon: Ruler, title: "Math toolkit", text: "Formulas with how to recognize them, when to use them, and the mistakes to avoid.", bg: "bg-[#b9c8ff]" },
  { to: "/reading-writing", icon: PenLine, title: "Reading & Writing", text: "Ten strategies with a practice question for each.", bg: "bg-[#d9c6ff]" },
  { to: "/challenge", icon: Flame, title: "720+ Challenge", text: "Seven hard questions with no hints about the method. Hints are optional.", bg: "bg-foreground text-background" },
]

export default function Home() {
  const { done } = useStore()
  const solved = PROBLEMS.filter((p) => done[p.id]).length
  const challengeDone = Object.keys(done).filter((k) => k.startsWith("c")).length
  return (
    <div>
      <section className="grid items-center gap-8 pb-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="chip mb-4 !bg-mint">SAT prep that teaches method choice</span>
          <h1 className="font-display text-5xl font-black leading-[0.95] md:text-7xl">
            Learn the pattern.<br />Choose the method.<br /><span className="text-primary">Know when to use Desmos.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Desmos is a superpower on the digital SAT, but it is not always the fastest tool. Diamond trains you to see the pattern, then pick the quickest method.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/problems" className="btn btn-primary">Start practicing <ArrowRight size={18} /></Link>
            <Link to="/desmos" className="btn">See Desmos tricks</Link>
          </div>
        </div>
        <div className="box p-6">
          <div className="mb-4 flex items-center gap-3"><Gem name="Diamond" size={44} /><p className="font-display text-xl font-black">Your progress</p></div>
          <p className="mb-1 text-sm font-semibold">Problems solved: {solved} / {PROBLEMS.length}</p>
          <Progress value={(solved / PROBLEMS.length) * 100} variant="retro" className="mb-4 h-4" />
          <p className="mb-1 text-sm font-semibold">Challenge questions: {challengeDone} / 7</p>
          <Progress value={(challengeDone / 7) * 100} variant="retro" progressBg="bg-danger" className="h-4" />
          <p className="mt-3 text-xs text-muted-foreground">Saved in this browser only.</p>
        </div>
      </section>
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className={`box box-hover block p-5 ${c.bg}`}>
            <c.icon size={28} className="mb-3" />
            <h2 className="font-display text-2xl font-black">{c.title}</h2>
            <p className="mt-1 opacity-90">{c.text}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
