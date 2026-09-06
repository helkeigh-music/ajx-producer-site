/**
 * Post-build: inject GA4 into prerendered HTML.
 * Reads VITE_GA_MEASUREMENT_ID; falls back to src/config/site.ts default.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PRERENDER_PATHS } from './paths.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')
const dist = join(root, 'dist')

const DEFAULT_GA_ID = ''
const GA_ID = (process.env.VITE_GA_MEASUREMENT_ID || DEFAULT_GA_ID).trim()

function ga4HeadSnippet(measurementId) {
  if (!measurementId || measurementId.includes('XXXX')) return ''
  return `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', { anonymize_ip: true });
    </script>`
}

function injectHead(html) {
  const ga = ga4HeadSnippet(GA_ID)
  if (!ga) return html
  return html.replace(/<\/head>/i, `    ${ga.trim()}\n  </head>`)
}

function distDirForRoute(routePath) {
  if (routePath === '/') return dist
  return join(dist, routePath.slice(1))
}

async function main() {
  const files = new Set([join(dist, 'index.html'), join(dist, '404.html')])
  for (const path of PRERENDER_PATHS) {
    if (path === '/') continue
    files.add(join(distDirForRoute(path), 'index.html'))
  }

  let count = 0
  for (const file of files) {
    try {
      const html = await readFile(file, 'utf8')
      const next = injectHead(html)
      if (next !== html) {
        await writeFile(file, next, 'utf8')
        count += 1
      }
    } catch {
      /* partial build */
    }
  }

  const gaNote = GA_ID ? `GA4 ${GA_ID}` : 'GA4 skipped (set VITE_GA_MEASUREMENT_ID)'
  console.log(`[injectAnalytics] patched ${count} HTML files — ${gaNote}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
