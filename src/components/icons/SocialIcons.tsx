type IconProps = {
  className?: string
}

export function InstagramIcon({ className = 'size-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  )
}

export function YouTubeIcon({ className = 'size-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21.6 7.2a2.4 2.4 0 0 0-1.7-1.7C18 5 12 5 12 5s-6 0-7.9.5A2.4 2.4 0 0 0 2.4 7.2 25 25 0 0 0 2 12a25 25 0 0 0 .4 4.8 2.4 2.4 0 0 0 1.7 1.7C6 19 12 19 12 19s6 0 7.9-.5a2.4 2.4 0 0 0 1.7-1.7A25 25 0 0 0 22 12a25 25 0 0 0-.4-4.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M10 15.2V8.8L15.8 12 10 15.2Z" fill="currentColor" />
    </svg>
  )
}

export function SoundCloudIcon({ className = 'size-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.5 12.8c-.2 0-.4.2-.4.5v2.4c0 .3.2.5.4.5.3 0 .5-.2.5-.5v-2.4c0-.3-.2-.5-.5-.5Z" />
      <path d="M6.3 11.8c-.3 0-.5.2-.5.5v4.4c0 .3.2.5.5.5.3 0 .5-.2.5-.5v-4.4c0-.3-.2-.5-.5-.5Z" />
      <path d="M8.1 11.1c-.3 0-.5.2-.5.5v5.8c0 .3.2.5.5.5.3 0 .5-.2.5-.5v-5.8c0-.3-.2-.5-.5-.5Z" />
      <path d="M9.9 10.3c-.3 0-.5.2-.5.5v7.4c0 .3.2.5.5.5.3 0 .5-.2.5-.5v-7.4c0-.3-.2-.5-.5-.5Z" />
      <path d="M11.7 9.8c-.3 0-.5.2-.5.5v8.4c0 .3.2.5.5.5.3 0 .5-.2.5-.5V10.3c0-.3-.2-.5-.5-.5Z" />
      <path d="M13.5 9.5c-.3 0-.5.2-.5.5v9c0 .3.2.5.5.5.3 0 .5-.2.5-.5V10c0-.3-.2-.5-.5-.5Z" />
      <path d="M15.3 9.8c-.3 0-.5.2-.5.5v8.4c0 .3.2.5.5.5.3 0 .5-.2.5-.5v-8.4c0-.3-.2-.5-.5-.5Z" />
      <path d="M17.1 10.5c-.3 0-.5.2-.5.5v7c0 .3.2.5.5.5.8 0 1.4-.6 1.4-1.4 0-.8-.6-1.4-1.4-1.4Z" />
      <path d="M18.9 11.4c-.3 0-.5.2-.5.5v5.2c0 .3.2.5.5.5 1.2 0 2.1-1 2.1-2.1 0-1.2-.9-2.1-2.1-2.1Z" />
    </svg>
  )
}
