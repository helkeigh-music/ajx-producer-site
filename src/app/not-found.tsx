import { NotFoundPage } from '@/views/NotFound'
import { buildPageMetadata } from '@/lib/buildPageMetadata'

export const metadata = buildPageMetadata('/404')

export default function NotFound() {
  return <NotFoundPage />
}
