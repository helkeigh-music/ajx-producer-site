import Stripe from 'stripe'
import { sendBeatDeliveryEmail } from '@/lib/server/email'
import { leaseUrlForTier, readCatalog, removeBeatFromCatalog, type LicenseTier } from '@/lib/server/beatsStore'

export const maxDuration = 30

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()

  if (!secretKey || !webhookSecret) {
    return Response.json({ error: 'Stripe webhook not configured' }, { status: 500 })
  }

  const stripe = new Stripe(secretKey)
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const body = await req.text()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    return Response.json({ error: message }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return Response.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const beatId = session.metadata?.beatId
  const beatTitle = session.metadata?.beatTitle ?? 'your beat'
  const licenseTier = (session.metadata?.licenseTier ?? 'basic') as LicenseTier
  const customerEmail =
    session.customer_details?.email ?? session.customer_email ?? session.metadata?.customerEmail

  if (!beatId || !customerEmail) {
    console.warn('Webhook missing beatId or customer email', { beatId, customerEmail })
    return Response.json({ received: true })
  }

  const beats = await readCatalog()
  const beat = beats.find((item) => item.id === beatId)
  const downloadUrl = beat ? leaseUrlForTier(beat, licenseTier) : null

  if (downloadUrl) {
    await sendBeatDeliveryEmail({
      to: customerEmail,
      beatTitle,
      licenseTier,
      downloadUrl,
    })
  } else {
    console.warn('No lease file found for beat', beatId, licenseTier)
  }

  if (licenseTier === 'exclusive' && beat) {
    await removeBeatFromCatalog(beatId)
  }

  return Response.json({ received: true })
}
