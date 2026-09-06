import { useEffect } from 'react'
import {
  GA_MEASUREMENT_ID,
  bindConversionClickTracking,
  ensureGtagLoaded,
  isAnalyticsEnabled,
} from '@/lib/analytics'

export function GoogleAnalytics() {
  useEffect(() => {
    bindConversionClickTracking()
    if (!isAnalyticsEnabled() || !GA_MEASUREMENT_ID) return
    ensureGtagLoaded(GA_MEASUREMENT_ID)
  }, [])

  return null
}
