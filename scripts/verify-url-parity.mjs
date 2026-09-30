/**
 * Fails if any previously indexable public path is missing from the Next app
 * route tree or from the generated sitemap sources.
 *
 * Indexable paths come from scripts/paths.mjs (same list as the Vite sitemap).
 * Also checks required API route files and non-indexable app pages that must
 * keep the same public URL.
 */
import { access, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PRERENDER_PATHS } from './paths.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')

/** Public URL path → expected App Router file under src/app */
const PAGE_ROUTE_FILES = {
  '/': 'src/app/page.tsx',
  '/beats': 'src/app/beats/page.tsx',
  '/portfolio': 'src/app/portfolio/page.tsx',
  '/book': 'src/app/book/page.tsx',
  '/admin': 'src/app/admin/page.tsx',
}

const API_ROUTE_FILES = [
  'src/app/api/beats/route.ts',
  'src/app/api/checkout/route.ts',
  'src/app/api/booking/route.ts',
  'src/app/api/webhook/stripe/route.ts',
  'src/app/api/admin/beats/route.ts',
]

/** Legacy Vite serverless handlers — kept under legacy-api/ (not deployed as /api) */
const LEGACY_API_FILES = [
  'legacy-api/beats.ts',
  'legacy-api/checkout.ts',
  'legacy-api/booking.ts',
  'legacy-api/webhook/stripe.ts',
  'legacy-api/admin/beats.ts',
]

const REQUIRED_EXTRA_APP_FILES = ['src/app/not-found.tsx', 'src/app/layout.tsx', 'src/app/sitemap.ts']

async function exists(relPath) {
  try {
    await access(join(root, relPath))
    return true
  } catch {
    return false
  }
}

const missing = []
const notes = []

for (const path of PRERENDER_PATHS) {
  const file = PAGE_ROUTE_FILES[path]
  if (!file) {
    missing.push(`No PAGE_ROUTE_FILES mapping for indexable path ${path}`)
    continue
  }
  if (!(await exists(file))) missing.push(`Missing Next page for ${path} → ${file}`)
}

for (const [path, file] of Object.entries(PAGE_ROUTE_FILES)) {
  if (!PRERENDER_PATHS.includes(path) && path !== '/admin') continue
  if (path === '/admin' && !(await exists(file))) {
    missing.push(`Missing Next page for ${path} → ${file}`)
  }
}

for (const file of API_ROUTE_FILES) {
  if (!(await exists(file))) missing.push(`Missing Next API route → ${file}`)
}

for (const file of LEGACY_API_FILES) {
  if (!(await exists(file))) {
    missing.push(`Legacy Vite API removed before cutover → ${file}`)
  }
}

for (const file of REQUIRED_EXTRA_APP_FILES) {
  if (!(await exists(file))) missing.push(`Missing required app file → ${file}`)
}

// Sitemap: prefer app/sitemap.ts exporting the indexable paths
if (await exists('src/app/sitemap.ts')) {
  const sitemapSrc = await readFile(join(root, 'src/app/sitemap.ts'), 'utf8')
  for (const path of PRERENDER_PATHS) {
    const needle = path === '/' ? "'/'" : `'${path}'`
    const alt = path === '/' ? '"/"' : `"${path}"`
    if (!sitemapSrc.includes(needle) && !sitemapSrc.includes(alt)) {
      // Also accept importing PRERENDER_PATHS / INDEXABLE_PATHS
      if (!sitemapSrc.includes('PRERENDER_PATHS') && !sitemapSrc.includes('INDEXABLE_PATHS')) {
        missing.push(`src/app/sitemap.ts does not reference indexable path ${path}`)
      }
    }
  }
} else {
  missing.push('Missing src/app/sitemap.ts')
}

if (missing.length) {
  console.error('URL parity check FAILED:\n' + missing.map((m) => `  - ${m}`).join('\n'))
  process.exit(1)
}

console.log('URL parity check passed.')
console.log('  Indexable:', PRERENDER_PATHS.join(', '))
console.log('  Also required: /admin, /api/*, not-found, sitemap')
if (notes.length) console.log(notes.join('\n'))
