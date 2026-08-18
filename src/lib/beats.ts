import type { Beat, PortfolioItem } from '@/config/site'
import { DEFAULT_TIER_PRICES } from '@/config/site'
import { DEFAULT_DISC_COVER } from '@/lib/covers'

const TIER_PRICES = DEFAULT_TIER_PRICES

const FOR_YOU_SOUNDCLOUD =
  'https://soundcloud.com/user-335209347/free-for-non-profit-real-rap'

const SAX_SAMPLE_FLIP_SHORT = 'https://www.youtube.com/shorts/rvj6Z-SdMBU'

export { SAX_SAMPLE_FLIP_SHORT }

/** Seed beats — real AJX type beats from YouTube / SoundCloud. Updated via admin uploads in production. */
export const SEED_BEATS: Beat[] = [
  {
    id: 'never-love',
    title: 'Never Love',
    bpm: 140,
    key: 'C min',
    priceGbp: TIER_PRICES.basic,
    prices: { ...TIER_PRICES },
    tags: ['rap', 'vocal sample'],
    embedUrl: 'https://www.youtube.com/watch?v=cFtgcscq3nw',
    coverUrl: DEFAULT_DISC_COVER,
    featured: true,
    createdAt: '2026-08-01T12:00:00.000Z',
  },
  {
    id: 'no-way-back',
    title: 'No Way Back',
    bpm: 142,
    key: 'F# min',
    priceGbp: TIER_PRICES.basic,
    prices: { ...TIER_PRICES },
    tags: ['uk rap', 'pain'],
    embedUrl: 'https://www.youtube.com/watch?v=X52qKHrDIvQ',
    coverUrl: DEFAULT_DISC_COVER,
    featured: true,
    createdAt: '2026-07-20T12:00:00.000Z',
  },
  {
    id: 'for-you',
    title: 'For You',
    bpm: 98,
    key: 'D maj',
    priceGbp: TIER_PRICES.basic,
    prices: { ...TIER_PRICES },
    tags: ['marnz malone', 'kaymuni'],
    embedUrl: FOR_YOU_SOUNDCLOUD,
    coverUrl: DEFAULT_DISC_COVER,
    featured: true,
    createdAt: '2026-07-10T12:00:00.000Z',
  },
  {
    id: 'workload',
    title: 'Workload',
    bpm: 128,
    key: 'A min',
    priceGbp: TIER_PRICES.basic,
    prices: { ...TIER_PRICES },
    tags: ['uk detroit', 'hiltz'],
    embedUrl: 'https://www.youtube.com/watch?v=r8Wmcga_Jzg',
    coverUrl: DEFAULT_DISC_COVER,
    createdAt: '2026-06-15T12:00:00.000Z',
  },
  {
    id: 'late-nights',
    title: 'Late Nights',
    bpm: 135,
    key: 'G min',
    priceGbp: TIER_PRICES.basic,
    prices: { ...TIER_PRICES },
    tags: ['dave', 'potter payper'],
    embedUrl: 'https://www.youtube.com/watch?v=voVpu6KdaSM',
    coverUrl: DEFAULT_DISC_COVER,
    createdAt: '2026-05-28T12:00:00.000Z',
  },
  {
    id: 'whippin',
    title: 'Whippin',
    bpm: 130,
    key: 'E min',
    priceGbp: TIER_PRICES.basic,
    prices: { ...TIER_PRICES },
    tags: ['uk', 'detroit'],
    embedUrl: 'https://www.youtube.com/watch?v=J2Ih_z8SJ8E',
    coverUrl: DEFAULT_DISC_COVER,
    createdAt: '2026-05-10T12:00:00.000Z',
  },
  {
    id: 'bouncing',
    title: 'Bouncing',
    bpm: 118,
    key: 'D min',
    priceGbp: TIER_PRICES.basic,
    prices: { ...TIER_PRICES },
    tags: ['detroit', 'soul sample'],
    embedUrl: 'https://www.youtube.com/watch?v=D9v3M501U3A',
    coverUrl: DEFAULT_DISC_COVER,
    createdAt: '2026-04-22T12:00:00.000Z',
  },
  {
    id: 'jersey-club-sha-gz',
    title: 'Jersey Club (Sha Gz x Dee Billz)',
    bpm: 145,
    key: 'A min',
    priceGbp: TIER_PRICES.basic,
    prices: { ...TIER_PRICES },
    tags: ['jersey club'],
    embedUrl: 'https://www.youtube.com/watch?v=Dm-Ot0V9uac',
    coverUrl: DEFAULT_DISC_COVER,
    createdAt: '2026-08-14T12:00:00.000Z',
  },
]

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p-bts-sax-flip',
    title: 'Sax Sample Flip',
    artist: 'prodbyajx · behind the scenes',
    year: '2026',
    role: 'Sax · production · sample flip',
    link: SAX_SAMPLE_FLIP_SHORT,
    coverUrl: DEFAULT_DISC_COVER,
    embedUrl: SAX_SAMPLE_FLIP_SHORT,
    description:
      'Playing sax over a reel sample, chopping it, flipping it, and building a full track from scratch.',
  },
  {
    id: 'p1',
    title: 'For You',
    artist: 'Marnz Malone x Kaymuni type beat',
    year: '2026',
    role: 'Production',
    link: FOR_YOU_SOUNDCLOUD,
    coverUrl: DEFAULT_DISC_COVER,
    embedUrl: FOR_YOU_SOUNDCLOUD,
    description: 'Melodic type beat in the Marnz Malone x Kaymuni lane.',
  },
  {
    id: 'p2',
    title: 'Late Nights',
    artist: 'Dave x Potter Payper type beat',
    year: '2026',
    role: 'Production',
    link: 'https://www.youtube.com/watch?v=voVpu6KdaSM',
    coverUrl: DEFAULT_DISC_COVER,
    embedUrl: 'https://www.youtube.com/watch?v=voVpu6KdaSM',
    description: 'UK rap instrumental in the Dave x Potter Payper lane.',
  },
  {
    id: 'p3',
    title: 'No Way Back',
    artist: 'UK Rap Pain type beat',
    year: '2026',
    role: 'Production',
    link: 'https://www.youtube.com/watch?v=X52qKHrDIvQ',
    coverUrl: DEFAULT_DISC_COVER,
    embedUrl: 'https://www.youtube.com/watch?v=X52qKHrDIvQ',
    description: 'Pain type beat for real rap.',
  },
  {
    id: 'p4',
    title: 'Never Love',
    artist: 'prodbyajx x RAP vocal sample type beat',
    year: '2026',
    role: 'Production · sample',
    link: 'https://www.youtube.com/watch?v=cFtgcscq3nw',
    coverUrl: DEFAULT_DISC_COVER,
    embedUrl: 'https://www.youtube.com/watch?v=cFtgcscq3nw',
    description: 'Vocal sample flip with hard drums, ready for rap.',
  },
  {
    id: 'p5',
    title: 'Workload',
    artist: 'Hiltz x 025kas type beat',
    year: '2026',
    role: 'Production',
    link: 'https://www.youtube.com/watch?v=r8Wmcga_Jzg',
    coverUrl: DEFAULT_DISC_COVER,
    embedUrl: 'https://www.youtube.com/watch?v=r8Wmcga_Jzg',
    description: 'UK Detroit beat with Hiltz x 025kas energy.',
  },
  {
    id: 'p6',
    title: 'Whippin',
    artist: 'Hiltz x Kenzo type beat',
    year: '2026',
    role: 'Production',
    link: 'https://www.youtube.com/watch?v=J2Ih_z8SJ8E',
    coverUrl: DEFAULT_DISC_COVER,
    embedUrl: 'https://www.youtube.com/watch?v=J2Ih_z8SJ8E',
    description: 'UK and Detroit crossover instrumental.',
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
