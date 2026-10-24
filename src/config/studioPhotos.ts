/** Studio photos from Alex, 19 Oct 2026. All five sit in the homepage hero. */
export const STUDIO_PHOTOS = {
  keys: {
    src: '/images/studio/keys.jpg',
    alt: 'Red keyboard and outboard racks in the AJX studio',
    label: 'Keys',
    position: 'object-[center_68%]',
  },
  patchbay: {
    src: '/images/studio/patchbay.jpg',
    alt: 'Patchbay and console in the AJX studio',
    label: 'Patchbay',
    position: 'object-[center_62%]',
  },
  drums: {
    src: '/images/studio/drums.jpg',
    alt: 'Light blue drum kit in the live room',
    label: 'Drums',
    position: 'object-[center_58%]',
  },
  liveRoom: {
    src: '/images/studio/live-room.jpg',
    alt: 'Live room with a drum kit and keyboard',
    label: 'Live room',
    position: 'object-[center_48%]',
  },
  controlRoom: {
    src: '/images/studio/control-room.jpg',
    alt: 'Control room with a mixing desk and monitors',
    label: 'Control room',
    position: 'object-[center_58%] brightness-[1.65]',
  },
} as const

export const STUDIO_GALLERY = [
  STUDIO_PHOTOS.patchbay,
  STUDIO_PHOTOS.drums,
  STUDIO_PHOTOS.liveRoom,
  STUDIO_PHOTOS.controlRoom,
] as const
