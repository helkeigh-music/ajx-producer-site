import { PrivacyPolicyPage } from '@/views/PrivacyPolicy'
import { buildPageMetadata } from '@/lib/buildPageMetadata'

export const metadata = buildPageMetadata('/privacy-policy')

export default function Page() {
  return <PrivacyPolicyPage />
}
