import { useEffect, useRef, useState } from "react"
import { Avatar, Gem, GEMS } from "./Gem"
import { useStore } from "./AppState"

export default function ProfileMenu() {
  const { profile, setProfile } = useStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey) }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="dialog" aria-label="Open profile" className="flex items-center gap-2">
        <Avatar gem={profile.gem} size={38} />
        <span className="hidden font-display text-sm font-bold 2xl:inline">{profile.name || profile.gem}</span>
      </button>
      {open && (
        <div role="dialog" aria-label="Profile" className="box fade-up absolute right-0 top-[calc(100%+10px)] z-50 w-[19rem] p-4">
          <p className="font-display text-lg font-extrabold">Your profile</p>
          <p className="mb-3 text-xs text-muted-foreground">Just for looks: pick a gem and a name. Saved on this device only.</p>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider" htmlFor="pname">Name</label>
          <input id="pname" className="input mb-3" maxLength={24} value={profile.name} placeholder="Your name" onChange={(e) => setProfile({ name: e.target.value })} />
          <p className="mb-1 text-xs font-bold uppercase tracking-wider">Gem</p>
          <div className="grid grid-cols-5 gap-1.5">
            {GEMS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setProfile({ gem: g })}
                aria-pressed={profile.gem === g}
                title={g}
                className={`grid place-items-center border-[3px] border-foreground p-1 ${profile.gem === g ? "bg-primary/20 shadow-[3px_3px_0_var(--foreground)]" : "bg-paper"}`}
              >
                <Gem name={g} size={30} />
                <span className="text-[10px] font-bold">{g}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
