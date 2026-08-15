type DeliveryEmail = {
  to: string
  beatTitle: string
  licenseTier: string
  downloadUrl: string
}

export async function sendBeatDeliveryEmail(payload: DeliveryEmail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.EMAIL_FROM?.trim() ?? 'AJX Beats <beats@ajxbeats.com>'

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
      subject: `Your AJX beat: ${payload.beatTitle}`,
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
