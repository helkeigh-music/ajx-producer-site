import { DiscCover } from '@/components/DiscCover'
import type { Beat, LicenseTier } from '@/config/site'
import { beatPriceForTier, LICENSE_TIERS } from '@/config/site'
import { createCheckout } from '@/lib/beats'
import { useState } from 'react'

type Props = {
  beat: Beat
  index: number
  active: boolean
  onPlay: () => void
}

export function BeatCard({ beat, index, active, onPlay }: Props) {
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
    <article className={`ajx-card p-5 sm:p-6 ${active ? 'border-sky-brand/30' : ''}`}>
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="hidden ajx-meta text-white/25 sm:inline">{String(index).padStart(2, '0')}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <DiscCover src={beat.coverUrl} alt="" className="size-12 sm:size-14" />
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-white sm:text-lg">{beat.title}</h3>
                <p className="mt-1 ajx-meta">
                  {beat.bpm}bpm · {beat.key}
                </p>
                {beat.tags.length ? (
                  <p className="mt-2 ajx-label">{beat.tags.join(' / ')}</p>
                ) : null}
              </div>
            </div>
            <p className="text-xl font-bold tabular-nums text-white sm:text-right">£{price}</p>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4 sm:mt-5">
            <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3 sm:flex sm:flex-wrap">
              {LICENSE_TIERS.map((option) => {
                const tierPrice = beatPriceForTier(beat, option.id)
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTier(option.id)}
                    className={`min-h-10 rounded-lg border px-2 py-2 text-xs font-medium transition sm:px-3 ${
                      tier === option.id
                        ? 'border-sky-brand bg-sky-brand text-navy-950'
                        : 'border-white/15 text-white/60 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {option.label} · £{tierPrice}
                  </button>
                )
              })}
            </div>
            {tierInfo ? <p className="mt-2 text-xs leading-relaxed text-white/45 sm:text-sm">{tierInfo.summary}</p> : null}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button type="button" onClick={onPlay} className="ajx-btn-ghost min-h-10 !w-full px-3 sm:!w-auto sm:px-4">
              {active ? 'Playing' : 'Play'}
            </button>
            <button
              type="button"
              onClick={() => void buy()}
              disabled={buying}
              className="ajx-btn-primary min-h-10 !w-full px-3 disabled:opacity-50 sm:!w-auto sm:px-4"
            >
              {buying ? '…' : `Buy · £${price}`}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
