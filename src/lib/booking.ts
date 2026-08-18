export type BookedSlot = {
  date: string
  time: string
}

export type BookingRequest = {
  name: string
  email: string
  phone?: string
  sessionType: string
  date: string
  time: string
  notes?: string
}

export async function fetchBookedSlots(month: string): Promise<BookedSlot[]> {
  try {
    const res = await fetch(`/api/booking?month=${encodeURIComponent(month)}`)
    if (!res.ok) return []
    const data = (await res.json()) as { slots?: BookedSlot[] }
    return data.slots ?? []
  } catch {
    return []
  }
}

export async function submitBooking(
  payload: BookingRequest,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const res = await fetch('/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = (await res.json()) as { id?: string; error?: string }
  if (!res.ok || !data.id) return { ok: false, error: data.error ?? 'Booking failed' }
  return { ok: true, id: data.id }
}
