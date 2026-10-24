import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SiteShell } from '@/components/SiteShell'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { PAGE_SEO } from '@/config/pageSeo'
import { SITE } from '@/config/site'
import { resolvePageMeta } from '@/lib/resolvePageMeta'
import '@/styles/globals.css'

const home = PAGE_SEO['/']
const homeMeta = resolvePageMeta('/')

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url.replace(/\/$/, '') || 'https://prodbyajx.com'),
  title: home.title,
  description: home.description,
  robots: 'index, follow',
  alternates: { canonical: homeMeta.canonicalUrl },
  openGraph: {
    title: home.title,
    description: home.description,
    url: homeMeta.canonicalUrl,
    type: 'website',
    locale: 'en_GB',
    siteName: 'prodbyajx',
    images: [{ url: homeMeta.ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: home.title,
    description: home.description,
    images: [homeMeta.ogImage],
  },
  icons: { icon: '/profile.jpg' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <meta name="theme-color" content="#030810" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Besley:wght@600;700;800&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-navy-950 font-sans text-white antialiased">
        <GoogleAnalytics />
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  )
}
