type Photo = {
  src: string
  alt: string
  label?: string
  position: string
}

export function StudioPhoto({
  photo,
  priority = false,
}: {
  photo: Photo
  priority?: boolean
}) {
  return (
    <img
      src={photo.src}
      alt={photo.alt}
      className={`h-full w-full object-cover ${photo.position}`}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      loading={priority ? 'eager' : 'lazy'}
    />
  )
}
