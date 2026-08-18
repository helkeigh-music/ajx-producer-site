import { list, put } from '@vercel/blob'

export type StoredBooking = {
  id: string
  name: string
  email: string
  phone?: string
  sessionType: string
  date: string
  time: string
  notes?: string
  createdAt: string
}

const BOOKINGS_PATH = 'ajx/bookings.json'

let memoryBookings: StoredBooking[] = []

export async function readBookings(): Promise<StoredBooking[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [...memoryBookings]

  try {
    const blobs = await list({ prefix: 'ajx/', limit: 100 })
    const catalogBlob = blobs.blobs.find((b) => b.pathname === BOOKINGS_PATH)
    if (!catalogBlob) return []

    const res = await fetch(catalogBlob.url)
    if (!res.ok) return []
    const data = (await res.json()) as { bookings: StoredBooking[] }
    return Array.isArray(data.bookings) ? data.bookings : []
  } catch {
    return []
  }
}

export async function writeBookings(bookings: StoredBooking[]): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN not configured')
  }

  await put(BOOKINGS_PATH, JSON.stringify({ bookings }, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  })
}

export async function addBooking(booking: StoredBooking): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    memoryBookings.push(booking)
    return
  }

  const bookings = await readBookings()
  bookings.push(booking)
  await writeBookings(bookings)
}

export function bookingId(): string {
  return `bk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
