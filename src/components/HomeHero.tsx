import { SITE } from '@/config/site'
import { PAGE_SEO } from '@/config/pageSeo'
import { STUDIO_PHOTOS } from '@/config/studioPhotos'
import { StudioPhoto } from '@/components/StudioPhoto'
import { BEATS_WHATSAPP_MESSAGE, ENQUIRE_WHATSAPP_MESSAGE, whatsAppHref } from '@/lib/whatsapp'

const HOME = PAGE_SEO['/']

const HERO_PHOTOS = [
  { photo: STUDIO_PHOTOS.keys, height: 'h-[42%]' },
  { photo: STUDIO_PHOTOS.patchbay, height: 'h-[74%]' },
  { photo: STUDIO_PHOTOS.drums, height: 'h-full' },
  { photo: STUDIO_PHOTOS.liveRoom, height: 'h-[68%]' },
  { photo: STUDIO_PHOTOS.controlRoom, height: 'h-[38%]' },
] as const

export function HomeHero() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden">
      <div className="ajx-container grid w-full items-center gap-6 py-8 sm:gap-10 sm:py-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10 lg:py-20">
        <div>
          <h1 className="page-h1">{HOME.h1}</h1>
          <p className="hero-sub mt-4 lg:mt-5">Custom beats, recording and mix. Store beats from £29.</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-8">
            <a
              href={whatsAppHref(ENQUIRE_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="ajx-btn-primary"
            >
              Enquire
            </a>
            <a
              href={whatsAppHref(BEATS_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="ajx-btn-ghost"
            >
              Browse beats
            </a>
          </div>

          <p className="mt-5 text-sm text-white/70 lg:mt-8">
            <a
              href={whatsAppHref(ENQUIRE_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              {SITE.email}
            </a>
            <span className="mx-2 text-white/30">·</span>
            <a href={`tel:${SITE.phoneTel}`} className="hover:text-white">
              {SITE.phone}
            </a>
          </p>
        </div>

        <ul
          className="-mx-5 flex h-56 w-[calc(100%+2.5rem)] items-center gap-2 px-4 sm:-mx-8 sm:h-64 sm:w-[calc(100%+4rem)] lg:mx-0 lg:h-[min(58vh,26rem)] lg:w-auto lg:px-0"
          aria-label="The studio"
        >
          {HERO_PHOTOS.map(({ photo, height }) => (
            <li
              key={photo.src}
              className={`min-w-0 flex-1 overflow-hidden rounded-full border border-white/10 ${height}`}
            >
              <StudioPhoto photo={photo} priority />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
