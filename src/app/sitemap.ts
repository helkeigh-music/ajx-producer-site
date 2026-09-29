import type { MetadataRoute } from 'next'
import { INDEXABLE_PATHS } from '@/lib/resolvePageMeta'
import { getCanonicalUrl } from '@/lib/canonicalUrl'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return INDEXABLE_PATHS.map((path) => ({
    url: getCanonicalUrl(path),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : path === '/beats' ? 0.95 : 0.85,
  }))
}
