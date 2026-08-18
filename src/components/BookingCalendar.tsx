import { useEffect, useMemo, useState } from 'react'
import { BRAND, SITE } from '@/config/site'
import { sessionTypeById } from '@/config/booking'
import { fetchBookedSlots, submitBooking, type BookedSlot } from '@/lib/booking'
import {
  BOOKING_SLOTS,
  SESSION_TYPES,
  WEEKDAYS,
  buildMonthGrid,
  formatSelectedDate,
  formatSlotLabel,
  isBookableDate,
  monthKey,
} from '@/lib/bookingDates'

type WizardStep = 'service' | 'schedule' | 'details'

const STEPS: { id: WizardStep; label: string; short: string }[] = [
  { id: 'service', label: 'Session type', short: 'Type' },
  { id: 'schedule', label: 'Date & time', short: 'When' },
  { id: 'details', label: 'Contact details', short: 'You' },
]

function StepIndicator({ current }: { current: WizardStep }) {
  const currentIndex = STEPS.findIndex((step) => step.id === current)

  return (
    <ol className="flex items-center gap-1 sm:gap-0">
      {STEPS.map((step, index) => {
        const done = index < currentIndex
        const active = step.id === current
        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold sm:size-8 sm:text-xs ${
                  done
                    ? 'border-sky-brand bg-sky-brand text-navy-950'
                    : active
                      ? 'border-white/30 bg-white/10 text-white'
                      : 'border-white/15 text-white/35'
                }`}
              >
                {done ? '✓' : index + 1}
              </span>
              <span
                className={`truncate text-[11px] font-semibold sm:text-sm ${
                  active ? 'text-white' : done ? 'text-white/60' : 'text-white/35'
                }`}
              >
                <span className="sm:hidden">{step.short}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <div
                className={`mx-1 h-px flex-1 sm:mx-2 ${done ? 'bg-white/40' : 'bg-white/10'}`}
                aria-hidden="true"
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

function MobileSummary({
  sessionTypeId,
  selectedDate,
  selectedTime,
}: {
  sessionTypeId: string
  selectedDate: string | null
  selectedTime: string | null
}) {
  const session = sessionTypeById(sessionTypeId)
  const when =
    selectedDate && selectedTime
      ? `${formatSelectedDate(selectedDate)} · ${formatSlotLabel(selectedTime)}`
      : null

  return (
    <div className="rounded-sm border border-white/10 bg-navy-950/70 px-3 py-2 text-xs lg:hidden">
      <p className="truncate font-semibold text-white/80">
        {session?.label ?? 'Session'} · {session?.duration ?? '2 hrs'}
      </p>
      <p className="mt-0.5 truncate text-white/45">{when ?? 'Choose your date and time next'}</p>
    </div>
  )
}

function BookingSummary({
  sessionTypeId,
  selectedDate,
  selectedTime,
}: {
  sessionTypeId: string
  selectedDate: string | null
  selectedTime: string | null
}) {
  const session = sessionTypeById(sessionTypeId)

  return (
    <aside className="ajx-panel h-fit p-5 sm:p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-white/40">Booking summary</p>
      <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/35">With</p>
          <p className="mt-1 font-semibold text-lg text-white">{BRAND.name}</p>
          <p className="ajx-meta">{BRAND.location}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Service</p>
          <p className="mt-1 font-semibold text-white">{session?.label ?? 'Not chosen'}</p>
          <p className="ajx-meta">{session?.duration ?? 'Not set'} · UK time</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/35">When</p>
          <p className="mt-1 text-sm text-white/70">
            {selectedDate && selectedTime
              ? `${formatSelectedDate(selectedDate)} · ${formatSlotLabel(selectedTime)}`
              : 'Pick a date and time'}
          </p>
        </div>
      </div>
      <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/40">
        No payment upfront. {BRAND.name} confirms by email.{' '}
        <a href={`mailto:${SITE.email}`} className="text-white hover:underline">
          {SITE.email}
        </a>
      </p>
    </aside>
  )
}

export function BookingCalendar() {
  const now = new Date()
  const [step, setStep] = useState<WizardStep>('service')
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [booked, setBooked] = useState<BookedSlot[]>([])
  const [sessionType, setSessionType] = useState(SESSION_TYPES[0]?.id ?? 'studio')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<{ id: string; date: string; time: string } | null>(null)

  const month = monthKey(viewYear, viewMonth)
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  useEffect(() => {
    void fetchBookedSlots(month).then(setBooked)
  }, [month])

  useEffect(() => {
    setError(null)
  }, [step])

  const grid = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth])

  const bookedSet = useMemo(
    () => new Set(booked.map((slot) => `${slot.date}|${slot.time}`)),
    [booked],
  )

  function slotTaken(date: string, time: string): boolean {
    return bookedSet.has(`${date}|${time}`)
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
      return
    }
    setViewMonth((m) => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
      return
    }
    setViewMonth((m) => m + 1)
  }

  function goNext() {
    setError(null)
    if (step === 'service') {
      setStep('schedule')
      return
    }
    if (step === 'schedule') {
      if (!selectedDate || !selectedTime) {
        setError('Pick a date and time to continue')
        return
      }
      setStep('details')
      return
    }
  }

  function goBack() {
    setError(null)
    if (step === 'schedule') setStep('service')
    if (step === 'details') setStep('schedule')
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!selectedDate || !selectedTime) {
      setError('Pick a date and time')
      return
    }

    setSubmitting(true)
    setError(null)

    const result = await submitBooking({
      name,
      email,
      phone: phone.trim() || undefined,
      sessionType,
      date: selectedDate,
      time: selectedTime,
      notes: notes.trim() || undefined,
    })

    setSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      void fetchBookedSlots(month).then(setBooked)
      return
    }

    setConfirmed({ id: result.id, date: selectedDate, time: selectedTime })
  }

  function resetWizard() {
    setConfirmed(null)
    setStep('service')
    setSelectedDate(null)
    setSelectedTime(null)
    setName('')
    setEmail('')
    setPhone('')
    setNotes('')
    setError(null)
  }

  if (confirmed) {
    const session = sessionTypeById(sessionType)
    return (
      <div className="ajx-panel mx-auto flex max-w-lg flex-col justify-center p-6 text-center sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-sky-brand/30 bg-sky-brand/10 text-xl text-white">
          ✓
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-white/40 mt-6">Confirmed</p>
        <h2 className="font-semibold mt-2 text-2xl text-white">Booking confirmed</h2>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          {session?.label} · {formatSelectedDate(confirmed.date)} · {formatSlotLabel(confirmed.time)}
        </p>
        <p className="mt-2 text-xs text-white/40">Email sent to {email || 'your inbox'} · Ref {confirmed.id}</p>
        <button type="button" onClick={resetWizard} className="ajx-btn-primary mx-auto mt-8 !w-auto">
          Book another slot
        </button>
      </div>
    )
  }

  const footerButtons = (
    <div className="flex gap-3">
      {step !== 'service' ? (
        <button type="button" onClick={goBack} className="ajx-btn-ghost min-h-11 flex-1 sm:flex-none sm:min-w-[120px]">
          Back
        </button>
      ) : null}

      {step === 'details' ? (
        <button
          type="submit"
          form="booking-details-form"
          disabled={submitting}
          className="ajx-btn-primary min-h-11 flex-1 disabled:opacity-50 sm:min-w-[160px] sm:flex-none"
        >
          {submitting ? 'Confirming…' : 'Confirm booking'}
        </button>
      ) : (
        <button
          type="button"
          onClick={goNext}
          className={`ajx-btn-primary min-h-11 sm:min-w-[160px] ${step === 'service' ? 'w-full' : 'flex-1 sm:flex-none'}`}
        >
          Continue
        </button>
      )}
    </div>
  )

  const footer = (
    <div className="shrink-0 border-t border-white/10 bg-navy-950/95 px-4 py-3 sm:px-6 sm:py-4 lg:bg-navy-950/80">
      {error ? <p className="mb-3 text-sm text-red-300">{error}</p> : null}
      {footerButtons}
    </div>
  )

  const mobileFooter = (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-950/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="mx-auto max-w-4xl">
        {error ? <p className="mb-2 text-sm text-red-300">{error}</p> : null}
        {footerButtons}
      </div>
    </div>
  )

  return (
    <div className="ajx-panel flex min-h-0 flex-1 flex-col overflow-hidden lg:min-h-[640px]">
      <div className="shrink-0 space-y-2 border-b border-white/10 px-4 py-2 sm:space-y-3 sm:px-6 sm:py-4">
        <StepIndicator current={step} />
        {step !== 'schedule' ? (
          <MobileSummary
            sessionTypeId={sessionType}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        ) : null}
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_280px]">
        <div className="flex min-h-0 flex-col lg:border-r lg:border-white/10">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 pb-[calc(5.25rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-5 sm:pb-5 lg:pb-5">
            {step === 'service' ? (
              <div>
                <h2 className="text-lg font-bold text-white sm:text-2xl">Choose a session</h2>
                <p className="mt-1 text-xs text-white/50 sm:mt-2 sm:text-sm">2 hours · Manchester · Mon to Sat</p>
                <div className="mt-4 grid gap-2 sm:mt-6 sm:gap-3">
                  {SESSION_TYPES.map((type) => {
                    const selected = sessionType === type.id
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSessionType(type.id)}
                        className={`flex w-full items-start gap-3 border p-3 text-left transition sm:gap-4 sm:p-4 ${
                          selected
                            ? 'border-sky-brand/30 bg-sky-brand/10 '
                            : 'border-white/10 hover:border-white/25 hover:bg-white/[0.02]'
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-sky-brand bg-sky-brand text-navy-950' : 'border-white/25'
                          }`}
                        >
                          {selected ? <span className="text-[10px] font-bold">✓</span> : null}
                        </span>
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-sm font-bold text-white sm:text-base">{type.label}</span>
                            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                              {type.duration}
                            </span>
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-white/50 sm:mt-2 sm:text-sm">
                            {type.summary}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {step === 'schedule' ? (
              <div>
                <h2 className="font-semibold text-base font-bold text-white sm:text-2xl">
                  {selectedDate ? 'Pick a time' : 'Pick a date'}
                </h2>
                <p className="mt-0.5 text-[11px] text-white/45 sm:mt-2 sm:text-sm">
                  {selectedDate
                    ? formatSelectedDate(selectedDate)
                    : 'UK time, Mon to Sat. Tap a day.'}
                </p>

                <div className="mt-3 sm:mt-6 lg:grid lg:grid-cols-2 lg:gap-6">
                  {!selectedDate ? (
                    <div className="lg:col-span-2 lg:max-w-md">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={prevMonth}
                          className="flex size-8 items-center justify-center rounded-full border border-white/10 text-white/70 hover:border-white/40 hover:text-white"
                          aria-label="Previous month"
                        >
                          ←
                        </button>
                        <span className="text-xs font-semibold text-white sm:text-sm">{monthLabel}</span>
                        <button
                          type="button"
                          onClick={nextMonth}
                          className="flex size-8 items-center justify-center rounded-full border border-white/10 text-white/70 hover:border-white/40 hover:text-white"
                          aria-label="Next month"
                        >
                          →
                        </button>
                      </div>
                      <div className="rounded-lg border border-white/10 p-2 sm:p-3">
                        <div className="mb-1 grid grid-cols-7 gap-px">
                          {WEEKDAYS.map((day) => (
                            <div
                              key={day}
                              className="py-0.5 text-center text-[9px] font-semibold uppercase text-white/30"
                            >
                              {day.slice(0, 1)}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-px">
                          {grid.map((cell, index) => {
                            if (!cell) return <div key={`empty-${index}`} />
                            const bookable = isBookableDate(cell.date)
                            const selected = selectedDate === cell.date
                            return (
                              <button
                                key={cell.date}
                                type="button"
                                disabled={!bookable}
                                onClick={() => {
                                  setSelectedDate(cell.date)
                                  setSelectedTime(null)
                                }}
                                className={`flex h-7 items-center justify-center rounded-full text-[11px] transition sm:h-9 sm:text-sm ${
                                  selected
                                    ? 'bg-sky-brand font-bold text-navy-950'
                                    : bookable
                                      ? 'text-white hover:bg-white/10'
                                      : 'cursor-not-allowed text-white/15'
                                }`}
                              >
                                {Number(cell.date.slice(-2))}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="lg:hidden">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDate(null)
                            setSelectedTime(null)
                          }}
                          className="mb-3 text-xs font-semibold text-white hover:underline"
                        >
                          Change date
                        </button>
                        <div className="grid grid-cols-3 gap-2">
                          {BOOKING_SLOTS.map((time) => {
                            const taken = slotTaken(selectedDate, time)
                            const selected = selectedTime === time
                            return (
                              <button
                                key={time}
                                type="button"
                                disabled={taken}
                                onClick={() => setSelectedTime(time)}
                                className={`flex h-10 items-center justify-center border text-xs font-semibold transition ${
                                  taken
                                    ? 'cursor-not-allowed border-white/5 text-white/20 line-through'
                                    : selected
                                      ? 'border-sky-brand bg-sky-brand text-navy-950'
                                      : 'border-white/10 text-white/75 hover:border-white/40'
                                }`}
                              >
                                {formatSlotLabel(time)}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div className="hidden lg:block">
                        <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
                          <button
                            type="button"
                            onClick={prevMonth}
                            className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/70 hover:border-white/40 hover:text-white"
                            aria-label="Previous month"
                          >
                            ←
                          </button>
                          <span className="text-sm font-semibold text-white">{monthLabel}</span>
                          <button
                            type="button"
                            onClick={nextMonth}
                            className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/70 hover:border-white/40 hover:text-white"
                            aria-label="Next month"
                          >
                            →
                          </button>
                        </div>
                        <div className="rounded-lg border border-white/10 p-3">
                          <div className="mb-2 grid grid-cols-7 gap-1">
                            {WEEKDAYS.map((day) => (
                              <div
                                key={day}
                                className="py-1 text-center text-[10px] font-semibold uppercase text-white/30"
                              >
                                {day.slice(0, 1)}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {grid.map((cell, index) => {
                              if (!cell) return <div key={`empty-${index}`} />
                              const bookable = isBookableDate(cell.date)
                              const selected = selectedDate === cell.date
                              return (
                                <button
                                  key={cell.date}
                                  type="button"
                                  disabled={!bookable}
                                  onClick={() => {
                                    setSelectedDate(cell.date)
                                    setSelectedTime(null)
                                  }}
                                  className={`flex h-9 items-center justify-center rounded-full text-sm transition ${
                                    selected
                                      ? 'bg-sky-brand font-bold text-navy-950'
                                      : bookable
                                        ? 'text-white hover:bg-white/10'
                                        : 'cursor-not-allowed text-white/15'
                                  }`}
                                >
                                  {Number(cell.date.slice(-2))}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="hidden lg:block">
                        <p className="text-sm font-semibold text-white">{formatSelectedDate(selectedDate)}</p>
                        <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-2">
                          {BOOKING_SLOTS.map((time) => {
                            const taken = slotTaken(selectedDate, time)
                            const selected = selectedTime === time
                            return (
                              <button
                                key={time}
                                type="button"
                                disabled={taken}
                                onClick={() => setSelectedTime(time)}
                                className={`flex min-h-11 items-center justify-center border px-4 text-sm font-semibold transition ${
                                  taken
                                    ? 'cursor-not-allowed border-white/5 text-white/20 line-through'
                                    : selected
                                      ? 'border-sky-brand bg-sky-brand text-navy-950'
                                      : 'border-white/10 text-white/75 hover:border-white/40 hover:text-white'
                                }`}
                              >
                                {formatSlotLabel(time)}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : null}

            {step === 'details' ? (
              <form id="booking-details-form" onSubmit={(event) => void handleSubmit(event)}>
                <h2 className="font-semibold text-lg font-bold text-white sm:text-2xl">Your details</h2>
                <p className="mt-1 text-xs text-white/50 sm:mt-2 sm:text-sm">
                  Name and email for the confirmation.
                </p>

                <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
                  <label className="block text-sm text-white/70">
                    Name
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full rounded-sm border border-white/10 bg-navy-950 px-3 py-2.5 text-white outline-none focus:border-white/40 sm:mt-2 sm:px-4 sm:py-3"
                    />
                  </label>
                  <label className="block text-sm text-white/70">
                    Email
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-sm border border-white/10 bg-navy-950 px-3 py-2.5 text-white outline-none focus:border-white/40 sm:mt-2 sm:px-4 sm:py-3"
                    />
                  </label>
                  <label className="block text-sm text-white/70">
                    Phone <span className="text-white/35">(optional)</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1.5 w-full rounded-sm border border-white/10 bg-navy-950 px-3 py-2.5 text-white outline-none focus:border-white/40 sm:mt-2 sm:px-4 sm:py-3"
                    />
                  </label>
                  <label className="block text-sm text-white/70">
                    Notes <span className="text-white/35">(optional)</span>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder="Artist name, beat refs, what you need from the session"
                      className="mt-1.5 w-full resize-none rounded-sm border border-white/10 bg-navy-950 px-3 py-2.5 text-white outline-none focus:border-white/40 sm:mt-2 sm:px-4 sm:py-3"
                    />
                  </label>
                </div>
              </form>
            ) : null}
          </div>

        </div>

        <div className="hidden overflow-y-auto bg-navy-950/40 p-4 sm:p-6 lg:block">
          <BookingSummary
            sessionTypeId={sessionType}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        </div>
      </div>

      {mobileFooter}
      <div className="hidden shrink-0 lg:block">{footer}</div>
    </div>
  )
}
