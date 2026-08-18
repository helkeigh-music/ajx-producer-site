import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DiscCover } from '@/components/DiscCover'
import { EmbedPlayer } from '@/components/EmbedPlayer'
import { SocialLinks } from '@/components/SocialLinks'
import type { Beat } from '@/config/site'
import { BRAND } from '@/config/site'
import { PAGE_SEO } from '@/config/pageSeo'
import { fetchBeats, SAX_SAMPLE_FLIP_SHORT } from '@/lib/beats'
import { beatUsesEmbed } from '@/lib/embed'

const HOME = PAGE_SEO['/']

export function HomeHero() {
  const [featured, setFeatured] = useState<Beat[]>([])
  const [heroBeat, setHeroBeat] = useState<Beat | null>(null)

  useEffect(() => {
    void fetchBeats().then((beats) => {
      const picks = beats.filter((beat) => beat.featured || beatUsesEmbed(beat)).slice(0, 6)
      setFeatured(picks.slice(0, 5))
      setHeroBeat(picks.find((beat) => beat.embedUrl && beatUsesEmbed(beat)) ?? beats[0] ?? null)
    })
  }, [])

  return (
    <section className="ajx-divider border-b">
      <div className="ajx-container py-16 sm:py-24 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="hero-kicker">{BRAND.location}</p>
            <h1 className="page-h1 mt-5">{HOME.h1}</h1>
            <p className="hero-sub mt-6">{HOME.pageLead ?? HOME.description}</p>
            <p className="mt-6 ajx-meta">Trap · Drill · R&B · from £29</p>

            <div className="mt-10 flex flex-col gap-3 min-[420px]:flex-row">
              <Link to="/beats" className="ajx-btn-primary">
                Browse beats
              </Link>
              <Link to="/book" className="ajx-btn-ghost">
                Book a session
              </Link>
            </div>

            <SocialLinks className="mt-10" />
          </div>

          <div className="space-y-6">
            <div className="ajx-panel overflow-hidden">
              <div className="border-b border-white/10 px-5 py-4">
                <p className="text-sm font-semibold text-white">Sax sample flip</p>
                <p className="mt-1 ajx-meta">Live sax over a reel sample</p>
              </div>
              <div className="p-4">
                <EmbedPlayer url={SAX_SAMPLE_FLIP_SHORT} title="Sax sample flip" autoPlay={false} />
              </div>
            </div>

            {heroBeat?.embedUrl ? (
              <div className="ajx-panel overflow-hidden">
                <div className="flex items-center gap-4 border-b border-white/10 px-5 py-4">
                  <DiscCover src={heroBeat.coverUrl} alt="" className="size-11" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{heroBeat.title}</p>
                    <p className="ajx-meta">
                      {heroBeat.bpm}bpm · {heroBeat.key}
                    </p>
                  </div>
                  <Link to="/beats" className="shrink-0 text-xs font-medium text-sky-brand hover:text-sky-light">
                    Beat store
                  </Link>
                </div>
                <div className="p-4">
                  <EmbedPlayer url={heroBeat.embedUrl} title={heroBeat.title} compact />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {featured.length ? (
          <div className="ajx-divider mt-20 pt-16 sm:mt-24 sm:pt-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="section-title">On the store now</h2>
              <Link to="/beats" className="shrink-0 text-sm font-medium text-sky-brand hover:text-sky-light">
                View all
              </Link>
            </div>
            <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
              {featured.map((beat) => (
                <Link key={beat.id} to="/beats" className="ajx-beat-tile w-[9.5rem] shrink-0 sm:w-[10.5rem]">
                  <DiscCover src={beat.coverUrl} alt="" className="w-full" />
                  <p className="mt-4 truncate text-sm font-medium text-white">{beat.title}</p>
                  <p className="mt-1 ajx-meta">
                    {beat.bpm}bpm · {beat.tags[0] ?? beat.key}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
