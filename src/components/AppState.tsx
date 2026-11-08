import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { GEMS, type GemName } from "./Gem"

/* ---------------- progress + profile ---------------- */

interface Profile { name: string; gem: GemName }
interface StoreShape { done: Record<string, boolean>; profile: Profile }
const KEY = "diamond.state.v1"
const DEFAULT: StoreShape = { done: {}, profile: { name: "", gem: "Stone" } }

function load(): StoreShape {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT
    const p = JSON.parse(raw) as Partial<StoreShape>
    const gem = GEMS.includes(p.profile?.gem as GemName) ? (p.profile!.gem as GemName) : "Stone"
    return { done: p.done ?? {}, profile: { name: p.profile?.name ?? "", gem } }
  } catch {
    return DEFAULT
  }
}

interface StoreApi {
  done: Record<string, boolean>
  markDone: (id: string) => void
  profile: Profile
  setProfile: (p: Partial<Profile>) => void
}
const StoreCtx = createContext<StoreApi | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreShape>(load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage blocked */ }
  }, [state])
  const markDone = useCallback((id: string) => setState((s) => (s.done[id] ? s : { ...s, done: { ...s.done, [id]: true } })), [])
  const setProfile = useCallback((p: Partial<Profile>) => setState((s) => ({ ...s, profile: { ...s.profile, ...p } })), [])
  const value = useMemo(() => ({ done: state.done, markDone, profile: state.profile, setProfile }), [state, markDone, setProfile])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}
export function useStore() {
  const c = useContext(StoreCtx)
  if (!c) throw new Error("StoreProvider missing")
  return c
}

/* ---------------- music ---------------- */

/** Tried in order. The first file that exists and is really audio is used. */
export const TRACK_CANDIDATES = ["/audio/radiant-foundry-kaino.mp3", "/audio/Radiant Foundry - Kaino.mp3"]
export const TRACK_SRC = TRACK_CANDIDATES[0]
const MISSING = "Music file not found. Put your MP3 at public/audio/radiant-foundry-kaino.mp3 (exact name, not .mp3.mp3), then restart the dev server and refresh."

/** A missing file on a SPA host comes back as an HTML page with status 200, so check the content type too. */
async function findTrack(): Promise<string | null> {
  for (const path of TRACK_CANDIDATES) {
    const url = encodeURI(path)
    try {
      const r = await fetch(url, { method: "HEAD", cache: "no-store" })
      const type = r.headers.get("content-type") ?? ""
      if (r.ok && (type.startsWith("audio/") || type.includes("mpeg") || type.includes("octet-stream"))) return url
    } catch {
      /* try the next name */
    }
  }
  return null
}
export const TRACK_NAME = "Radiant Foundry"
export const DEFAULT_VOLUME = 0.15
const VOL_KEY = "diamond.music.volume"

interface MusicApi {
  playing: boolean
  volume: number
  error: string | null
  locked: boolean
  toggle: () => void
  setVolume: (v: number) => void
  /** Pause music and block playback until the returned function is called. Used by timed exam mode. */
  lock: () => () => void
}
const MusicCtx = createContext<MusicApi | null>(null)

function loadVolume() {
  try {
    const v = parseFloat(localStorage.getItem(VOL_KEY) ?? "")
    return Number.isFinite(v) && v >= 0 && v <= 1 ? v : DEFAULT_VOLUME
  } catch {
    return DEFAULT_VOLUME
  }
}

export function MusicProvider({ children }: { children: ReactNode }) {
  // One audio element lives above the router, so music continues across pages.
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolumeState] = useState(loadVolume)
  const [error, setError] = useState<string | null>(null)
  const [locks, setLocks] = useState(0)
  const locked = locks > 0

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio()
      a.loop = true
      a.preload = "none" // nothing is requested until the student presses play
      a.volume = volume
      a.addEventListener("error", () => {
        setPlaying(false)
        setError("The music file couldn't be decoded. Make sure it is a real MP3 (not a renamed video or a cloud-storage link) and refresh.")
      })
      a.addEventListener("pause", () => setPlaying(false))
      a.addEventListener("playing", () => setPlaying(true))
      audioRef.current = a
    }
    return audioRef.current
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
    try { localStorage.setItem(VOL_KEY, String(volume)) } catch { /* ignore */ }
  }, [volume])

  useEffect(() => {
    if (locked) audioRef.current?.pause()
  }, [locked])

  useEffect(() => () => { audioRef.current?.pause() }, [])

  const toggle = useCallback(() => {
    if (locks > 0) return
    const a = getAudio()
    if (!a.paused) { a.pause(); return }
    setError(null)
    const start = () => {
      a.volume = volume
      a.play().catch((e: unknown) => {
        setPlaying(false)
        const name = e instanceof DOMException ? e.name : ""
        if (name !== "AbortError") setError(name === "NotAllowedError" ? "Your browser blocked playback. Press play again." : "Couldn't play the music. Make sure the file is a valid MP3, then refresh.")
      })
    }
    if (a.src) return start()
    // Resolve the file inside this click handler's promise chain so the browser still counts it as a user action.
    findTrack().then((url) => {
      if (!url) { setPlaying(false); setError(MISSING); return }
      a.src = url
      start()
    })
  }, [getAudio, locks, volume])

  const setVolume = useCallback((v: number) => setVolumeState(Math.max(0, Math.min(1, v))), [])
  const lock = useCallback(() => {
    setLocks((n) => n + 1)
    let released = false
    return () => {
      if (released) return
      released = true
      setLocks((n) => Math.max(0, n - 1))
    }
  }, [])

  const value = useMemo(() => ({ playing, volume, error, locked, toggle, setVolume, lock }), [playing, volume, error, locked, toggle, setVolume, lock])
  return <MusicCtx.Provider value={value}>{children}</MusicCtx.Provider>
}
export function useMusic() {
  const c = useContext(MusicCtx)
  if (!c) throw new Error("MusicProvider missing")
  return c
}
