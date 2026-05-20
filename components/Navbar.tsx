'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/ghi-chep', label: 'Ghi chép' },
  { href: '/chu-de', label: 'Chủ đề' },
  { href: '/du-an-tai-nguyen', label: 'Dự án & Tài nguyên' },
  { href: '/ve-harry', label: 'Về Harry' },
  { href: '/lien-he', label: 'Liên hệ' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[#FCFBF9]/85 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.01)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition hover:opacity-80">
          <Image
            src="/logo.png"
            alt="HarryShare"
            width={34}
            height={34}
            className="rounded-xl object-cover"
            priority
          />
          <span className="font-[family-name:var(--font-serif)] text-xl font-bold tracking-tight text-olive">
            HarryShare
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-5 transition ${
                  isActive
                    ? 'text-olive'
                    : 'text-zinc-500 hover:text-olive'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <Link
          href="/du-an-tai-nguyen"
          className="hidden rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-olive/30 hover:bg-white md:inline-flex"
        >
          Tài nguyên
        </Link>

        <button
          className="p-2 text-olive md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Mở menu"
          aria-expanded={open}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="absolute w-full border-t border-black/10 bg-[#FCFBF9] shadow-lg md:hidden">
          <div className="space-y-1 px-4 py-3">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/')

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-3 py-3 text-sm transition ${
                    isActive
                      ? 'bg-[#F0FDF4] font-semibold text-olive'
                      : 'text-zinc-600 hover:bg-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}