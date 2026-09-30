import type { StoredBeat } from './beatsStore'

const TIER_PRICES = {
  basic: 29,
  premium: 69,
  exclusive: 249,
} as const

const FOR_YOU_SOUNDCLOUD =
  'https://soundcloud.com/user-335209347/free-for-non-profit-real-rap'

export const SEED_BEATS: StoredBeat[] = [
  {
    id: 'never-love',
    title: 'Never Love',
    bpm: 140,
    key: 'C min',
    priceGbp: TIER_PRICES.basic,
    prices: { ...TIER_PRICES },
    tags: ['rap', 'vocal sample'],
    embedUrl: 'https://www.youtube.com/watch?v=cFtgcscq3nw',
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
    createdAt: '2026-04-22T12:00:00.000Z',
  },
  {
    id: 'jersey-club-sha-gz',
    title: 'Jersey Club — Sha Gz x Dee Billz',
    bpm: 145,
    key: 'A min',
    priceGbp: TIER_PRICES.basic,
    prices: { ...TIER_PRICES },
    tags: ['jersey club'],
    embedUrl: 'https://www.youtube.com/watch?v=Dm-Ot0V9uac',
    createdAt: '2026-08-14T12:00:00.000Z',
  },
]

export async function listBeats(): Promise<StoredBeat[]> {
  const { readCatalog } = await import('./beatsStore')
  const beats = await readCatalog()
  return beats.length ? beats : SEED_BEATS
}
