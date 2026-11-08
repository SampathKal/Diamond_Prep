import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import { TRACK_NAME, useMusic } from "./AppState"

/** Small, quiet music control: play/pause, a tiny sound indicator, track name, volume. */
export default function MusicControl({ compact = false }: { compact?: boolean }) {
  const { playing, volume, error, locked, toggle, setVolume } = useMusic()
  const title = locked ? "Music is paused during timed exam mode" : playing ? "Pause music" : "Play music"
  return (
    <div className="flex items-center gap-2 text-sm" aria-label="Background music">
      <button
        type="button"
        onClick={toggle}
        disabled={locked}
        aria-label={title}
        title={title}
        className="btn !px-2 !py-1.5 !shadow-[2px_2px_0_var(--foreground)]"
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <span className="flex h-4 w-4 items-end gap-[2px]" aria-hidden="true" style={{ opacity: playing ? 1 : 0.25 }}>
        {playing ? (
          <>
            <i className="eq-bar" />
            <i className="eq-bar" />
            <i className="eq-bar" />
          </>
        ) : (
          <i className="block h-[3px] w-full bg-current" />
        )}
      </span>
      {!compact && (
        <span className="hidden whitespace-nowrap font-display text-xs font-bold uppercase tracking-wider 2xl:inline">{TRACK_NAME}</span>
      )}
      <label className="flex items-center gap-1">
        <span className="sr-only">Music volume</span>
        {volume === 0 ? <VolumeX size={14} aria-hidden /> : <Volume2 size={14} aria-hidden />}
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(volume * 100)}
          onChange={(e) => setVolume(Number(e.target.value) / 100)}
          className="h-1 w-16 cursor-pointer accent-[var(--primary)]"
          aria-label="Music volume"
        />
      </label>
      {locked && <span className="chip !bg-sun">exam</span>}
      {error && (
        <span role="status" className="max-w-[16rem] text-xs font-semibold text-danger">
          {error}
        </span>
      )}
    </div>
  )
}
