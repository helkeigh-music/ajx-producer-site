'use client'
type Props = {
  data: Record<string, unknown> | null
  id?: string
}

export function JsonLd({ data, id }: Props) {
  if (!data) return null
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" id={id} dangerouslySetInnerHTML={{ __html: json }} />
}
