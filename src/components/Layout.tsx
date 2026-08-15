import { type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BRAND, SITE } from '@/config/site'
import { SocialLinks } from '@/components/SocialLinks'

const nav = [
  { to: '/beats', label: 'Beats' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/book', label: 'Book' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/90 backdrop-blur-md">
      <div className="ajx-container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-3">
          <img src={BRAND.logoUrl} alt="" className="h-8 w-auto" />
          <span className="hidden text-xs font-medium uppercase tracking-widest text-sky-brand/80 sm:inline">
            {BRAND.tagline}
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="ajx-container flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-white">{BRAND.name}</p>
          <p className="mt-1 text-sm text-white/45">{SITE.description}</p>
        </div>
        <SocialLinks />
      </div>
    </footer>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
