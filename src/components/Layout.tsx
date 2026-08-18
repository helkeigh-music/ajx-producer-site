import { type ReactNode, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { JsonLd } from '@/components/JsonLd'
import { SocialLinks } from '@/components/SocialLinks'
import { PAGE_SEO, pageSeoForPath } from '@/config/pageSeo'
import { BRAND, SITE } from '@/config/site'
import { usePageSeo } from '@/hooks/usePageSeo'
import { breadcrumbJsonLd, homeJsonLd } from '@/lib/schema'

const nav = [
  { to: '/beats', label: 'Beats' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/book', label: 'Book' },
  { to: '/admin', label: 'Upload' },
]

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `block px-0 py-3 text-base sm:py-2 sm:text-sm ${
              isActive ? 'font-medium text-white' : 'text-white/50 hover:text-white'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950 supports-[padding:max(0px)]:pt-safe-t">
      <div className="ajx-container flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={BRAND.profileImageUrl}
            alt={BRAND.name}
            className="size-8 shrink-0 rounded-full border border-white/15 object-cover sm:size-9"
          />
          <span className="truncate font-heading text-lg font-bold tracking-tight text-white">
            {BRAND.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm ${isActive ? 'font-medium text-white' : 'text-white/50 hover:text-white'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center text-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-white/10 md:hidden">
          <nav className="ajx-container flex flex-col gap-1 py-6 pb-safe-b" aria-label="Mobile">
            <NavItems onNavigate={() => setOpen(false)} />
          </nav>
        </div>
      ) : null}
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 pb-safe-b">
      <div className="ajx-container flex flex-col gap-10 py-16 sm:flex-row sm:items-start sm:justify-between sm:py-20">
        <div>
          <p className="font-heading text-xl font-bold text-white">{BRAND.name}</p>
          <p className="mt-2 ajx-meta">{BRAND.location}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">{SITE.description}</p>
          <div className="mt-6 flex flex-col gap-2 text-sm">
            <a href={`mailto:${SITE.email}`} className="ajx-link">
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phoneTel}`} className="ajx-link">
              {SITE.phone}
            </a>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="mb-4 ajx-label">Social</p>
          <SocialLinks className="justify-start sm:justify-end" />
        </div>
      </div>
    </footer>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const routeSeo = PAGE_SEO[pathname] ? pageSeoForPath(pathname) : pageSeoForPath('/404')

  usePageSeo({
    title: routeSeo.title,
    description: routeSeo.description,
    path: pathname,
    robots: routeSeo.robots,
  })

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd data={pathname === '/' ? homeJsonLd() : null} id="jsonld-home" />
      <JsonLd data={breadcrumbJsonLd(pathname)} id="jsonld-breadcrumb" />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
