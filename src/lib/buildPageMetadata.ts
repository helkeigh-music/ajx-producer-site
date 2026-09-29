import type { Metadata } from 'next'
import { pageSeoForPath } from '@/config/pageSeo'
import { resolvePageMeta } from '@/lib/resolvePageMeta'

export function buildPageMetadata(path: string): Metadata {
  const seo = pageSeoForPath(path)
  const meta = resolvePageMeta(path)
  return {
    title: seo.title,
    description: seo.description,
    robots: seo.robots ?? 'index, follow',
    alternates: { canonical: meta.canonicalUrl },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: meta.canonicalUrl,
      type: 'website',
      locale: 'en_GB',
      siteName: 'prodbyajx',
      images: [{ url: meta.ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [meta.ogImage],
    },
  }
}
