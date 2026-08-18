export type PageSeo = {
  title: string
  description: string
  h1: string
  eyebrow?: string
  pageLead?: string
  robots?: string
}

export const PAGE_SEO: Record<string, PageSeo> = {
  '/': {
    title: 'Type Beats Manchester | Trap, Drill & R&B | prodbyajx',
    description:
      'Manchester producer prodbyajx. Lease trap, drill and R&B type beats online. Studio sessions for custom beats, recording, mix and master.',
    h1: 'Type beats and production in Manchester',
    pageLead:
      'Trap, drill and R&B on the store from £29. Lease a beat or buy it exclusive. Book a session if you need something custom.',
  },
  '/beats': {
    title: 'Type Beats Manchester | Trap, Drill & R&B | prodbyajx',
    description:
      'Lease trap, drill and R&B type beats from Manchester. Preview free, checkout online, download link by email. Basic, premium and exclusive licenses.',
    h1: 'Beat store',
    pageLead: 'Preview any beat, pick a license, pay online. Your files arrive by email.',
  },
  '/portfolio': {
    title: 'Production & Type Beats | prodbyajx Manchester',
    description:
      'Type beats, sample flips and studio work from prodbyajx. UK rap, trap and drill production based in Manchester.',
    h1: 'Production and releases',
    pageLead: 'YouTube beats, sample flips and clips from recent sessions.',
  },
  '/book': {
    title: 'Book Studio Time Manchester | prodbyajx',
    description:
      'Book a 2-hour studio session in Manchester. Custom beats, recording, mix and master. Free to book. Confirmation by email.',
    h1: 'Book studio time',
    pageLead: 'Two hour slots, Monday to Saturday. I confirm every booking by email.',
  },
  '/admin': {
    title: 'Upload beats | prodbyajx',
    description: 'Admin upload for prodbyajx beat store.',
    h1: 'Upload beats',
    robots: 'noindex, nofollow',
  },
}

export function pageSeoForPath(pathname: string): PageSeo {
  return PAGE_SEO[pathname] ?? PAGE_SEO['/']
}
