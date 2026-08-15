import type { StoredBeat } from './beatsStore'

export const SEED_BEATS: StoredBeat[] = [
  {
    id: 'midnight-drive',
    title: 'Midnight Drive',
    bpm: 142,
    key: 'F# min',
    priceGbp: 29,
    prices: { basic: 29, premium: 69, exclusive: 249 },
    tags: ['trap', 'dark'],
    audioUrl: '/beats/demo-beat.mp3',
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
    createdAt: '2026-02-20T12:00:00.000Z',
  },
]

export async function listBeats(): Promise<StoredBeat[]> {
  const { readCatalog } = await import('./beatsStore')
  const beats = await readCatalog()
  return beats.length ? beats : SEED_BEATS
}
