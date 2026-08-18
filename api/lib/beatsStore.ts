import { list, put } from '@vercel/blob'

export type LicenseTier = 'basic' | 'premium' | 'exclusive'

export type StoredBeat = {
  id: string
  title: string
  bpm: number
  key: string
  priceGbp: number
  prices?: Partial<Record<LicenseTier, number>>
  tags: string[]
  embedUrl?: string
  audioUrl?: string
  coverUrl?: string
  featured?: boolean
  leaseFiles?: Partial<Record<LicenseTier, string>>
  createdAt: string
}

const CATALOG_PATH = 'ajx/beats-catalog.json'

export async function readCatalog(): Promise<StoredBeat[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return []

  try {
    const blobs = await list({ prefix: 'ajx/', limit: 100 })
    const catalogBlob = blobs.blobs.find((b) => b.pathname === CATALOG_PATH)
    if (!catalogBlob) return []

    const res = await fetch(catalogBlob.url)
    if (!res.ok) return []
    const data = (await res.json()) as { beats: StoredBeat[] }
    return Array.isArray(data.beats) ? data.beats : []
  } catch {
    return []
  }
}

export async function writeCatalog(beats: StoredBeat[]): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN not configured')
  }

  await put(CATALOG_PATH, JSON.stringify({ beats }, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  })
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

export function verifyAdminPassword(password: string | null | undefined): boolean {
  const expected = process.env.ADMIN_PASSWORD?.trim()
  if (!expected) return false
  return password === expected
}

export function priceForTier(beat: StoredBeat, tier: LicenseTier): number {
  if (beat.prices?.[tier] != null) return beat.prices[tier]!
  if (tier === 'basic') return beat.priceGbp
  const defaults = { basic: 29, premium: 69, exclusive: 249 } as const
  return defaults[tier]
}

export function leaseUrlForTier(beat: StoredBeat, tier: LicenseTier): string | null {
  return beat.leaseFiles?.[tier] ?? beat.leaseFiles?.basic ?? beat.audioUrl ?? null
}

export async function removeBeatFromCatalog(beatId: string): Promise<void> {
  const beats = await readCatalog()
  await writeCatalog(beats.filter((beat) => beat.id !== beatId))
}
