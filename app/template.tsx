'use client'
import { usePathname } from 'next/navigation'

const SKIP_ANIMATION = ['/admin', '/login-admin']

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const skip = SKIP_ANIMATION.some(r => pathname.startsWith(r))

  if (skip) {
    return <>{children}</>
  }

  return (
    <div className="animate-page-in">
      {children}
    </div>
  )
}
