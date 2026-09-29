import { BeatsPage } from '@/views/Beats'
import { buildPageMetadata } from '@/lib/buildPageMetadata'

export const metadata = buildPageMetadata('/beats')

export default function Page() {
  return <BeatsPage />
}
