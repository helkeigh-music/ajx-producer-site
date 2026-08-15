import { useEffect, useRef, useState } from 'react'
import type { Beat } from '@/config/site'

type Props = {
  beat: Beat
  autoPlay?: boolean
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function BeatPlayer({ beat, autoPlay = false }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    setPlaying(false)
    setProgress(0)
    setCurrent(0)
    setDuration(0)
  }, [beat.id])

  useEffect(() => {
    if (!autoPlay) return
    void audioRef.current?.play().catch(() => undefined)
  }, [autoPlay, beat.id])

  function toggle() {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      void el.play()
    } else {
      el.pause()
    }
  }

  return (
    <div className="ajx-card p-4 sm:p-5">
      <audio
        ref={audioRef}
        src={beat.audioUrl}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          const el = e.currentTarget
          setCurrent(el.currentTime)
          setProgress(el.duration ? (el.currentTime / el.duration) * 100 : 0)
        }}
        onEnded={() => setPlaying(false)}
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sky-brand text-navy-950 transition hover:bg-sky-light"
        >
          {playing ? (
            <span className="text-lg leading-none">❚❚</span>
          ) : (
            <span className="ml-0.5 text-lg leading-none">▶</span>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{beat.title}</p>
          <p className="text-xs text-white/45">
            {beat.bpm} BPM · {beat.key}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-sky-brand transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] tabular-nums text-white/40">
            <span>{formatTime(current)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
