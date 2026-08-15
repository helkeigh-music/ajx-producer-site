import Stripe from 'stripe'
import { type LicenseTier, priceForTier } from './lib/beatsStore'
import { listBeats } from './lib/seedBeats'

const VALID_TIERS: LicenseTier[] = ['basic', 'premium', 'exclusive']

function siteUrl(): string {
  const configured = process.env.VITE_SITE_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:5173'
}

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim()
  if (!secretKey) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  let beatId = ''
  let licenseTier: LicenseTier = 'basic'
  try {
    const body = (await req.json()) as { beatId?: string; licenseTier?: string }
    beatId = body.beatId?.trim() ?? ''
    if (body.licenseTier && VALID_TIERS.includes(body.licenseTier as LicenseTier)) {
      licenseTier = body.licenseTier as LicenseTier
    }
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const beats = await listBeats()
  const beat = beats.find((b) => b.id === beatId)
  if (!beat) {
    return Response.json({ error: 'Beat not found' }, { status: 404 })
  }

  const amount = priceForTier(beat, licenseTier)
  const tierLabel = licenseTier.charAt(0).toUpperCase() + licenseTier.slice(1)
  const stripe = new Stripe(secretKey)
  const origin = siteUrl()

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_creation: 'always',
      success_url: `${origin}/beats?paid=1`,
      cancel_url: `${origin}/beats?canceled=1`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: amount * 100,
            product_data: {
              name: `${beat.title} — ${tierLabel} license`,
              description: `${beat.bpm} BPM · ${beat.key}`,
            },
          },
        },
      ],
      metadata: {
        beatId: beat.id,
        beatTitle: beat.title,
        licenseTier,
      },
    })

    if (!session.url) {
      return Response.json({ error: 'Could not create checkout session' }, { status: 500 })
    }

    return Response.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    return Response.json({ error: message }, { status: 500 })
  }
}
