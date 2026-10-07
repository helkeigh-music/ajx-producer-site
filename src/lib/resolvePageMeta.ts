import { BRAND, SITE } from '@/config/site'
import { PAGE_SEO, pageSeoForPath } from '@/config/pageSeo'
import { getCanonicalUrl } from '@/lib/canonicalUrl'

export const DEFAULT_OG_IMAGE = `${SITE.url.replace(/\/$/, '')}/profile.jpg`

export type ResolvedPageMeta = {
  title: string
  description: string
  path: string
  canonicalUrl: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogUrl: string
  twitterTitle: string
  twitterDescription: string
  robots?: string
}

export function resolvePageMeta(path: string): ResolvedPageMeta {
  const normalized = path === '/' ? '/' : path.replace(/\/$/, '') || '/'
  const seo = PAGE_SEO[normalized] ? pageSeoForPath(normalized) : pageSeoForPath('/404')
  const canonicalUrl = getCanonicalUrl(normalized)

  return {
    title: seo.title,
    description: seo.description,
    path: normalized,
    canonicalUrl,
    ogTitle: seo.title,
    ogDescription: seo.description,
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: canonicalUrl,
    twitterTitle: seo.title,
    twitterDescription: seo.description,
    robots: seo.robots,
  }
}

export const INDEXABLE_PATHS = ['/', '/beats', '/portfolio', '/book', '/privacy-policy'] as const

export function isIndexablePath(path: string): boolean {
  const normalized = path === '/' ? '/' : path.replace(/\/$/, '') || '/'
  return (INDEXABLE_PATHS as readonly string[]).includes(normalized)
}

export function siteName(): string {
  return BRAND.name
}
