import { BookPage } from '@/views/Book'
import { buildPageMetadata } from '@/lib/buildPageMetadata'

export const metadata = buildPageMetadata('/book')

export default function Page() {
  return <BookPage />
}
