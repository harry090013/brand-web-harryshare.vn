import Link from 'next/link'
import { Plus } from 'lucide-react'

import { getPublishedPosts } from '@/lib/posts'
import { getPostUrl } from '@/lib/urls'

function formatDate(date?: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('vi-VN')
}

export default async function AdminPostsPage() {
  const posts = await getPublishedPosts()

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-500">
            Quản lý bài viết
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-emerald-900">
            Bài viết
          </h1>

          <p className="mt-4 max-w-2xl leading-8 text-zinc-500">
            Quản lý bài viết, SEO metadata, category, trạng thái xuất bản và các bài Start Here.
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

      <section className="mt-10 overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-[0.18em] text-zinc-400">
              <tr>
                <th className="px-6 py-4">Tiêu đề</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">SEO keyword</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ngày đăng</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => (
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

                  <td className="px-6 py-4 text-zinc-500">
                    {post.focus_keyword || '—'}
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
                    <div className="flex justify-end gap-4">
                      <Link
                        href={getPostUrl(post)}
                        className="font-bold text-zinc-500 hover:text-emerald-700"
                      >
                        Xem
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        Sửa
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
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
