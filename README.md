# AJX Producer Site

Minimal producer website for **AJX** — navy and sky blue brand, beat store with MP3 previews, Stripe checkout with license tiers, portfolio, booking calendar, admin uploads, and post-payment email delivery.

## Stack

- Vite + React + TypeScript + Tailwind
- Vercel serverless API routes
- Vercel Blob (beat MP3s, lease files, catalog JSON)
- Stripe Checkout + webhook (basic / premium / exclusive tiers)
- Resend (beat file delivery email)
- Cal.com embed for booking (`VITE_BOOKING_URL`)

## Local development

```bash
cd ajx-producer-site
cp .env.example .env
npm install
npm run dev
```

For API routes (upload, checkout, webhook, beat list):

```bash
npm run dev:vercel
```

Forward Stripe webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

## Environment

| Variable | Purpose |
|----------|---------|
| `VITE_SITE_URL` | Canonical site URL |
| `VITE_BOOKING_URL` | Cal.com booking page |
| `VITE_CONTACT_EMAIL` | Contact email shown in copy |
| `VITE_SOCIAL_*` | Instagram, YouTube, Spotify, TikTok URLs |
| `STRIPE_SECRET_KEY` | Stripe Checkout + webhook |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature verification |
| `RESEND_API_KEY` | Email beat files after payment |
| `EMAIL_FROM` | Sender address (verified in Resend) |
| `ADMIN_PASSWORD` | Admin upload gate |
| `BLOB_READ_WRITE_TOKEN` | MP3 previews + lease files + catalog |

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Hero, licensing overview, social links |
| `/beats` | Beat list, tier picker, player, Stripe checkout |
| `/portfolio` | Credits with artwork and optional audio clips |
| `/book` | Cal.com calendar embed |
| `/admin` | Upload beats (preview + lease file + tier prices) |

## Deploy (Vercel)

1. Push repo to GitHub
2. Import project in Vercel
3. Add env vars from `.env.example`
4. Enable **Vercel Blob** storage (Storage tab → create store → `BLOB_READ_WRITE_TOKEN` is auto-injected)
5. In Stripe Dashboard → Webhooks → add endpoint: `https://your-domain/api/webhook/stripe` with event `checkout.session.completed`
6. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## License tiers

| Tier | Typical includes |
|------|------------------|
| **Basic** | Tagged MP3, non-exclusive |
| **Premium** | WAV + stems, higher stream cap |
| **Exclusive** | Full buyout — beat removed from store after purchase |

## Brand

- Navy: `#0b1f3a`
- Sky: `#38bdf8`
- Logo: `public/logo.svg`
