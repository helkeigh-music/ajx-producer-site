import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PRERENDER_PATHS } from './paths.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')
const dist = join(root, 'dist')

const SITE_URL = (process.env.VITE_SITE_URL ?? 'https://ajx-producer-site.vercel.app').replace(/\/$/, '')

/** Mirrors src/config/pageSeo.ts — keep in sync for build scripts. */
const PAGE_SEO = {
  '/': {
    title: 'Type Beats Manchester | Trap, Drill & R&B | prodbyajx',
    description:
      'Manchester producer prodbyajx. Lease trap, drill and R&B type beats online. Studio sessions for custom beats, recording, mix and master.',
  },
  '/beats': {
    title: 'Beat Store | Trap, Drill & R&B Type Beats | prodbyajx',
    description:
      'Lease trap, drill and R&B type beats from Manchester. Preview free, checkout online, download link by email. Basic, premium and exclusive licenses.',
  },
  '/portfolio': {
    title: 'Production & Type Beats | prodbyajx Manchester',
    description:
      'Type beats, sample flips and studio work from prodbyajx. UK rap, trap and drill production based in Manchester.',
  },
  '/book': {
    title: 'Book Studio Time Manchester | prodbyajx',
    description:
      'Book a 2-hour studio session in Manchester. Custom beats, recording, mix and master. Free to book. Confirmation by email.',
  },
  '/404': {
    title: 'Page not found | prodbyajx',
    description: 'The page you requested could not be found.',
    h1: 'Page not found',
    robots: 'noindex, nofollow',
  },
}

const DEFAULT_OG_IMAGE = `${SITE_URL}/profile.jpg`

function normalizeSitePath(path) {
  if (!path || path === '/') return '/'
  const p = path.startsWith('/') ? path : `/${path}`
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1)
  return p
}

function getCanonicalUrl(path) {
  const canonicalPath = normalizeSitePath(path)
  return canonicalPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${canonicalPath}`
}

function resolvePageMeta(path) {
  const normalized = normalizeSitePath(path)
  const seo = PAGE_SEO[normalized] ?? PAGE_SEO['/404']
  const canonicalUrl = getCanonicalUrl(normalized)
  return { ...seo, canonicalUrl, ogImage: DEFAULT_OG_IMAGE }
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function injectMeta(html, path, options = {}) {
  const m = resolvePageMeta(path)
  const title = escapeHtml(m.title)
  const desc = escapeHtml(m.description)
  const ogImg = escapeHtml(m.ogImage)
  const ogU = escapeHtml(m.canonicalUrl)
  const isNotFound = path === '/404'

  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
  out = out.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${desc}" />`)
  out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${title}" />`)
  out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${desc}" />`)
  if (!isNotFound) {
    out = out.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${ogU}" />`)
  }
  out = out.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${ogImg}" />`)
  out = out.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${title}" />`)
  out = out.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${desc}" />`)
  out = out.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${ogImg}" />`)

  if (isNotFound) {
    out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>\s*/i, '')
  } else {
    out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${ogU}" />`)
  }

  if (m.robots) {
    if (/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/.test(out)) {
      out = out.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/, `<meta name="robots" content="${escapeHtml(m.robots)}" />`)
    } else {
      out = out.replace(/<\/head>/i, `    <meta name="robots" content="${escapeHtml(m.robots)}" />\n  </head>`)
    }
    if (/<meta\s+name="googlebot"\s+content="[^"]*"\s*\/?>/.test(out)) {
      out = out.replace(/<meta\s+name="googlebot"\s+content="[^"]*"\s*\/?>/, `<meta name="googlebot" content="${escapeHtml(m.robots)}" />`)
    }
  } else {
    out = out.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/, `<meta name="robots" content="index, follow" />`)
  }

  if (options.rootHtml) {
    out = out.replace('<div id="root"></div>', `<div id="root">${options.rootHtml}</div>`)
  }

  return out
}

function notFoundFallbackHtml() {
  const seo = PAGE_SEO['/404']
  const title = escapeHtml(seo.h1)
  const desc = escapeHtml(seo.description)
  return `<div class="ajx-container py-16 sm:py-24"><header class="max-w-2xl pb-10 sm:pb-12"><h1 class="page-h1">${title}</h1><p class="hero-sub mt-3 max-w-xl sm:mt-4">${desc}</p></header><a href="/" class="ajx-link mt-8 inline-block text-sm font-medium">Back to home</a></div>`
}

function distDirForRoute(routePath) {
  if (routePath === '/') return dist
  return join(dist, routePath.slice(1))
}

async function main() {
  const template = await readFile(join(dist, 'index.html'), 'utf8')

  for (const path of PRERENDER_PATHS) {
    const html = injectMeta(template, path)
    if (path === '/') {
      await writeFile(join(dist, 'index.html'), html, 'utf8')
      console.log('Injected meta for /')
    } else {
      const dir = distDirForRoute(path)
      await mkdir(dir, { recursive: true })
      await writeFile(join(dir, 'index.html'), html, 'utf8')
      console.log('Injected meta for', path)
    }
  }

  const notFoundHtml = injectMeta(template, '/404', { rootHtml: notFoundFallbackHtml() })
  await writeFile(join(dist, '404.html'), notFoundHtml, 'utf8')
  console.log('Injected meta for 404.html')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
