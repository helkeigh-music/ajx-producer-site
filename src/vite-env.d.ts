/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string
  readonly VITE_BOOKING_URL: string
  readonly VITE_CONTACT_EMAIL: string
  readonly VITE_SOCIAL_INSTAGRAM: string
  readonly VITE_SOCIAL_YOUTUBE: string
  readonly VITE_SOCIAL_SPOTIFY: string
  readonly VITE_SOCIAL_TIKTOK: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
