import { PortfolioPage } from '@/views/Portfolio'
import { buildPageMetadata } from '@/lib/buildPageMetadata'

export const metadata = buildPageMetadata('/portfolio')

export default function Page() {
  return <PortfolioPage />
}
