import { useMemo, useState } from 'react'
import { PORTFOLIO } from '@/lib/beats'

export function PortfolioPage() {
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null)
  const activeItem = useMemo(
    () => PORTFOLIO.find((item) => item.id === activeAudioId) ?? null,
    [activeAudioId],
  )

  return (
    <div className="ajx-container py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-brand">Work</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Portfolio</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">
          Selected credits across trap, R&B, and drill — production, arrangement, mix, and master.
        </p>
      </header>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {PORTFOLIO.map((item) => (
          <article key={item.id} className="ajx-card overflow-hidden">
            <div className="grid sm:grid-cols-[140px_minmax(0,1fr)]">
              {item.coverUrl ? (
                <img src={item.coverUrl} alt="" className="h-full min-h-[140px] w-full object-cover sm:min-h-full" />
              ) : (
                <div className="min-h-[140px] bg-navy-900" />
              )}
              <div className="p-5">
                <p className="font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm text-white/50">
                  {item.artist} · {item.year} · {item.role}
                </p>
                {item.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-white/45">{item.description}</p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-3">
                  {item.link ? (
                    <a href={item.link} className="ajx-link text-sm font-medium" target="_blank" rel="noopener noreferrer">
                      Listen
                    </a>
                  ) : null}
                  {item.audioUrl ? (
                    <button
                      type="button"
                      onClick={() => setActiveAudioId(item.id)}
                      className="text-sm font-medium text-white/60 transition hover:text-sky-brand"
                    >
                      {activeAudioId === item.id ? 'Clip playing below' : 'Play clip'}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {activeItem?.audioUrl ? (
        <div className="mt-8 ajx-card p-5">
          <p className="text-sm font-semibold text-white">{activeItem.title} — preview clip</p>
          <audio controls src={activeItem.audioUrl} className="mt-3 w-full" autoPlay>
            Your browser does not support audio playback.
          </audio>
        </div>
      ) : null}
    </div>
  )
}
