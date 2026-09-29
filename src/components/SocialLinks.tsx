'use client'
import { SITE } from '@/config/site'
import { InstagramIcon, SoundCloudIcon, YouTubeIcon } from '@/components/icons/SocialIcons'

const links = [
  { label: 'Instagram', href: SITE.social.instagram, Icon: InstagramIcon },
  { label: 'YouTube', href: SITE.social.youtube, Icon: YouTubeIcon },
  { label: 'SoundCloud', href: SITE.social.soundcloud, Icon: SoundCloudIcon },
].filter((link) => link.href.trim().length > 0)

export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-4 ${className}`}>
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="text-white/40 transition hover:text-sky-brand"
          >
            <Icon className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  )
}
