import type { Beat, LicenseTier } from '@/config/site'
import { beatPriceForTier, LICENSE_TIERS } from '@/config/site'
import { createCheckout } from '@/lib/beats'
import { useState } from 'react'

type Props = {
  beat: Beat
  active: boolean
  onPlay: () => void
}

export function BeatCard({ beat, active, onPlay }: Props) {
  const [tier, setTier] = useState<LicenseTier>('basic')
  const [buying, setBuying] = useState(false)
  const price = beatPriceForTier(beat, tier)
  const tierInfo = LICENSE_TIERS.find((t) => t.id === tier)

  async function buy() {
    setBuying(true)
    const result = await createCheckout(beat.id, tier)
    setBuying(false)
    if ('url' in result) {
      window.location.href = result.url
      return
    }
    alert(result.error)
  }

  return (
    <article className={`ajx-card p-4 transition ${active ? 'border-sky-brand/40 ring-1 ring-sky-brand/20' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex gap-3">
          {beat.coverUrl ? (
            <img src={beat.coverUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
          ) : null}
          <div>
            <h3 className="text-base font-semibold text-white">{beat.title}</h3>
            <p className="mt-1 text-sm text-white/45">
              {beat.bpm} BPM · {beat.key}
            </p>
            {beat.tags.length ? (
              <p className="mt-2 text-xs uppercase tracking-wide text-sky-brand/80">{beat.tags.join(' · ')}</p>
            ) : null}
          </div>
        </div>
        <p className="text-sm font-semibold text-white">£{price}</p>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/40">License</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {LICENSE_TIERS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setTier(option.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                tier === option.id
                  ? 'bg-sky-brand text-navy-950'
                  : 'border border-white/10 text-white/60 hover:border-sky-brand/30 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {tierInfo ? <p className="mt-2 text-xs leading-relaxed text-white/45">{tierInfo.summary}</p> : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={onPlay} className="ajx-btn-ghost min-h-10 px-4 text-xs">
          {active ? 'Playing' : 'Preview'}
        </button>
        <button
          type="button"
          onClick={() => void buy()}
          disabled={buying}
          className="ajx-btn-primary min-h-10 px-4 text-xs disabled:opacity-60"
        >
          {buying ? 'Redirecting…' : `Buy ${tierInfo?.label.toLowerCase() ?? 'lease'}`}
        </button>
      </div>
    </article>
  )
}
