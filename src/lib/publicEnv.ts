/** Read public env from Next (`NEXT_PUBLIC_*`) or Vite (`VITE_*`) during dual-stack migration. */
export function publicEnv(name: string, fallback = ''): string {
  const nextKey = `NEXT_PUBLIC_${name}`
  const viteKey = `VITE_${name}`

  if (typeof process !== 'undefined') {
    const fromNext = process.env[nextKey]?.trim()
    if (fromNext) return fromNext
    const fromViteProcess = process.env[viteKey]?.trim()
    if (fromViteProcess) return fromViteProcess
  }

  try {
    const env = import.meta.env as Record<string, string | undefined> | undefined
    const fromMeta = env?.[viteKey]?.trim() || env?.[nextKey]?.trim()
    if (fromMeta) return fromMeta
  } catch {
    // ignore
  }

  return fallback
}
