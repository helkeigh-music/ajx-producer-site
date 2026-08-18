import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Beat } from '@/config/site'
import { PAGE_SEO } from '@/config/pageSeo'
import { SITE } from '@/config/site'
import { BeatCard } from '@/components/BeatCard'
import { BeatPlayer } from '@/components/BeatPlayer'
import { PageHeader } from '@/components/PageHeader'
import { fetchBeats } from '@/lib/beats'

const BEATS = PAGE_SEO['/beats']

export function BeatsPage() {
  const [beats, setBeats] = useState<Beat[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [playSession, setPlaySession] = useState(0)
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

  function selectBeat(id: string) {
    setActiveId(id)
    setPlaySession((session) => session + 1)
    if (window.matchMedia('(max-width: 1023px)').matches) {
      window.requestAnimationFrame(() => {
        document.getElementById('beat-player')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  return (
    <div className="ajx-container py-16 sm:py-24">
      <PageHeader title={BEATS.h1} description={BEATS.pageLead ?? BEATS.description} />

      {paid ? (
        <div className="ajx-card mt-8 px-5 py-4 text-sm text-white/75">
          Payment received. Your download link is on the way. Check your inbox.
        </div>
      ) : null}
      {canceled ? (
        <div className="ajx-card mt-8 px-5 py-4 text-sm text-white/45">
          Checkout cancelled. Your cart is still here when you are ready.
        </div>
      ) : null}

      {loading ? (
        <p className="mt-16 text-sm text-white/40">Loading…</p>
      ) : (
        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div id="beat-player" className="order-1 lg:sticky lg:top-24 lg:order-2 lg:self-start">
            {activeBeat ? (
              <BeatPlayer
                key={`${activeBeat.id}-${playSession}`}
                beat={activeBeat}
                autoPlay={playSession > 0}
                playSession={playSession}
              />
            ) : null}
            <p className="mt-6 text-sm leading-relaxed text-white/40">
              Need a custom beat?{' '}
              <Link to="/book" className="ajx-link no-underline hover:underline">
                Book a session
              </Link>{' '}
              or email{' '}
              <a href={`mailto:${SITE.email}`} className="ajx-link no-underline hover:underline">
                {SITE.email}
              </a>
            </p>
          </div>
          <div className="order-2 space-y-4 lg:order-1">
            {beats.map((beat, index) => (
              <BeatCard
                key={beat.id}
                beat={beat}
                index={index + 1}
                active={beat.id === activeBeat?.id}
                onPlay={() => selectBeat(beat.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
