export const BRAND = {
  name: 'prodbyajx',
  tagline: 'Manchester producer',
  location: 'Manchester, UK',
  profileImageUrl: '/profile.jpg',
  colors: {
    navy: '#0b1f3a',
    sky: '#38bdf8',
  },
} as const

import { publicEnv } from '@/lib/publicEnv'

/** GA4 web stream — set NEXT_PUBLIC_GA_MEASUREMENT_ID (or VITE_GA_MEASUREMENT_ID) after creating the property. */
export const GA_MEASUREMENT_ID = '' as const

const DEFAULT_CONTACT_PHONE = '07496 181211'

/** Display form or E.164 → `tel:` value with no spaces. */
function toCallTel(phone: string): string {
  const compact = phone.replace(/[^\d+]/g, '')
  if (compact.startsWith('+')) return compact
  if (compact.startsWith('0')) return `+44${compact.slice(1)}`
  if (compact.startsWith('44')) return `+${compact}`
  return '+447496181211'
}

const contactPhone = publicEnv('CONTACT_PHONE', DEFAULT_CONTACT_PHONE) || DEFAULT_CONTACT_PHONE

export const SITE = {
  title: 'Type Beats Manchester | Trap, Drill & R&B | prodbyajx',
  description: 'Trap, drill and R&B type beats. Studio sessions in Manchester.',
  url: publicEnv('SITE_URL', 'https://prodbyajx.com'),
  bookingUrl: '/book',
  email: publicEnv('CONTACT_EMAIL', 'prodbyajx@gmail.com') || 'prodbyajx@gmail.com',
  phone: contactPhone,
  phoneTel: toCallTel(contactPhone),
  social: {
    instagram: publicEnv('SOCIAL_INSTAGRAM', 'https://www.instagram.com/prodbyajx/'),
    youtube: publicEnv('SOCIAL_YOUTUBE', 'https://youtube.com/@prodbyajx'),
    soundcloud: publicEnv('SOCIAL_SOUNDCLOUD', 'https://soundcloud.com/user-335209347'),
    spotify: publicEnv('SOCIAL_SPOTIFY', ''),
    tiktok: publicEnv('SOCIAL_TIKTOK', ''),
  },
} as const

export type LicenseTier = 'basic' | 'premium' | 'exclusive'

export type LicenseTierInfo = {
  id: LicenseTier
  label: string
  summary: string
  includes: string[]
  priceGbp: number
}

/** Default tier prices shown on the beat store. */
export const DEFAULT_TIER_PRICES: Record<LicenseTier, number> = {
  basic: 29,
  premium: 69,
  exclusive: 249,
}

export const LICENSE_TIERS: LicenseTierInfo[] = [
  {
    id: 'basic',
    label: 'Basic',
    summary: 'Tagged MP3. Fine for demos and freestyles.',
    includes: ['Tagged MP3', '2k stream cap', 'Credit: prodbyajx', 'Non-exclusive'],
    priceGbp: DEFAULT_TIER_PRICES.basic,
  },
  {
    id: 'premium',
    label: 'Premium',
    summary: 'WAV + stems when you are actually releasing.',
    includes: ['WAV + stems', '50k stream cap', 'Non-exclusive', 'Mix-ready'],
    priceGbp: DEFAULT_TIER_PRICES.premium,
  },
  {
    id: 'exclusive',
    label: 'Exclusive',
    summary: 'Beat comes off the store. Yours outright.',
    includes: ['WAV + stems', 'Unlimited use', 'Exclusive rights', 'Removed from store'],
    priceGbp: DEFAULT_TIER_PRICES.exclusive,
  },
]

export type Beat = {
  id: string
  title: string
  bpm: number
  key: string
  priceGbp: number
  prices?: Partial<Record<LicenseTier, number>>
  tags: string[]
  /** SoundCloud or YouTube track URL — shown as embedded player when set. */
  embedUrl?: string
  /** Direct MP3 fallback when no embed URL. */
  audioUrl?: string
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
  embedUrl?: string
  description?: string
}

export function beatPriceForTier(beat: Beat, tier: LicenseTier): number {
  if (beat.prices?.[tier] != null) return beat.prices[tier]!
  if (tier === 'basic') return beat.priceGbp
  return DEFAULT_TIER_PRICES[tier]
}
