'use client'
import { embedIframeSrc, getEmbedPlatform, isYoutubeShort, normalizeSoundCloudUrl } from '@/lib/embed'

type Props = {
  url: string
  title: string
  autoPlay?: boolean
  compact?: boolean
  /** Bumps iframe remount so autoplay starts after a user click. */
  playSession?: number
  /** Taller SoundCloud embed with built-in live waveform. */
  largeVisual?: boolean
}

export function EmbedPlayer({ url, title, autoPlay = false, compact = false, playSession = 0, largeVisual = false }: Props) {
  const src = embedIframeSrc(url, autoPlay)
  const platform = getEmbedPlatform(url)
  const isShort = platform === 'youtube' && isYoutubeShort(url)

  if (!src) {
    if (platform === 'soundcloud') {
      return (
        <a
          href={normalizeSoundCloudUrl(url)}
          target="_blank"
          rel="noopener noreferrer"
          className="ajx-link text-sm font-semibold no-underline hover:underline"
        >
          Listen on SoundCloud
        </a>
      )
    }

    return (
      <p className="text-sm text-white/40">
        Invalid embed link. Use a SoundCloud or YouTube URL.
      </p>
    )
  }

  const height =
    platform === 'soundcloud'
      ? largeVisual
        ? 280
        : compact
          ? 120
          : 166
      : compact
        ? 200
        : 315

  const iframe = (
    <iframe
      key={`${url}-${playSession}-${autoPlay ? 'play' : 'pause'}`}
      title={`${title} preview`}
      src={src}
      className={isShort ? 'aspect-[9/16] w-full border-0' : 'w-full border-0'}
      height={isShort ? undefined : height}
      allow={
        platform === 'soundcloud'
          ? 'autoplay'
          : 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      }
      loading={autoPlay ? 'eager' : 'lazy'}
    />
  )

  if (isShort) {
    return <div className="mx-auto w-full max-w-[280px] sm:max-w-[320px]">{iframe}</div>
  }

  return iframe
}
