'use client'
import { useMemo, useState } from 'react'
import { DiscCover } from '@/components/DiscCover'
import { EmbedPlayer } from '@/components/EmbedPlayer'
import { PageHeader } from '@/components/PageHeader'
import { PAGE_SEO } from '@/config/pageSeo'
import { beatUsesEmbed } from '@/lib/embed'
import { PORTFOLIO } from '@/lib/beats'

const PORTFOLIO_PAGE = PAGE_SEO['/portfolio']

export function PortfolioPage() {
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null)
  const [playSession, setPlaySession] = useState(0)
  const activeItem = useMemo(
    () => PORTFOLIO.find((item) => item.id === activeAudioId) ?? null,
    [activeAudioId],
  )

  return (
    <div className="ajx-container py-16 sm:py-24">
      <PageHeader title={PORTFOLIO_PAGE.h1} description={PORTFOLIO_PAGE.pageLead ?? PORTFOLIO_PAGE.description} />

      <ul className="ajx-divider mt-16 divide-y divide-white/10">
        {PORTFOLIO.map((item, index) => (
          <li
            key={item.id}
            className="grid gap-6 py-10 sm:grid-cols-[3rem_120px_1fr] sm:items-start sm:gap-8 sm:py-12"
          >
            <span className="hidden ajx-meta sm:inline">{String(index + 1).padStart(2, '0')}</span>
            <DiscCover src={item.coverUrl} alt="" className="w-20 sm:w-full sm:max-w-[120px]" />
            <div className="min-w-0 sm:col-span-1">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 ajx-meta">
                {item.artist} · {item.year} · {item.role}
              </p>
              {item.description ? (
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/45">{item.description}</p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
                {item.link ? (
                  <a href={item.link} className="ajx-link no-underline hover:underline" target="_blank" rel="noopener noreferrer">
                    Listen
                  </a>
                ) : null}
                {item.embedUrl || item.audioUrl ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAudioId(item.id)
                      setPlaySession((session) => session + 1)
                    }}
                    className="text-white/50 transition hover:text-white"
                  >
                    {activeAudioId === item.id ? 'Playing clip' : 'Play clip'}
                  </button>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {activeItem ? (
        <div className="ajx-card mt-10 p-6 sm:mt-12">
          <p className="ajx-label">{activeItem.title}</p>
          {activeItem.embedUrl && beatUsesEmbed({ embedUrl: activeItem.embedUrl }) ? (
            <div className="mt-5">
              <EmbedPlayer
                key={`${activeItem.id}-${playSession}`}
                url={activeItem.embedUrl}
                title={activeItem.title}
                autoPlay
                playSession={playSession}
              />
            </div>
          ) : activeItem.audioUrl ? (
            <audio controls src={activeItem.audioUrl} className="mt-5 w-full" autoPlay>
              Your browser does not support audio playback.
            </audio>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
