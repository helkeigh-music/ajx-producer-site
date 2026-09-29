'use client'
import { DEFAULT_DISC_COVER } from '@/lib/covers'

type Props = {
  src?: string
  alt?: string
  className?: string
}

export function DiscCover({ src = DEFAULT_DISC_COVER, alt = '', className = '' }: Props) {
  return (
    <div
      className={`relative aspect-square shrink-0 overflow-hidden rounded-full border border-white/10 bg-navy-950 ${className}`}
    >
      <img src={src} alt={alt} className="size-full object-cover" draggable={false} />
    </div>
  )
}
