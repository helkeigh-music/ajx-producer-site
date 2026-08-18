const TAGS = [
  'Manchester producer',
  'UK type beats',
  'Trap beats',
  'Drill beats',
  'R&B instrumentals',
  'UK rap',
  'Sample flips',
  'Live sax',
  'Beat leasing',
  'Exclusive beats',
  'Studio sessions',
  'Mix & master',
]

export function TagMarquee() {
  const row = [...TAGS, ...TAGS]

  return (
    <div className="relative border-t border-white/10 bg-navy-950/50 py-3 overflow-hidden">
      <div className="flex w-max animate-marquee gap-3 px-4">
        {row.map((tag, index) => (
          <span key={`${tag}-${index}`} className="ajx-tag shrink-0">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
