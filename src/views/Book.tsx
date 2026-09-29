'use client'
import { BookingCalendar } from '@/components/BookingCalendar'
import { PageHeader } from '@/components/PageHeader'
import { PAGE_SEO } from '@/config/pageSeo'

const BOOK = PAGE_SEO['/book']

export function BookPage() {
  return (
    <div className="ajx-container flex min-h-[calc(100dvh-4rem)] flex-col py-12 sm:py-16 lg:min-h-0">
      <PageHeader title={BOOK.h1} description={BOOK.pageLead ?? BOOK.description} />

      <div className="mx-auto mt-10 flex min-h-0 w-full max-w-4xl flex-1 flex-col lg:mt-12 lg:min-h-[640px]">
        <BookingCalendar />
      </div>
    </div>
  )
}
