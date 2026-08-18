import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmbedPlayer } from '@/components/EmbedPlayer'
import { SITE } from '@/config/site'
import { fetchBeats } from '@/lib/beats'
import { beatUsesEmbed } from '@/lib/embed'

const HERO_EMBEDS = [
  {
    title: 'SoundCloud',
    url: 'https://soundcloud.com/user-335209347/free-for-non-profit-real-rap',
  },
  { title: 'YouTube', url: SITE.social.youtube },
]

export function HeroEmbeds() {
  const [beatEmbeds, setBeatEmbeds] = useState<{ title: string; url: string }[]>([])

  useEffect(() => {
    void fetchBeats().then((beats) => {
      const fromBeats = beats
        .filter((beat) => beat.featured && beat.embedUrl && beatUsesEmbed(beat))
        .slice(0, 3)
        .map((beat) => ({ title: beat.title, url: beat.embedUrl! }))
      setBeatEmbeds(fromBeats)
    })
  }, [])

  const embeds = beatEmbeds.length
    ? beatEmbeds
    : HERO_EMBEDS.filter((item) => item.url.trim().length > 0)

  return (
    <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
      <div className="flex items-end justify-between gap-3">
        <p className="ajx-label">Now spinning</p>
        {embeds.length > 1 ? (
          <Link to="/beats" className="text-xs font-semibold text-white sm:hidden">
            All beats
          </Link>
        ) : null}
      </div>
      {embeds.map((item, index) => (
        <div
          key={`${item.title}-${item.url}`}
          className={`overflow-hidden rounded-sm border border-white/10 bg-navy-950/80 p-3 sm:p-4 ${index > 0 ? 'hidden sm:block' : ''}`}
        >
          <p className="mb-2 flex items-center gap-2 truncate text-sm font-semibold text-white/80 sm:mb-3">
            <span className="size-1.5 shrink-0 rounded-full bg-white/50" />
            {item.title}
          </p>
          <EmbedPlayer url={item.url} title={item.title} compact />
        </div>
      ))}
      {embeds.length > 1 ? (
        <p className="hidden text-xs text-white/40 sm:block">{embeds.length} featured beats in the store.</p>
      ) : null}
    </div>
  )
}
