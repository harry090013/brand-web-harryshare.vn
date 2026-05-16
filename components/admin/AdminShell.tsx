'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  BookOpen,
  Boxes,
  ChevronRight,
  GraduationCap,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Package,
  ShoppingBag,
  Tag,
} from 'lucide-react'

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Quản lý bài',
    href: '/admin/posts',
    icon: BookOpen,
  },
  {
    label: 'Danh mục',
    href: '/admin/categories',
    icon: Tag,
  },
  {
    label: 'Sản phẩm',
    href: '/admin/products',
    icon: ShoppingBag,
  },
  {
    label: 'Khóa học',
    href: '/admin/courses',
    icon: GraduationCap,
  },
  {
    label: 'Đơn hàng',
    href: '/admin/orders',
    icon: Package,
  },
  {
    label: 'Bình luận',
    href: '/admin/comments',
    icon: MessageCircle,
  },
  {
    label: 'Liên hệ',
    href: '/admin/contacts',
    icon: Inbox,
  },
]

export default function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#F0FFF5] text-[#064E3B]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-emerald-950/10 bg-white/90 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col">
          <div className="px-7 py-8">
            <Link
              href="/admin"
              className="font-[family-name:var(--font-serif)] text-3xl font-bold tracking-[-0.04em] text-emerald-900"
            >
              Harry Share
            </Link>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400">
              Admin Sanctuary
            </p>
          </div>

          <nav className="flex-1 space-y-1 px-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const active =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-zinc-500 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={17} />
                    {item.label}
                  </span>
                  {active && <ChevronRight size={16} />}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-black/10 p-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-500 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Home size={17} />
              Xem website
            </Link>

            <Link
              href="/admin/logout"
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-zinc-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={17} />
              Đăng xuất
            </Link>

            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                HS
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">Harry Share</p>
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                  Admin
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-30 border-b border-emerald-950/10 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span>🌱 Hít một hơi thật sâu. Ở đây chỉ có sự bình yên và những câu chuyện thật...</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-600 transition hover:border-emerald-200 hover:text-emerald-700"
            >
              <Home size={14} />
              Xem website
            </Link>
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-4 py-10">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const active =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold ${
                  active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-zinc-500'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
