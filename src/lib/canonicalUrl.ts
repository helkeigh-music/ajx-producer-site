import { SITE } from '@/config/site'

/** Normalised path: no trailing slash except root. */
export function normalizeSitePath(path: string): string {
  if (!path || path === '/') return '/'
  const p = path.startsWith('/') ? path : `/${path}`
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1)
  return p
}

/** Absolute canonical URL for canonical link, og:url, sitemap, and JSON-LD. */
export function getCanonicalUrl(path: string): string {
  const base = SITE.url.replace(/\/$/, '')
  const canonicalPath = normalizeSitePath(path)
  return canonicalPath === '/' ? `${base}/` : `${base}${canonicalPath}`
}
