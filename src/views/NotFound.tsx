'use client'

import { PageHeader } from '@/components/PageHeader'
import { PAGE_SEO } from '@/config/pageSeo'

const NOT_FOUND = PAGE_SEO['/404']

export function NotFoundPage() {
  return (
    <div className="ajx-container py-16 sm:py-24">
      <PageHeader title={NOT_FOUND.h1} description={NOT_FOUND.description} />
      <a href="/" className="ajx-link mt-8 inline-block text-sm font-medium">
        Back to home
      </a>
    </div>
  )
}
