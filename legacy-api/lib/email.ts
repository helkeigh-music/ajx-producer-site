type DeliveryEmail = {
  to: string
  beatTitle: string
  licenseTier: string
  downloadUrl: string
}

export async function sendBeatDeliveryEmail(payload: DeliveryEmail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.EMAIL_FROM?.trim() ?? 'prodbyajx <prodbyajx@gmail.com>'

  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured — skipping delivery email')
    return false
  }

  const tierLabel = payload.licenseTier.charAt(0).toUpperCase() + payload.licenseTier.slice(1)
  const html = `
    <div style="font-family: Inter, Arial, sans-serif; color: #0b1f3a; max-width: 560px;">
      <h1 style="font-size: 20px; margin-bottom: 8px;">Your beat is ready</h1>
      <p style="color: #334155; line-height: 1.6;">
        Thanks for purchasing <strong>${payload.beatTitle}</strong> (${tierLabel} license).
      </p>
      <p style="margin: 24px 0;">
        <a href="${payload.downloadUrl}" style="background: #38bdf8; color: #0b1f3a; padding: 12px 20px; border-radius: 999px; text-decoration: none; font-weight: 600;">
          Download files
        </a>
      </p>
      <p style="color: #64748b; font-size: 13px; line-height: 1.6;">
        Keep this link private. Reply to this email if you need an invoice or license PDF.
      </p>
    </div>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [payload.to],
      subject: `Your prodbyajx beat: ${payload.beatTitle}`,
      html,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('Resend error:', text)
    return false
  }

  return true
}

type BookingEmail = {
  id: string
  name: string
  email: string
  phone?: string
  sessionType: string
  sessionLabel: string
  date: string
  time: string
  notes?: string
}

function formatBookingWhen(date: string, time: string): string {
  const parsed = new Date(`${date}T${time}:00`)
  return parsed.toLocaleString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  })
}

export async function sendBookingEmails(booking: BookingEmail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.EMAIL_FROM?.trim() ?? 'prodbyajx <prodbyajx@gmail.com>'
  const notifyTo = process.env.BOOKING_NOTIFY_EMAIL?.trim() ?? 'prodbyajx@gmail.com'

  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured — skipping booking emails')
    return false
  }

  const when = formatBookingWhen(booking.date, booking.time)
  const phoneLine = booking.phone ? `<p><strong>Phone:</strong> ${booking.phone}</p>` : ''
  const notesLine = booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''

  const customerHtml = `
    <div style="font-family: Inter, Arial, sans-serif; color: #0b1f3a; max-width: 560px;">
      <h1 style="font-size: 20px; margin-bottom: 8px;">Session booked</h1>
      <p style="color: #334155; line-height: 1.6;">
        Hi ${booking.name}, your session with prodbyajx is confirmed.
      </p>
      <p style="color: #334155; line-height: 1.6;">
        <strong>${booking.sessionLabel}</strong><br />
        ${when} (UK time)
      </p>
      <p style="color: #64748b; font-size: 13px; line-height: 1.6;">
        Reply to this email if you need to reschedule. Reference: ${booking.id}
      </p>
    </div>
  `

  const notifyHtml = `
    <div style="font-family: Inter, Arial, sans-serif; color: #0b1f3a; max-width: 560px;">
      <h1 style="font-size: 20px; margin-bottom: 8px;">New booking</h1>
      <p><strong>${booking.sessionLabel}</strong> · ${when}</p>
      <p><strong>Name:</strong> ${booking.name}<br />
      <strong>Email:</strong> ${booking.email}</p>
      ${phoneLine}
      ${notesLine}
      <p style="color: #64748b; font-size: 13px;">Ref: ${booking.id}</p>
    </div>
  `

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  const [customerRes, notifyRes] = await Promise.all([
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from,
        to: [booking.email],
        subject: `prodbyajx session confirmed — ${booking.date} ${booking.time}`,
        html: customerHtml,
      }),
    }),
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from,
        to: [notifyTo],
        reply_to: booking.email,
        subject: `New prodbyajx booking: ${booking.name} · ${booking.date}`,
        html: notifyHtml,
      }),
    }),
  ])

  if (!customerRes.ok || !notifyRes.ok) {
    console.error('Booking email error:', await customerRes.text(), await notifyRes.text())
    return false
  }

  return true
}
