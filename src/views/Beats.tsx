'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Beat } from '@/config/site'
import { PAGE_SEO } from '@/config/pageSeo'
import { SITE } from '@/config/site'
import { BeatCard } from '@/components/BeatCard'
import { BeatPlayer } from '@/components/BeatPlayer'
import { PageHeader } from '@/components/PageHeader'
import { fetchBeats } from '@/lib/beats'
import { ENQUIRE_WHATSAPP_MESSAGE, whatsAppHref } from '@/lib/whatsapp'

const BEATS = PAGE_SEO['/beats']

export function BeatsPage() {
  const [beats, setBeats] = useState<Beat[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [playSession, setPlaySession] = useState(0)
  const [loading, setLoading] = useState(true)

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
    <div className="ajx-container py-12 sm:py-16">
      <PageHeader title={BEATS.h1} description={BEATS.pageLead ?? BEATS.description} />

      {loading ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : (
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
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
              <a
                href={whatsAppHref(ENQUIRE_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="ajx-link no-underline hover:underline"
              >
                Enquire
              </a>{' '}
              or message{' '}
              <a
                href={whatsAppHref(ENQUIRE_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="ajx-link no-underline hover:underline"
              >
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
