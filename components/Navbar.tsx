'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  
  const links = [
    { href: '/chia-se', label: 'Chia sẻ' },
    { href: '/san-pham-cua-toi', label: 'Sản phẩm của tôi' },
    { href: '/goc-review', label: 'Góc Review' },
    { href: '/about', label: 'Tôi là Ai' },
    { href: '/lien-he', label: 'Liên hệ' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <Image src="/logo.png" alt="Harry Share" width={32} height={32} className="rounded-lg object-cover" priority />
          <span className="font-[family-name:var(--font-serif)] font-bold text-xl text-olive">Harry Share</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map(l => {
            const isActive = pathname === l.href || pathname.startsWith(l.href + '/')
            return (
              <Link 
                key={l.href} 
                href={l.href} 
                className={`py-4 border-b-2 transition ${isActive ? 'border-sage text-sage' : 'border-transparent text-gray-500 hover:text-olive hover:border-gray-300'}`}
              >
                {l.label}
              </Link>
            )
          })}

        </nav>

        {/* Mobile button */}
        <button className="md:hidden p-2 -mr-2 text-olive" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white absolute w-full shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {links.map(l => {
              const isActive = pathname === l.href || pathname.startsWith(l.href + '/')
              return (
                <Link 
                  key={l.href} 
                  href={l.href} 
                  onClick={()=>setOpen(false)} 
                  className={`block px-3 py-3 text-sm rounded-lg transition ${isActive ? 'bg-[#F0FDF4] text-sage font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {l.label}
                </Link>
              )
            })}

          </div>
        </div>
      )}
    </header>
  )
}