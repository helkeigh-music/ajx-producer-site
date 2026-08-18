export type SessionType = {
  id: string
  label: string
  duration: string
  summary: string
}

export const SESSION_TYPES: SessionType[] = [
  {
    id: 'studio',
    label: 'Studio session',
    duration: '2 hrs',
    summary: 'Production, recording or writing in the room.',
  },
  {
    id: 'custom-beat',
    label: 'Custom beat',
    duration: '2 hrs',
    summary: 'Send refs. We build a beat around your project.',
  },
  {
    id: 'mix',
    label: 'Mix / master',
    duration: '2 hrs',
    summary: 'Level check, mix, master, bounce for release.',
  },
]

/** Mon=1 … Sun=0 */
export const BOOKING_DAYS = [1, 2, 3, 4, 5, 6] as const

export const BOOKING_SLOTS = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'] as const

export const BOOKING_TIMEZONE = 'Europe/London'

export const BOOKING_MIN_ADVANCE_DAYS = 1

export const BOOKING_MAX_ADVANCE_DAYS = 60

export function sessionTypeById(id: string): SessionType | undefined {
  return SESSION_TYPES.find((type) => type.id === id)
}
