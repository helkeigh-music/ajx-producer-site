import { Link } from 'react-router-dom'
import { LICENSE_TIERS, SITE } from '@/config/site'
import { SocialLinks } from '@/components/SocialLinks'

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_55%)]" />
        <div className="ajx-container relative py-20 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-brand">UK Producer</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Trap, R&B, and session-ready beats.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
            Preview online, pick a license tier, and get files by email after checkout. Book studio time when you need
            custom production or mixing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/beats" className="ajx-btn-primary">
              Browse beats
            </Link>
            <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" className="ajx-btn-ghost">
              Book session
            </a>
          </div>
          <SocialLinks className="mt-10" />
        </div>
      </section>

      <section className="ajx-container py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-brand">Licensing</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Basic, premium, or exclusive</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Every beat ships with clear usage terms. Upgrade tiers anytime before checkout.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {LICENSE_TIERS.map((tier) => (
            <div key={tier.id} className="ajx-card p-5">
              <h3 className="text-sm font-semibold text-white">{tier.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{tier.summary}</p>
              <ul className="mt-4 space-y-1.5 text-xs text-white/45">
                {tier.includes.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="ajx-container border-t border-white/10 py-16 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: 'Beat store', body: 'Preview MP3s, choose a tier, checkout with Stripe.', to: '/beats' },
            { title: 'Portfolio', body: 'Selected production, mix, and master credits.', to: '/portfolio' },
            { title: 'Booking', body: 'Cal.com sessions for collabs, mixing, and custom work.', to: '/book' },
          ].map((item) => (
            <Link key={item.title} to={item.to} className="ajx-card p-5 transition hover:border-sky-brand/30">
              <h2 className="text-sm font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{item.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
