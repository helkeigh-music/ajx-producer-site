'use client'
const BARS = [0.4, 0.7, 1, 0.55, 0.85, 0.45, 0.95, 0.6, 0.75, 0.5, 0.9, 0.65, 0.8, 0.35, 0.7, 0.55, 1, 0.45, 0.85, 0.6]

export function Waveform({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-end justify-center gap-[3px] opacity-30 ${className}`}
      aria-hidden="true"
    >
      {BARS.map((scale, index) => (
        <span
          key={index}
          className="w-[3px] origin-bottom rounded-full bg-white/30"
          style={{
            height: `${scale * 48}px`,
            animationDelay: `${index * 0.07}s`,
          }}
        />
      ))}
    </div>
  )
}
