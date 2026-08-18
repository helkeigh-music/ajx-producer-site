import { useLayoutEffect } from 'react'
import { resolvePageMeta, siteName } from '@/lib/resolvePageMeta'

function setMeta(name: string, content: string, property = false) {
  if (typeof document === 'undefined') return
  const attr = property ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

type PageSeoInput = {
  title: string
  description: string
  path?: string
  robots?: string
}

export function usePageSeo({ title, description, path = '/', robots }: PageSeoInput) {
  const resolved = resolvePageMeta(path)
  const ogImage = resolved.ogImage
  const fullUrl = resolved.canonicalUrl

  useLayoutEffect(() => {
    document.title = title
    setMeta('description', description)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:image', ogImage, true)
    setMeta('og:url', fullUrl, true)
    setMeta('og:type', 'website', true)
    setMeta('og:locale', 'en_GB', true)
    setMeta('og:site_name', siteName(), true)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', ogImage)

    if (robots) {
      setMeta('robots', robots)
    } else {
      setMeta('robots', 'index, follow')
    }

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', fullUrl)
  }, [title, description, fullUrl, ogImage, path, robots])
}
