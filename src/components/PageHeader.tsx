'use client'
import type { ReactNode } from 'react'

type Props = {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ eyebrow, title, description, children }: Props) {
  return (
    <header className="max-w-2xl pb-10 sm:pb-12">
      {eyebrow ? <p className="ajx-label">{eyebrow}</p> : null}
      <h1 className={`page-h1 ${eyebrow ? 'mt-3' : ''}`}>{title}</h1>
      {description ? <p className="hero-sub mt-3 max-w-xl sm:mt-4">{description}</p> : null}
      {children}
    </header>
  )
}
