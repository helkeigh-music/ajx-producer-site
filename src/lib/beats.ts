import type { Beat, PortfolioItem } from '@/config/site'

/** Seed beats — replaced/extended via admin uploads in production. */
export const SEED_BEATS: Beat[] = [
  {
    id: 'midnight-drive',
    title: 'Midnight Drive',
    bpm: 142,
    key: 'F# min',
    priceGbp: 29,
    prices: { basic: 29, premium: 69, exclusive: 249 },
    tags: ['trap', 'dark'],
    audioUrl: '/beats/demo-beat.mp3',
    coverUrl: '/portfolio/midnight-drive.svg',
    featured: true,
    createdAt: '2026-01-15T12:00:00.000Z',
  },
  {
    id: 'skyline',
    title: 'Skyline',
    bpm: 98,
    key: 'D maj',
    priceGbp: 25,
    prices: { basic: 25, premium: 59, exclusive: 199 },
    tags: ['rnb', 'chill'],
    audioUrl: '/beats/demo-beat.mp3',
    coverUrl: '/portfolio/skyline.svg',
    createdAt: '2026-02-01T12:00:00.000Z',
  },
  {
    id: 'cold-front',
    title: 'Cold Front',
    bpm: 128,
    key: 'A min',
    priceGbp: 35,
    prices: { basic: 35, premium: 79, exclusive: 299 },
    tags: ['drill', 'cinematic'],
    audioUrl: '/beats/demo-beat.mp3',
    coverUrl: '/portfolio/cold-front.svg',
    createdAt: '2026-02-20T12:00:00.000Z',
  },
]

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'Night Shift',
    artist: 'Kairo',
    year: '2025',
    role: 'Production · mix',
    link: 'https://open.spotify.com/track/example-night-shift',
    coverUrl: '/portfolio/night-shift.svg',
    audioUrl: '/beats/demo-beat.mp3',
    description: 'Dark trap single — 142 BPM, minimal hook, heavy low end.',
  },
  {
    id: 'p2',
    title: 'Blue Hour EP',
    artist: 'Maya Sol',
    year: '2025',
    role: 'Production · stems',
    link: 'https://open.spotify.com/album/example-blue-hour',
    coverUrl: '/portfolio/blue-hour.svg',
    description: 'Four-track R&B EP with live keys and tape-saturated drums.',
  },
  {
    id: 'p3',
    title: 'Pressure',
    artist: 'VON & LUX',
    year: '2024',
    role: 'Beat · arrangement',
    link: 'https://open.spotify.com/track/example-pressure',
    coverUrl: '/portfolio/pressure.svg',
    audioUrl: '/beats/demo-beat.mp3',
    description: 'Drill-influenced club record with switch-ups and ad-libs.',
  },
  {
    id: 'p4',
    title: 'Afterglow',
    artist: 'Siena',
    year: '2024',
    role: 'Mix · master',
    coverUrl: '/portfolio/afterglow.svg',
    description: 'Atmospheric vocal record — wide reverbs, tight low end.',
  },
]

export async function fetchBeats(): Promise<Beat[]> {
  try {
    const res = await fetch('/api/beats')
    if (!res.ok) throw new Error('API unavailable')
    const data = (await res.json()) as { beats: Beat[] }
    return data.beats.length ? data.beats : SEED_BEATS
  } catch {
    return SEED_BEATS
  }
}

export async function createCheckout(
  beatId: string,
  licenseTier: string,
): Promise<{ url: string } | { error: string }> {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ beatId, licenseTier }),
  })
  const data = (await res.json()) as { url?: string; error?: string }
  if (!res.ok || !data.url) return { error: data.error ?? 'Checkout failed' }
  return { url: data.url }
}
