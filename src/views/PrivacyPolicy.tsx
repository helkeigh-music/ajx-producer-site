import type { ReactNode } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { PAGE_SEO } from '@/config/pageSeo'
import { BRAND, SITE } from '@/config/site'

const PRIVACY = PAGE_SEO['/privacy-policy']
const LAST_UPDATED = '7 October 2026'

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-white/10 pt-8">
      <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/60 sm:text-base">{children}</div>
    </section>
  )
}

export function PrivacyPolicyPage() {
  return (
    <div className="ajx-container py-16 sm:py-24">
      <PageHeader title={PRIVACY.h1} description={PRIVACY.pageLead ?? PRIVACY.description} />

      <div className="max-w-3xl space-y-10">
        <p className="ajx-meta">Last updated: {LAST_UPDATED}</p>

        <PolicySection title="Who we are">
          <p>
            {BRAND.name} is a music producer based in {BRAND.location}, selling beat licenses online and running
            studio sessions. We are the data controller for personal information collected through this website.
          </p>
          <p>
            Questions about your data? Email{' '}
            <a href={`mailto:${SITE.email}`} className="ajx-link">
              {SITE.email}
            </a>{' '}
            or call{' '}
            <a href={`tel:${SITE.phoneTel}`} className="ajx-link">
              {SITE.phone}
            </a>
            .
          </p>
        </PolicySection>

        <PolicySection title="What we collect">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-white">Studio bookings:</strong> your name, email address, phone number if you
              give it, the session type, date and time, and any notes you add.
            </li>
            <li>
              <strong className="text-white">Beat purchases:</strong> your email address, the beat and license you
              bought, and the payment amount. Card details are entered on Stripe&apos;s secure checkout and never
              reach us.
            </li>
            <li>
              <strong className="text-white">Messages:</strong> anything you send us by email, phone, Instagram or
              other social channels.
            </li>
            <li>
              <strong className="text-white">Website usage:</strong> pages visited, device and browser type, and how
              you arrived at the site, collected through analytics.
            </li>
          </ul>
        </PolicySection>

        <PolicySection title="How we use it">
          <ul className="list-disc space-y-2 pl-5">
            <li>To confirm and manage studio bookings</li>
            <li>To process beat purchases and email your download link and license</li>
            <li>To reply to your messages</li>
            <li>To keep records for tax and accounting</li>
            <li>To understand how the site is used and improve it</li>
          </ul>
          <p>We do not sell your data and we do not send marketing emails unless you ask us to.</p>
        </PolicySection>

        <PolicySection title="Legal basis">
          <p>
            We process booking and purchase details because they are needed to provide the session or license you
            asked for (contract). We keep financial records because the law requires it (legal obligation). We use
            analytics to run and improve the site (legitimate interests).
          </p>
        </PolicySection>

        <PolicySection title="Cookies and analytics">
          <p>
            We use Vercel Analytics, which counts page views without cookies. We may also use Google Analytics, which
            sets cookies to measure visits. You can block analytics cookies in your browser settings or with the{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="ajx-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics opt-out add-on
            </a>
            .
          </p>
          <p>
            Beat previews and portfolio tracks may play through embedded YouTube or SoundCloud players. Those services
            can set their own cookies when you play a track, under their own privacy policies.
          </p>
        </PolicySection>

        <PolicySection title="Who we share it with">
          <p>We only share your data with services that help us run the site and deliver your order:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-white">Stripe</strong> for card payments
            </li>
            <li>
              <strong className="text-white">Vercel</strong> for website hosting, booking storage and analytics
            </li>
            <li>
              <strong className="text-white">Resend</strong> for booking confirmations and download emails
            </li>
            <li>
              <strong className="text-white">Google</strong> for analytics, if enabled
            </li>
          </ul>
          <p>Some of these providers may process data outside the UK under recognised safeguards.</p>
        </PolicySection>

        <PolicySection title="How long we keep it">
          <p>
            Booking details are kept for up to 24 months after your session. Purchase and payment records are kept for
            7 years for tax purposes. Analytics data is kept for up to 14 months.
          </p>
        </PolicySection>

        <PolicySection title="Your rights">
          <p>
            Under UK GDPR you can ask to see the data we hold about you, correct it, delete it, restrict or object to
            how we use it, or receive a copy. Email{' '}
            <a href={`mailto:${SITE.email}`} className="ajx-link">
              {SITE.email}
            </a>{' '}
            and we will reply within one month.
          </p>
          <p>
            If you are unhappy with how we handle your data, you can complain to the{' '}
            <a href="https://ico.org.uk/make-a-complaint/" className="ajx-link" target="_blank" rel="noopener noreferrer">
              Information Commissioner&apos;s Office
            </a>
            .
          </p>
        </PolicySection>

        <PolicySection title="Changes to this policy">
          <p>
            We may update this policy from time to time. The latest version is always on this page.{' '}
            <Link href="/book" className="ajx-link">
              Book a session
            </Link>{' '}
            or{' '}
            <Link href="/beats" className="ajx-link">
              browse beats
            </Link>
            .
          </p>
        </PolicySection>
      </div>
    </div>
  )
}
