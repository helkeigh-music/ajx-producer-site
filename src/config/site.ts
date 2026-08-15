export const BRAND = {
  name: 'AJX',
  tagline: 'Producer',
  colors: {
    navy: '#0b1f3a',
    sky: '#38bdf8',
  },
  logoUrl: '/logo.svg',
} as const

export const SITE = {
  title: 'AJX | Producer',
  description: 'UK beats, production, and sessions. Trap, R&B, and dark textures — navy and sky.',
  url: import.meta.env.VITE_SITE_URL ?? 'https://ajx-producer.vercel.app',
  bookingUrl: import.meta.env.VITE_BOOKING_URL ?? 'https://cal.com/ajx/sessions',
  email: import.meta.env.VITE_CONTACT_EMAIL ?? 'hello@ajxbeats.com',
  social: {
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM ?? 'https://instagram.com/ajxproducer',
    youtube: import.meta.env.VITE_SOCIAL_YOUTUBE ?? 'https://youtube.com/@ajxproducer',
    spotify: import.meta.env.VITE_SOCIAL_SPOTIFY ?? 'https://open.spotify.com/artist/ajx',
    tiktok: import.meta.env.VITE_SOCIAL_TIKTOK ?? 'https://tiktok.com/@ajxproducer',
  },
} as const

export type LicenseTier = 'basic' | 'premium' | 'exclusive'

export type LicenseTierInfo = {
  id: LicenseTier
  label: string
  summary: string
  includes: string[]
}

export const LICENSE_TIERS: LicenseTierInfo[] = [
  {
    id: 'basic',
    label: 'Basic lease',
    summary: 'MP3 lease for independent releases.',
    includes: ['Tagged MP3', '2,000 stream cap', 'Credit required', 'Non-exclusive'],
  },
  {
    id: 'premium',
    label: 'Premium lease',
    summary: 'WAV + stems for serious releases.',
    includes: ['Untagged WAV', 'Stems pack', '50,000 stream cap', 'Non-exclusive'],
  },
  {
    id: 'exclusive',
    label: 'Exclusive',
    summary: 'Full buyout — beat removed from store.',
    includes: ['WAV + stems', 'Unlimited use', 'Exclusive rights', 'Removed from sale'],
  },
]

export type Beat = {
  id: string
  title: string
  bpm: number
  key: string
  /** Base price for basic tier; premium/exclusive use prices map or multipliers. */
  priceGbp: number
  prices?: Partial<Record<LicenseTier, number>>
  tags: string[]
  audioUrl: string
  coverUrl?: string
  featured?: boolean
  createdAt: string
}

export type PortfolioItem = {
  id: string
  title: string
  artist: string
  year: string
  role: string
  link?: string
  coverUrl?: string
  audioUrl?: string
  description?: string
}

export function beatPriceForTier(beat: Beat, tier: LicenseTier): number {
  if (beat.prices?.[tier] != null) return beat.prices[tier]!
  if (tier === 'basic') return beat.priceGbp
  if (tier === 'premium') return Math.round(beat.priceGbp * 2.5)
  return Math.round(beat.priceGbp * 8)
}
