'use client'

import { HomeHero } from '@/components/HomeHero'
import { LICENSE_TIERS } from '@/config/site'

export function HomePage() {
  return (
    <>
      <HomeHero />

      <section className="ajx-section ajx-container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">Licenses</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/45">
              Every beat has three license options. Pay online, files by email.
            </p>
          </div>
          <a href="/beats" className="text-sm font-medium text-sky-brand hover:text-sky-light">
            Open beat store
          </a>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {LICENSE_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`ajx-card p-8 ${tier.id === 'premium' ? 'ajx-tier-featured' : ''}`}
            >
              {tier.id === 'premium' ? (
                <span className="mb-5 inline-block ajx-label text-sky-brand">Most picked</span>
              ) : null}
              <h3 className="text-lg font-semibold text-white">{tier.label}</h3>
              <p className="ajx-price mt-4">£{tier.priceGbp}</p>
              <p className="mt-5 text-sm leading-relaxed text-white/45">{tier.summary}</p>
              <ul className="ajx-divider mt-8 space-y-3 pt-6 text-sm text-white/45">
                {tier.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="ajx-divider border-t">
        <div className="ajx-container ajx-section grid gap-6 sm:grid-cols-2 sm:gap-8">
          <a href="/portfolio" className="ajx-card-hover block p-8 sm:p-10">
            <h2 className="section-title">Portfolio</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/45">
              YouTube releases, sample flips and session work.
            </p>
            <span className="mt-10 inline-block text-sm font-medium text-sky-brand">View portfolio</span>
          </a>
          <a href="/book" className="ajx-card-hover block p-8 sm:p-10">
            <h2 className="section-title">Studio sessions</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/45">
              Custom beats, recording and mix. Pick a date on the calendar.
            </p>
            <span className="mt-10 inline-block text-sm font-medium text-sky-brand">Book a session</span>
          </a>
        </div>
      </section>
    </>
  )
}
