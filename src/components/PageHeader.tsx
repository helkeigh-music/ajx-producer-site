'use client'
import type { ReactNode } from 'react'

type Props = {
  title: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: Props) {
  return (
    <header className="max-w-2xl pb-10 sm:pb-12">
      <h1 className="page-h1">{title}</h1>
      {description ? <p className="hero-sub mt-3 max-w-xl sm:mt-4">{description}</p> : null}
      {children}
    </header>
  )
}
