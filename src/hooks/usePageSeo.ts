import { useLayoutEffect } from 'react'
import { BRAND } from '@/config/site'

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
  useLayoutEffect(() => {
    document.title = title
    setMeta('description', description)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:type', 'website', true)
    setMeta('og:locale', 'en_GB', true)
    setMeta('og:site_name', BRAND.name, true)

    if (robots) {
      setMeta('robots', robots)
    } else {
      document.querySelector('meta[name="robots"]')?.remove()
    }
  }, [title, description, path, robots])
}
