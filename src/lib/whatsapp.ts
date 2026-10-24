/** Mobile inbox for wa.me links only. Do not render this string. */
const WHATSAPP_PHONE_TEL = '+447496181211'

/** Digits only, with UK country code, for wa.me links. */
export function whatsAppNumber(): string {
  const digits = WHATSAPP_PHONE_TEL.replace(/\D/g, '')
  if (digits.startsWith('0')) return `44${digits.slice(1)}`
  return digits
}

export function whatsAppHref(message: string): string {
  return `https://wa.me/${whatsAppNumber()}?text=${encodeURIComponent(message)}`
}

export const ENQUIRE_WHATSAPP_MESSAGE = "Hi Alex, I'd like to enquire about a studio session."

export const BEATS_WHATSAPP_MESSAGE = "Hi Alex, I'd like to check out your beats."

export function beatPurchaseWhatsAppMessage(input: { title: string; tier: string; priceGbp: number }): string {
  return `Hi Alex, I'd like to buy "${input.title}" (${input.tier}) for £${input.priceGbp}.`
}

export function bookingWhatsAppMessage(input: {
  sessionLabel: string
  duration: string
  when: string
  name: string
  email: string
  phone?: string
  notes?: string
}): string {
  const lines = [
    "Hi Alex, I'd like to book a session.",
    '',
    `${input.sessionLabel} (${input.duration})`,
    input.when,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
  ]
  if (input.phone) lines.push(`Phone: ${input.phone}`)
  if (input.notes) lines.push(`Notes: ${input.notes}`)
  return lines.join('\n')
}
