import { HomePage } from '@/views/Home'
import { buildPageMetadata } from '@/lib/buildPageMetadata'

export const metadata = buildPageMetadata('/')

export default function Page() {
  return <HomePage />
}
