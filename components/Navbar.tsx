'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [
    { href: '/chia-se', label: 'Chia sẻ' },
    { href: '/san-pham-cua-toi', label: 'Sản phẩm của tôi' },
    { href: '/san-pham-da-dung', label: 'Góc Review' },
    { href: '/about', label: 'Tôi là Ai' },
    { href: '/lien-he', label: 'Liên hệ' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">Harry Share</Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="hover:underline py-2">{l.label}</Link>
          ))}
          <Link href="/admin" className="text-blue-600 hover:underline py-2">Admin</Link>
        </nav>

        {/* Mobile button */}
        <button className="md:hidden p-2 -mr-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-1">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={()=>setOpen(false)} className="block py-2.5 text-sm border-b last:border-0">
                {l.label}
              </Link>
            ))}
            <Link href="/admin" onClick={()=>setOpen(false)} className="block py-2.5 text-sm text-blue-600">Admin</Link>
          </div>
        </div>
      )}
    </header>
  )
}