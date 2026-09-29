import { AdminPage } from '@/views/Admin'
import { buildPageMetadata } from '@/lib/buildPageMetadata'

export const metadata = buildPageMetadata('/admin')

export default function Page() {
  return <AdminPage />
}
