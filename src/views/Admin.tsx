'use client'
import { useState, type FormEvent } from 'react'
import { PAGE_SEO } from '@/config/pageSeo'
import { PageHeader } from '@/components/PageHeader'
import { DEFAULT_TIER_PRICES, LICENSE_TIERS } from '@/config/site'

const ADMIN = PAGE_SEO['/admin']

type UploadState = 'idle' | 'uploading' | 'done' | 'error'

export function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [status, setStatus] = useState<UploadState>('idle')
  const [message, setMessage] = useState('')

  async function login(e: FormEvent) {
    e.preventDefault()
    if (!password.trim()) {
      setMessage('Enter admin password.')
      return
    }
    setAuthed(true)
    setMessage('')
  }

  async function upload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('uploading')
    setMessage('')

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set('password', password)

    try {
      const res = await fetch('/api/admin/beats', {
        method: 'POST',
        body: formData,
      })
      const data = (await res.json()) as { ok?: boolean; error?: string; beat?: { title: string } }
      if (!res.ok || !data.ok) {
        setStatus('error')
        setMessage(data.error ?? 'Upload failed')
        return
      }
      setStatus('done')
      setMessage(`Uploaded “${data.beat?.title ?? 'beat'}”.`)
      form.reset()
    } catch {
      setStatus('error')
      setMessage('Upload failed. Run with `npm run dev` (Next) or `npm run dev:vercel` for API routes locally.')
    }
  }

  if (!authed) {
    return (
      <div className="ajx-container py-16 sm:py-20">
        <div className="mx-auto max-w-md ajx-card p-6">
          <p className="page-eyebrow">{ADMIN.eyebrow ?? 'Admin'}</p>
          <h1 className="page-h1 mt-3 text-3xl">Sign in</h1>
          <p className="mt-2 text-sm text-white/55">Upload beats, lease files, and pricing.</p>
          <form onSubmit={login} className="mt-6 space-y-4">
            <label className="block text-sm text-white/70">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-navy-950 px-4 py-3 text-white outline-none focus:border-white/40"
              />
            </label>
            <button type="submit" className="ajx-btn-primary w-full">
              Continue
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="ajx-container py-12 sm:py-16">
      <PageHeader
        eyebrow={ADMIN.eyebrow ?? 'Admin'}
        title={ADMIN.h1}
        description="MP3 preview powers the live waveform. Lease files go out by email after purchase."
      />

      <form onSubmit={upload} className="mt-10 max-w-xl space-y-4 ajx-card p-6">
        <label className="block text-sm text-white/70">
          Title
          <input
            name="title"
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-navy-950 px-4 py-3 text-white outline-none focus:border-white/40"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-white/70">
            BPM
            <input
              name="bpm"
              type="number"
              min={40}
              max={220}
              required
              defaultValue={140}
              className="mt-2 w-full rounded-xl border border-white/10 bg-navy-950 px-4 py-3 text-white outline-none focus:border-white/40"
            />
          </label>
          <label className="block text-sm text-white/70">
            Key
            <input
              name="key"
              required
              placeholder="F# min"
              className="mt-2 w-full rounded-xl border border-white/10 bg-navy-950 px-4 py-3 text-white outline-none focus:border-white/40"
            />
          </label>
        </div>
        <label className="block text-sm text-white/70">
          Base price (£), basic tier fallback
          <input
            name="priceGbp"
            type="number"
            min={1}
            step={1}
            required
            defaultValue={DEFAULT_TIER_PRICES.basic}
            className="mt-2 w-full rounded-xl border border-white/10 bg-navy-950 px-4 py-3 text-white outline-none focus:border-white/40"
          />
        </label>
        <fieldset className="space-y-3">
          <legend className="text-sm text-white/70">Tier prices (£)</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {LICENSE_TIERS.map((tier) => (
              <label key={tier.id} className="block text-xs text-white/55">
                {tier.label}
                <input
                  name={`price_${tier.id}`}
                  type="number"
                  min={1}
                  step={1}
                  defaultValue={DEFAULT_TIER_PRICES[tier.id]}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-navy-950 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
                />
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm text-white/70">
          Tags (comma separated)
          <input
            name="tags"
            placeholder="trap, dark"
            className="mt-2 w-full rounded-xl border border-white/10 bg-navy-950 px-4 py-3 text-white outline-none focus:border-white/40"
          />
        </label>
        <label className="block text-sm text-white/70">
          SoundCloud or YouTube link (embedded preview)
          <input
            name="embedUrl"
            type="url"
            placeholder="https://soundcloud.com/user-335209347/..."
            className="mt-2 w-full rounded-xl border border-white/10 bg-navy-950 px-4 py-3 text-white outline-none focus:border-white/40"
          />
        </label>
        <label className="block text-sm text-white/70">
          MP3 preview (optional if embed link added)
          <input
            name="previewFile"
            type="file"
            accept="audio/mpeg,audio/mp3,.mp3"
            className="mt-2 block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-sky-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-navy-950"
          />
        </label>
        <label className="block text-sm text-white/70">
          Lease file (ZIP/WAV, emailed after purchase)
          <input
            name="leaseFile"
            type="file"
            accept=".zip,.wav,audio/wav,application/zip"
            className="mt-2 block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
        </label>
        <button type="submit" disabled={status === 'uploading'} className="ajx-btn-primary w-full disabled:opacity-60">
          {status === 'uploading' ? 'Uploading…' : 'Publish beat'}
        </button>
        {message ? (
          <p className={`text-sm ${status === 'error' ? 'text-red-300' : 'text-white/80'}`}>{message}</p>
        ) : null}
      </form>
    </div>
  )
}
