import { GA_MEASUREMENT_ID as DEFAULT_GA_MEASUREMENT_ID } from '../config/site'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export const GA_MEASUREMENT_ID =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() || DEFAULT_GA_MEASUREMENT_ID

export function isAnalyticsEnabled(): boolean {
  return Boolean(GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX')
}

export function trackEvent(eventName: string, params: Record<string, string | undefined> = {}): void {
  if (!isAnalyticsEnabled() || typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}

export function ensureGtagLoaded(measurementId: string): void {
  if (typeof window === 'undefined' || typeof window.gtag === 'function') return

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { anonymize_ip: true })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)
}

export function bindConversionClickTracking(): void {
  if (typeof document === 'undefined') return

  document.addEventListener(
    'click',
    (event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest('a')
      if (!link) return
      const href = link.getAttribute('href') ?? ''
      const location = link.getAttribute('data-track-location') ?? 'unknown'
      if (href.startsWith('tel:')) trackEvent('phone_click', { link_location: location })
      if (href.includes('wa.me') || href.includes('api.whatsapp.com')) {
        trackEvent('whatsapp_click', { link_location: location })
      }
    },
    { capture: true },
  )
}
