'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    exact: true,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: '/editor/new',
    label: 'Viết bài mới',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    href: '/admin/categories',
    label: 'Danh mục',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    href: '/admin/products',
    label: 'Sản phẩm',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    href: '/admin/courses',
    label: 'Khóa học',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422M12 14v7" />
      </svg>
    ),
  },
  {
    href: '/admin/orders',
    label: 'Đơn hàng',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    href: '/admin/comments',
    label: 'Bình luận',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* ── Sidebar ── */}
      <aside className="w-[240px] xl:w-[260px] bg-cream border-r border-gray-200/50 hidden md:flex flex-col shrink-0 fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="px-6 py-7 border-b border-gray-200/30">
          <Link href="/" className="block group">
            <h1 className="text-2xl font-[family-name:var(--font-serif)] text-olive">Harry Share</h1>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mt-1 group-hover:text-sage transition">Admin Sanctuary</p>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-0.5">
            {navItems.map(item => {
              const active = isActive(item)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#AEBFA8]/40 text-olive'
                      : 'text-gray-500 hover:text-olive hover:bg-gray-100/50'
                  }`}
                >
                  <span className={active ? 'text-sage' : 'opacity-60'}>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Divider */}
          <div className="mt-6 pt-4 border-t border-gray-200/40">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-olive hover:bg-gray-100/50 transition">
              <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Xem website
            </Link>
          </div>
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-200/40">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#AEBFA8]/40 flex items-center justify-center text-[10px] font-bold text-olive uppercase shrink-0">HS</div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-olive truncate">Harry Share</p>
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200/50 z-40 flex items-center justify-between px-4">
        <Link href="/admin" className="font-[family-name:var(--font-serif)] text-olive font-medium">Harry Share Admin</Link>
        <LogoutButton />
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-[240px] xl:ml-[260px] min-h-screen bg-cream-alt mt-14 md:mt-0">
        {children}
      </main>
    </div>
  )
}

// Logout Button (client component inline)
function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }
  return (
    <button onClick={handleLogout} className="text-[10px] text-gray-400 hover:text-red-500 uppercase tracking-wider transition">
      Đăng xuất
    </button>
  )
}
