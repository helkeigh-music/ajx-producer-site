import { useEffect, useRef, useState } from 'react'
import type { Beat } from '@/config/site'
import { AudioVisualizer } from '@/components/AudioVisualizer'
import { DiscCover } from '@/components/DiscCover'
import { EmbedPlayer } from '@/components/EmbedPlayer'
import { useAudioAnalyser } from '@/hooks/useAudioAnalyser'
import { beatUsesEmbed, getEmbedPlatform } from '@/lib/embed'

type Props = {
  beat: Beat
  autoPlay?: boolean
  playSession?: number
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function NativeBeatPlayer({ beat, autoPlay = false, playSession = 0 }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const analyserRef = useAudioAnalyser(audioRef, beat.id)
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
    const el = audioRef.current
    if (!el) return
    el.currentTime = 0
    void el.play().catch(() => undefined)
  }, [autoPlay, beat.id, playSession])

  function toggle() {
    const el = audioRef.current
    if (!el) return
    if (el.paused) void el.play()
    else el.pause()
  }

  if (!beat.audioUrl) {
    return <p className="text-sm text-white/40">No preview on this beat yet.</p>
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={beat.audioUrl}
        preload="metadata"
        crossOrigin="anonymous"
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

      <div className="overflow-hidden rounded-lg border border-white/10 px-3 py-3">
        <AudioVisualizer analyserRef={analyserRef} active={playing} height={88} barCount={44} />
      </div>

      <div className="mt-6 flex items-start gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
          className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-sky-brand text-sm font-bold text-navy-950 transition hover:bg-sky-light"
        >
          {playing ? '||' : '▶'}
        </button>
        <div className="min-w-0 flex-1">
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-sky-brand transition-[width] duration-100" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs tabular-nums text-white/35">
            <span>{formatTime(current)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </>
  )
}

function embedWatchLabel(url: string): string {
  const platform = getEmbedPlatform(url)
  if (platform === 'soundcloud') return 'Open on SoundCloud'
  if (platform === 'youtube') return 'Watch on YouTube'
  return 'Open preview'
}

export function BeatPlayer({ beat, autoPlay = false, playSession = 0 }: Props) {
  const hasNativePreview = Boolean(beat.audioUrl?.trim())
  const hasEmbed = beatUsesEmbed(beat) && Boolean(beat.embedUrl?.trim())
  const embedPlatform = hasEmbed ? getEmbedPlatform(beat.embedUrl) : 'none'

  return (
    <div className="ajx-panel p-6 sm:p-8">
      <p className="mb-5 ajx-label">{autoPlay ? 'Now playing' : 'Preview'}</p>
      <div className="flex items-center gap-4">
        <DiscCover src={beat.coverUrl} alt="" className="size-16 sm:size-20" />
        <div>
          <p className="text-lg font-semibold text-white">{beat.title}</p>
          <p className="mt-1 ajx-meta">
            {beat.bpm}bpm · {beat.key}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {hasNativePreview ? (
          <NativeBeatPlayer beat={beat} autoPlay={autoPlay} playSession={playSession} />
        ) : hasEmbed && beat.embedUrl ? (
          <EmbedPlayer
            url={beat.embedUrl}
            title={beat.title}
            autoPlay={autoPlay}
            playSession={playSession}
            largeVisual={embedPlatform === 'soundcloud'}
          />
        ) : (
          <p className="text-sm text-white/40">
            No preview uploaded. Add a YouTube or SoundCloud link, or upload an MP3 in admin.
          </p>
        )}

        {hasNativePreview && hasEmbed && beat.embedUrl ? (
          <a
            href={beat.embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ajx-link inline-flex text-sm font-medium no-underline hover:underline"
          >
            {embedWatchLabel(beat.embedUrl)}
          </a>
        ) : null}
      </div>
    </div>
  )
}
