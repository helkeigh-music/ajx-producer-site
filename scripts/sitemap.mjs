import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PRERENDER_PATHS } from './paths.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')
const dist = join(root, 'dist')
const publicDir = join(root, 'public')

const SITE_URL = (process.env.VITE_SITE_URL ?? 'https://ajx-producer-site.vercel.app').replace(/\/$/, '')
const now = new Date().toISOString()

function getCanonicalUrl(path) {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
}

function priorityFor(path) {
  if (path === '/') return '1.0'
  if (path === '/beats') return '0.95'
  return '0.85'
}

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PRERENDER_PATHS.map(
  (path) => `  <url>
    <loc>${getCanonicalUrl(path)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${path === '/' ? 'weekly' : 'weekly'}</changefreq>
    <priority>${priorityFor(path)}</priority>
  </url>`,
).join('\n')}
</urlset>
`

await writeFile(join(dist, 'sitemap.xml'), body, 'utf8')
await writeFile(join(publicDir, 'sitemap.xml'), body, 'utf8')
console.log('Wrote sitemap.xml with', PRERENDER_PATHS.length, 'URLs')
