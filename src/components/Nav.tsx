import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Gem } from "./Gem"
import MusicControl from "./MusicControl"
import ProfileMenu from "./ProfileMenu"

export const NAV = [
  { to: "/problems", label: "Problems" },
  { to: "/desmos", label: "Desmos" },
  { to: "/scan", label: "Scan" },
  { to: "/toolkit", label: "Toolkit" },
  { to: "/reading-writing", label: "Reading & Writing" },
  { to: "/challenge", label: "720+" },
  { to: "/exam", label: "Exam" },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const link = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap px-2.5 py-1.5 font-display text-xs text-sm font-extrabold uppercase tracking-wide border-[3px] transition-colors ${
      isActive ? "border-foreground bg-foreground text-background" : "border-transparent hover:border-foreground"
    }`
  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-foreground bg-background">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)} aria-label="Diamond home">
          <Gem name="Diamond" size={34} />
          <span className="font-display text-2xl font-black tracking-tight">DIAMOND</span>
        </Link>
        <nav className="ml-4 hidden items-center gap-1 xl:flex" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={link}>{n.label}</NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:block"><MusicControl /></div>
          <ProfileMenu />
          <button type="button" className="btn !p-2 xl:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="fade-up border-t-[3px] border-foreground bg-background px-4 pb-4 xl:hidden">
          <nav className="flex flex-col gap-1 py-3" aria-label="Mobile">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={link} onClick={() => setOpen(false)}>{n.label}</NavLink>
            ))}
          </nav>
          <div className="md:hidden"><MusicControl compact /></div>
        </div>
      )}
    </header>
  )
}
