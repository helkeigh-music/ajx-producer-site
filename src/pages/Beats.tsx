import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Beat } from '@/config/site'
import { LICENSE_TIERS } from '@/config/site'
import { BeatCard } from '@/components/BeatCard'
import { BeatPlayer } from '@/components/BeatPlayer'
import { fetchBeats } from '@/lib/beats'

export function BeatsPage() {
  const [beats, setBeats] = useState<Beat[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    void fetchBeats().then((list) => {
      setBeats(list)
      setActiveId(list[0]?.id ?? null)
      setLoading(false)
    })
  }, [])

  const activeBeat = useMemo(
    () => beats.find((b) => b.id === activeId) ?? beats[0] ?? null,
    [activeId, beats],
  )

  const paid = searchParams.get('paid') === '1'
  const canceled = searchParams.get('canceled') === '1'

  useEffect(() => {
    if (!paid && !canceled) return
    const timer = window.setTimeout(() => setSearchParams({}, { replace: true }), 8000)
    return () => window.clearTimeout(timer)
  }, [paid, canceled, setSearchParams])

  return (
    <div className="ajx-container py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-brand">Store</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Beats</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">
          Preview before you buy. Choose basic, premium, or exclusive — files are emailed after payment.
        </p>
      </header>

      {paid ? (
        <div className="mt-6 rounded-2xl border border-sky-brand/30 bg-sky-brand/10 px-5 py-4 text-sm text-sky-light">
          Payment received. Check your inbox for download links within a few minutes.
        </div>
      ) : null}
      {canceled ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/60">
          Checkout canceled — pick a license tier when you are ready.
        </div>
      ) : null}

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {LICENSE_TIERS.map((tier) => (
          <div key={tier.id} className="ajx-card p-4">
            <h2 className="text-sm font-semibold text-white">{tier.label}</h2>
            <p className="mt-2 text-xs leading-relaxed text-white/50">{tier.summary}</p>
            <ul className="mt-3 space-y-1 text-xs text-white/45">
              {tier.includes.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {loading ? (
        <p className="mt-10 text-sm text-white/45">Loading beats…</p>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="space-y-3">
            {beats.map((beat) => (
              <BeatCard
                key={beat.id}
                beat={beat}
                active={beat.id === activeBeat?.id}
                onPlay={() => setActiveId(beat.id)}
              />
            ))}
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            {activeBeat ? <BeatPlayer beat={activeBeat} /> : null}
            <p className="mt-4 text-xs leading-relaxed text-white/40">
              Need a custom license? <Link to="/book" className="ajx-link">Book a session</Link> or email after purchase
              for upgrades.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
