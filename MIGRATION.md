# Vite → Next.js App Router migration notes

**Status: dual-stack ready on branch `nextjs` (local only).**  
`npm run build` (Next + URL parity) and `npm run build:vite` both pass.  
**Not production-cutover.** Do not push, do not `vercel --prod`, do not change production DNS/env.

## Safety (hard rules)

- No `git push`, no production deploy, no production DNS/env changes.
- Vite sources and legacy `api/*.ts` remain until explicit cutover.
- `vercel.json` still targets **Vite** (`npm run build:vite` → `dist`) so an accidental deploy does not flip production to Next.
- Stripe / webhook / admin handlers are **copied** into `src/app/api/**/route.ts`; originals remain under `api/`.

## Env renames

| Old (Vite) | New (Next.js) |
|------------|---------------|
| `VITE_SITE_URL` | `NEXT_PUBLIC_SITE_URL` |
| `VITE_CONTACT_EMAIL` | `NEXT_PUBLIC_CONTACT_EMAIL` |
| `VITE_CONTACT_PHONE` | `NEXT_PUBLIC_CONTACT_PHONE` |
| `VITE_SOCIAL_INSTAGRAM` | `NEXT_PUBLIC_SOCIAL_INSTAGRAM` |
| `VITE_SOCIAL_YOUTUBE` | `NEXT_PUBLIC_SOCIAL_YOUTUBE` |
| `VITE_SOCIAL_SOUNDCLOUD` | `NEXT_PUBLIC_SOCIAL_SOUNDCLOUD` |
| `VITE_SOCIAL_SPOTIFY` | `NEXT_PUBLIC_SOCIAL_SPOTIFY` |
| `VITE_SOCIAL_TIKTOK` | `NEXT_PUBLIC_SOCIAL_TIKTOK` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| `VITE_GA_MEASUREMENT_ID` | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| `VITE_BOOKING_URL` | Unused in UI (booking is `/book`); optional / omit |

Unchanged server secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_PASSWORD`, `BLOB_READ_WRITE_TOKEN`, `ADMIN_ALLOWED_ORIGINS`, `BOOKING_NOTIFY_EMAIL`.

`src/lib/publicEnv.ts` reads **either** `NEXT_PUBLIC_*` or `VITE_*` so both builds work. **Do not rename Vercel production env vars until cutover.**

## Commands

| Script | Purpose |
|--------|---------|
| `npm run build` | `next build` + `scripts/verify-url-parity.mjs` |
| `npm run build:vite` | Original Vite production pipeline (what `vercel.json` still uses) |
| `npm run verify:urls` | URL parity only |
| `npm run dev` | Next.js (:3000) |
| `npm run dev:vite` | Vite SPA |
| `npm run dev:vercel` | Vercel CLI with legacy `api/` |

## Public URL paths (identical)

`/`, `/beats`, `/portfolio`, `/book`, `/admin` (+ Next `not-found`)

## API paths (identical)

- `GET /api/beats`
- `POST /api/checkout`
- `GET\|POST /api/booking`
- `POST /api/webhook/stripe`
- `POST /api/admin/beats`

## Verified locally

- [x] Next `src/app/**/page.tsx` for all public routes
- [x] `src/app/not-found.tsx` + `src/app/sitemap.ts`
- [x] `SiteShell` (Next) alongside Vite `Layout`
- [x] Dual env via `publicEnv`
- [x] `npm run build` green (Next + URL parity)
- [x] `npm run verify:urls` green
- [x] `npm run build:vite` green

## Gaps / not cut over yet

- [ ] Remove legacy `api/` + Vite entry (`index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`, `Layout` react-router) — **keep until explicit cutover**
- [ ] Flip `vercel.json` to Next — **keep Vite until cutover**
- [ ] Rename production Vercel env vars to `NEXT_PUBLIC_*` — **leave production alone**
- [ ] Shared in-app links currently use plain `<a href>` (works in Vite + Next; not `next/link` client transitions everywhere except `SiteShell` nav)
- [ ] Page UI modules live in `src/views/` (renamed from `src/pages/` so Next App Router does not treat them as Pages Router)
- [ ] Vite static HTML inject scripts (`injectStaticHtmlMeta`, `injectAnalytics`) only run under `build:vite`; Next uses `metadata` + client GA instead
- [ ] Local `.env` still has `VITE_*` keys (fine via dual reader); optional local `NEXT_PUBLIC_*` aliases not required for Vite

## Cutover checklist (later, explicit approval)

1. Preview deploy of `nextjs` only (no production)
2. Add `NEXT_PUBLIC_*` on preview; keep production Vite env untouched
3. Switch `vercel.json` to Next after preview OK
4. Then remove Vite/`api/` duplicates and drop `build:vite`
