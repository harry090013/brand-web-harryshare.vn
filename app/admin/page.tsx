import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Boxes,
  MessageCircle,
  Package,
  PenLine,
  Plus,
  Tag,
} from 'lucide-react'

import { getAdminStats, getRecentPostsForAdmin } from '@/lib/posts'
import { getPostUrl } from '@/lib/urls'

function formatDate(date?: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('vi-VN')
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()
  const recentPosts = await getRecentPostsForAdmin()

  const cards = [
    {
      title: 'Quản lý bài viết',
      description: 'Xem, sửa, xóa và tạo bài viết mới.',
      href: '/admin/posts',
      icon: PenLine,
    },
    {
      title: 'Danh mục',
      description: `Quản lý ${stats.categories} danh mục bài viết.`,
      href: '/admin/categories',
      icon: Tag,
    },
    {
      title: 'Sản phẩm',
      description: `${stats.resources} sản phẩm / tài nguyên đang có.`,
      href: '/admin/products',
      icon: Package,
    },
  ]

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-emerald-900 md:text-6xl">
            Digital Sanctuary
          </h1>
          <p className="mt-2 font-[family-name:var(--font-serif)] text-xl italic text-zinc-500">
            Welcome back to your creative center.
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600"
        >
          <Plus size={17} className="mr-2" />
          Tạo bài mới
        </Link>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                  <Icon size={21} />
                </div>
                <ArrowRight
                  size={17}
                  className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-emerald-500"
                />
              </div>

              <h2 className="mt-8 font-[family-name:var(--font-serif)] text-2xl font-bold text-emerald-900">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {card.description}
              </p>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-4">
        <StatCard value={stats.publishedPosts} label="Bài đã xuất bản" />
        <StatCard value={stats.draftPosts} label="Bản nháp" />
        <StatCard value={stats.pendingComments} label="Bình luận chờ duyệt" tone="orange" />
        <StatCard value={0} label="Đơn hàng" />
      </div>

      <section className="mt-10 overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-emerald-900">
              Bài viết gần đây
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              {recentPosts.length} bài mới nhất trong hệ thống.
            </p>
          </div>

          <Link
            href="/admin/posts"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-[0.18em] text-zinc-400">
              <tr>
                <th className="px-6 py-4">Tiêu đề</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ngày đăng</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.map((post) => (
                <tr key={post.id} className="border-t border-black/5">
                  <td className="px-6 py-4">
                    <p className="max-w-sm truncate font-bold text-emerald-900">
                      {post.title}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {getPostUrl(post)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {post.categories?.name || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        post.published
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      {post.published ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {formatDate(post.published_at || post.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}

              {recentPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                    Chưa có bài viết nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function StatCard({
  value,
  label,
  tone = 'green',
}: {
  value: number
  label: string
  tone?: 'green' | 'orange'
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <p
        className={`text-3xl font-bold ${
          tone === 'orange' ? 'text-orange-500' : 'text-emerald-500'
        }`}
      >
        {value}
      </p>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
    </div>
  )
}