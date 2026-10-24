# AJX Producer Site

Minimal producer website for **AJX** — navy and sky blue brand, beat store with MP3 previews, portfolio, booking calendar, password-gated beat uploads, and booking emails. Visitors message on WhatsApp to buy a beat.

## Stack

- Vite + React + TypeScript + Tailwind
- Vercel serverless API routes
- Vercel Blob (beat MP3s, lease files, catalog JSON)
- Resend (booking confirmation emails)
- WhatsApp for beat purchases and enquiries

## Local development

```bash
cd ajx-producer-site
cp .env.example .env
npm install
npm run dev
```

`npm run dev` serves the site and the upload, booking, and beat list API routes.

## Environment

| Variable | Purpose |
|----------|---------|
| `VITE_SITE_URL` | Canonical site URL |
| `VITE_BOOKING_URL` | Cal.com booking page |
| `VITE_CONTACT_EMAIL` | Contact email shown in copy |
| `VITE_SOCIAL_*` | Instagram, YouTube, Spotify, TikTok URLs |
| `RESEND_API_KEY` | Booking confirmation emails |
| `EMAIL_FROM` | Sender address (verified in Resend) |
| `ADMIN_PASSWORD` | Admin upload gate |
| `BLOB_READ_WRITE_TOKEN` | MP3 previews + lease files + catalog |

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Hero, licensing overview, social links |
| `/beats` | Beat list, tier picker, player. Buy opens WhatsApp |
| `/portfolio` | Credits with artwork and optional audio clips |
| `/book` | Cal.com calendar embed |
| `/admin` | Password-gated upload (preview, optional lease file, tier prices). Quiet footer link; not in the public header |

## Deploy (Vercel)

1. Push repo to GitHub
2. Import project in Vercel
3. Add env vars from `.env.example`
4. Enable **Vercel Blob** storage (Storage tab → create store → `BLOB_READ_WRITE_TOKEN` is auto-injected)

## License tiers

| Tier | Typical includes |
|------|------------------|
| **Basic** | Tagged MP3, non-exclusive |
| **Premium** | WAV + stems, higher stream cap |
| **Exclusive** | Full buyout |

## Brand

- Navy: `#0b1f3a`
- Sky: `#38bdf8`
- Logo: `public/logo.svg`
