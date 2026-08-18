import { BRAND, SITE } from '@/config/site'
import { getCanonicalUrl } from '@/lib/canonicalUrl'
import { DEFAULT_OG_IMAGE } from '@/lib/resolvePageMeta'

export function homeJsonLd() {
  const url = getCanonicalUrl('/')
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        url,
        name: BRAND.name,
        description: SITE.description,
        inLanguage: 'en-GB',
      },
      {
        '@type': 'Person',
        '@id': `${url}#person`,
        name: BRAND.name,
        url,
        image: DEFAULT_OG_IMAGE,
        jobTitle: 'Music Producer',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Manchester',
          addressCountry: 'GB',
        },
        sameAs: [SITE.social.instagram, SITE.social.youtube, SITE.social.soundcloud].filter(Boolean),
      },
    ],
  }
}

export function breadcrumbJsonLd(path: string) {
  const segments: { name: string; path: string }[] = [{ name: 'Home', path: '/' }]

  if (path === '/beats') segments.push({ name: 'Beat store', path: '/beats' })
  if (path === '/portfolio') segments.push({ name: 'Portfolio', path: '/portfolio' })
  if (path === '/book') segments.push({ name: 'Book', path: '/book' })

  if (segments.length <= 1) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: segments.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  }
}
