'use client'
import { BookingCalendar } from '@/components/BookingCalendar'
import { PageHeader } from '@/components/PageHeader'
import { PAGE_SEO } from '@/config/pageSeo'
import { SITE } from '@/config/site'
import { ENQUIRE_WHATSAPP_MESSAGE, whatsAppHref } from '@/lib/whatsapp'

const BOOK = PAGE_SEO['/book']

export function BookPage() {
  return (
    <div className="ajx-container flex min-h-[calc(100dvh-4rem)] flex-col py-12 sm:py-16 lg:min-h-0">
      <PageHeader title={BOOK.h1} description="Pick a session and your details. WhatsApp opens with the message ready to send.">
        <p className="mt-4 text-sm text-white/70">
          Or{' '}
          <a
            href={whatsAppHref(ENQUIRE_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="ajx-link"
          >
            message Alex now
          </a>
          {', email '}
          <a
            href={whatsAppHref(ENQUIRE_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="ajx-link"
          >
            {SITE.email}
          </a>
          {' or call '}
          <a href={`tel:${SITE.phoneTel}`} className="ajx-link">
            {SITE.phone}
          </a>
          .
        </p>
      </PageHeader>

      <div className="mx-auto mt-8 flex min-h-0 w-full max-w-4xl flex-1 flex-col lg:min-h-[640px]">
        <BookingCalendar />
      </div>
    </div>
  )
}
