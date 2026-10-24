import type { ReactNode } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { PAGE_SEO } from '@/config/pageSeo'
import { BRAND, SITE } from '@/config/site'
import { BEATS_WHATSAPP_MESSAGE, ENQUIRE_WHATSAPP_MESSAGE, whatsAppHref } from '@/lib/whatsapp'

const PRIVACY = PAGE_SEO['/privacy-policy']
const LAST_UPDATED = '23 October 2026'

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
            {BRAND.name} is a music producer based in {BRAND.location}, listing beats and running studio sessions.
            Beat enquiries go through WhatsApp. We do not take card payments on this site. We are the data controller
            for personal information collected through this website.
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
              <strong className="text-white">Beat enquiries:</strong> if you message on WhatsApp about a beat, that
              conversation stays on WhatsApp. This site does not collect card details.
            </li>
            <li>
              <strong className="text-white">Messages:</strong> anything you send us by email, phone, WhatsApp or social media.
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
            <li>To reply to your messages, including WhatsApp enquiries about a beat</li>
            <li>To keep records for tax and accounting</li>
            <li>To understand how the site is used and improve it</li>
          </ul>
          <p>We do not sell your data and we do not send marketing emails unless you ask us to.</p>
        </PolicySection>

        <PolicySection title="Legal basis">
          <p>
            We process booking details because they are needed to provide the session you asked for (contract). We
            use analytics to run and improve the site (legitimate interests).
          </p>
        </PolicySection>

        <PolicySection title="Cookies and analytics">
          <p>
            We use analytics to see how many people visit the site and which pages they use, which may involve
            cookies. Embedded music players can also set cookies when you play a track. You can block or delete
            cookies in your browser settings and the site will still work.
          </p>
        </PolicySection>

        <PolicySection title="Who we share it with">
          <p>
            We only share your data with trusted service providers that help us run the site, such as website hosting,
            email and analytics. They can only use it to provide those services to us.
          </p>
          <p>Some of these providers may process data outside the UK under recognised safeguards.</p>
        </PolicySection>

        <PolicySection title="How long we keep it">
          <p>
            Booking details are kept for up to 24 months after your session. Analytics data is kept for up to 14
            months.
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
            <a
              href={whatsAppHref(ENQUIRE_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="ajx-link"
            >
              Book a session
            </a>{' '}
            or{' '}
            <a
              href={whatsAppHref(BEATS_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="ajx-link"
            >
              browse beats
            </a>
            .
          </p>
        </PolicySection>
      </div>
    </div>
  )
}
