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

export const SITE = {
  title: 'Type Beats Manchester | Trap, Drill & R&B | prodbyajx',
  description: 'Trap, drill and R&B type beats. Studio sessions in Manchester.',
  url: import.meta.env.VITE_SITE_URL ?? 'https://ajx-producer-site.vercel.app',
  bookingUrl: '/book',
  email: 'prodbyajx@gmail.com',
  phone: import.meta.env.VITE_CONTACT_PHONE ?? '+44 7496 181211',
  phoneTel: import.meta.env.VITE_CONTACT_PHONE?.replace(/\s/g, '') ?? '+447496181211',
  social: {
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM ?? 'https://www.instagram.com/prodbyajx/',
    youtube: import.meta.env.VITE_SOCIAL_YOUTUBE ?? 'https://youtube.com/@prodbyajx',
    soundcloud: import.meta.env.VITE_SOCIAL_SOUNDCLOUD ?? 'https://soundcloud.com/user-335209347',
    spotify: import.meta.env.VITE_SOCIAL_SPOTIFY ?? '',
    tiktok: import.meta.env.VITE_SOCIAL_TIKTOK ?? '',
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

/** Default tier prices used across the store and checkout. */
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
