import { sendBookingEmails } from './lib/email'
import { addBooking, bookingId, readBookings, type StoredBooking } from './lib/bookingStore'

const VALID_SESSION_TYPES = new Set(['studio', 'custom-beat', 'mix'])
const VALID_TIMES = new Set(['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'])
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function monthRange(month: string): { start: string; end: string } | null {
  if (!/^\d{4}-\d{2}$/.test(month)) return null
  const [year, mon] = month.split('-').map(Number)
  const lastDay = new Date(Date.UTC(year, mon, 0)).getUTCDate()
  return {
    start: `${month}-01`,
    end: `${month}-${String(lastDay).padStart(2, '0')}`,
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const month = url.searchParams.get('month')?.trim() ?? ''
  const range = monthRange(month)
  if (!range) {
    return Response.json({ error: 'Use ?month=YYYY-MM' }, { status: 400 })
  }

  const bookings = await readBookings()
  const slots = bookings
    .filter((b) => b.date >= range.start && b.date <= range.end)
    .map((b) => ({ date: b.date, time: b.time }))

  return Response.json({ slots })
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  const phone = String(body.phone ?? '').trim()
  const sessionType = String(body.sessionType ?? '').trim()
  const date = String(body.date ?? '').trim()
  const time = String(body.time ?? '').trim()
  const notes = String(body.notes ?? '').trim()

  if (!name || name.length < 2) {
    return Response.json({ error: 'Enter your name' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Enter a valid email' }, { status: 400 })
  }
  if (!VALID_SESSION_TYPES.has(sessionType)) {
    return Response.json({ error: 'Pick a session type' }, { status: 400 })
  }
  if (!DATE_RE.test(date)) {
    return Response.json({ error: 'Pick a valid date' }, { status: 400 })
  }
  if (!VALID_TIMES.has(time)) {
    return Response.json({ error: 'Pick a valid time slot' }, { status: 400 })
  }

  const bookings = await readBookings()
  const taken = bookings.some((b) => b.date === date && b.time === time)
  if (taken) {
    return Response.json({ error: 'That slot was just taken — pick another time' }, { status: 409 })
  }

  const booking: StoredBooking = {
    id: bookingId(),
    name,
    email,
    phone: phone || undefined,
    sessionType,
    date,
    time,
    notes: notes || undefined,
    createdAt: new Date().toISOString(),
  }

  try {
    await addBooking(booking)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not save booking'
    return Response.json({ error: message }, { status: 500 })
  }

  void sendBookingEmails({
    id: booking.id,
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    sessionType: booking.sessionType,
    sessionLabel:
      booking.sessionType === 'studio'
        ? 'Studio session'
        : booking.sessionType === 'custom-beat'
          ? 'Custom beat'
          : 'Mix / master',
    date: booking.date,
    time: booking.time,
    notes: booking.notes,
  })

  return Response.json({ id: booking.id })
}
