'use client'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const HIDDEN_ROUTES = ['/editor', '/admin', '/login-admin']

export default function LayoutShell({
  navbar,
  footer,
  children
}: {
  navbar: ReactNode
  footer: ReactNode
  children: ReactNode
}) {
  const pathname = usePathname()
  const hide = HIDDEN_ROUTES.some(r => pathname.startsWith(r))

  return (
    <>
      {!hide && navbar}
      <main className={hide ? '' : 'min-h-screen'}>{children}</main>
      {!hide && footer}
    </>
  )
}
