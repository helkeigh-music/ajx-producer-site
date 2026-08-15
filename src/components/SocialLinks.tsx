import { SITE } from '@/config/site'

const links = [
  { label: 'Instagram', href: SITE.social.instagram },
  { label: 'YouTube', href: SITE.social.youtube },
  { label: 'Spotify', href: SITE.social.spotify },
  { label: 'TikTok', href: SITE.social.tiktok },
]

export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-4 text-sm ${className}`}>
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 transition hover:text-sky-brand"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
