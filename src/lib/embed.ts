export type EmbedPlatform = 'soundcloud' | 'youtube' | 'none'

export function getEmbedPlatform(url: string | undefined): EmbedPlatform {
  if (!url?.trim()) return 'none'
  if (/soundcloud\.com/i.test(url)) return 'soundcloud'
  if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube'
  return 'none'
}

export function isYoutubeShort(url: string | undefined): boolean {
  if (!url?.trim()) return false
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean)
    return parts[0] === 'shorts' && Boolean(parts[1])
  } catch {
    return /youtube\.com\/shorts\//i.test(url)
  }
}

export function youtubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1).split('/')[0] || null
    if (parsed.searchParams.get('v')) return parsed.searchParams.get('v')
    const parts = parsed.pathname.split('/').filter(Boolean)
    const embedIndex = parts.indexOf('embed')
    if (embedIndex >= 0 && parts[embedIndex + 1]) return parts[embedIndex + 1]
    if (parts[0] === 'shorts' && parts[1]) return parts[1]
  } catch {
    return null
  }
  return null
}

export function youtubeChannelUploadsEmbed(channelId: string): string {
  const uploadsId = channelId.startsWith('UC') ? `UU${channelId.slice(2)}` : channelId
  return `https://www.youtube.com/embed/videoseries?list=${uploadsId}&rel=0&modestbranding=1`
}

function youtubeChannelIdFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    const parts = parsed.pathname.split('/').filter(Boolean)
    const channelIndex = parts.indexOf('channel')
    if (channelIndex >= 0 && parts[channelIndex + 1]?.startsWith('UC')) {
      return parts[channelIndex + 1]
    }
  } catch {
    return null
  }
  return null
}

function youtubeHandleFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    const parts = parsed.pathname.split('/').filter(Boolean)
    if (parts[0]?.startsWith('@')) return parts[0]
  } catch {
    return null
  }
  return null
}

export function normalizeSoundCloudUrl(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString().replace(/\/$/, '')
  } catch {
    return url.split('?')[0]?.split('#')[0] ?? url
  }
}

export function isSoundCloudEmbeddable(url: string): boolean {
  try {
    const parts = new URL(normalizeSoundCloudUrl(url)).pathname.split('/').filter(Boolean)
    return parts.length >= 2
  } catch {
    return false
  }
}

export function soundcloudEmbedSrc(trackUrl: string, autoPlay = false): string {
  const params = new URLSearchParams({
    url: normalizeSoundCloudUrl(trackUrl),
    color: '#38bdf8',
    auto_play: autoPlay ? 'true' : 'false',
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'true',
    show_reposts: 'false',
    visual: 'true',
  })
  return `https://w.soundcloud.com/player/?${params.toString()}`
}

export function youtubeEmbedSrc(
  url: string,
  autoPlay = false,
  channelIdFallback = 'UC0r0CsF1dUUtw61V-a_FL3w',
): string | null {
  const videoId = youtubeVideoId(url)
  if (videoId && !videoId.startsWith('@') && videoId.length === 11) {
    const params = new URLSearchParams({ rel: '0', modestbranding: '1' })
    if (autoPlay) params.set('autoplay', '1')
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  }

  const channelId = youtubeChannelIdFromUrl(url)
  if (channelId) return youtubeChannelUploadsEmbed(channelId)

  if (youtubeHandleFromUrl(url) || /youtube\.com\/@/i.test(url)) {
    return youtubeChannelUploadsEmbed(channelIdFallback)
  }

  return null
}

export function embedIframeSrc(
  url: string | undefined,
  autoPlay = false,
  youtubeChannelId = 'UC0r0CsF1dUUtw61V-a_FL3w',
): string | null {
  const platform = getEmbedPlatform(url)
  if (!url || platform === 'none') return null
  if (platform === 'soundcloud') {
    if (!isSoundCloudEmbeddable(url)) return null
    return soundcloudEmbedSrc(url, autoPlay)
  }
  return youtubeEmbedSrc(url, autoPlay, youtubeChannelId)
}

export function beatPreviewUrl(beat: { embedUrl?: string; audioUrl?: string }): string | undefined {
  return beat.embedUrl?.trim() || beat.audioUrl?.trim() || undefined
}

export function beatUsesEmbed(beat: { embedUrl?: string }): boolean {
  return getEmbedPlatform(beat.embedUrl) !== 'none'
}
