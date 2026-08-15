import { SITE } from '@/config/site'

export function BookPage() {
  const bookingUrl = SITE.bookingUrl

  return (
    <div className="ajx-container py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-brand">Sessions</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Book</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">
          Production, mixing, or collab sessions — pick a slot that works for you.
        </p>
      </header>

      <div className="mt-10 ajx-card overflow-hidden">
        <div className="border-b border-white/10 px-5 py-4 sm:px-6">
          <p className="text-sm text-white/70">
            Calendar powered by Cal.com. Update <code className="text-sky-brand">VITE_BOOKING_URL</code> with your
            real booking page.
          </p>
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="ajx-btn-primary mt-4">
            Open calendar
          </a>
        </div>
        <iframe
          title="AJX booking calendar"
          src={bookingUrl}
          className="min-h-[720px] w-full border-0 bg-white"
          loading="lazy"
        />
      </div>
    </div>
  )
}
