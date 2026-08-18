import {
  BOOKING_DAYS,
  BOOKING_MAX_ADVANCE_DAYS,
  BOOKING_MIN_ADVANCE_DAYS,
  BOOKING_SLOTS,
  BOOKING_TIMEZONE,
  SESSION_TYPES,
} from '@/config/booking'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function monthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

export function londonTodayKey(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: BOOKING_TIMEZONE })
}

export function weekdayIndex(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map(Number)
  const utc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
  const label = utc.toLocaleDateString('en-GB', { timeZone: BOOKING_TIMEZONE, weekday: 'short' })
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return map[label] ?? 0
}

export function daysFromToday(dateKey: string): number {
  const today = londonTodayKey()
  const a = new Date(`${today}T12:00:00`)
  const b = new Date(`${dateKey}T12:00:00`)
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

export function isBookableDate(dateKey: string): boolean {
  const advance = daysFromToday(dateKey)
  if (advance < BOOKING_MIN_ADVANCE_DAYS || advance > BOOKING_MAX_ADVANCE_DAYS) return false
  return BOOKING_DAYS.includes(weekdayIndex(dateKey) as (typeof BOOKING_DAYS)[number])
}

export function buildMonthGrid(year: number, month: number): Array<{ date: string } | null> {
  const cells: Array<{ date: string } | null> = []
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7

  for (let i = 0; i < firstDow; i++) cells.push(null)

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` })
  }

  return cells
}

export function formatSelectedDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  const utc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
  return utc.toLocaleDateString('en-GB', {
    timeZone: BOOKING_TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function formatSlotLabel(time: string): string {
  const [hour, minute] = time.split(':').map(Number)
  const utc = new Date(Date.UTC(2026, 0, 1, hour, minute, 0))
  return utc.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: BOOKING_TIMEZONE,
  })
}

export { SESSION_TYPES, BOOKING_SLOTS, WEEKDAYS }
