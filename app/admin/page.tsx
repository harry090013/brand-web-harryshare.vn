'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Post = {
  id: string; title: string; slug: string; category: string; published: boolean;
  published_at?: string | null;
}

type Stats = {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalCategories: number
  totalProducts: number
  pendingComments: number
  totalOrders: number
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [stats, setStats] = useState<Stats>({ totalPosts: 0, publishedPosts: 0, draftPosts: 0, totalCategories: 0, totalProducts: 0, pendingComments: 0, totalOrders: 0 })
  const [loading, setLoading] = useState(true)
  const [userChecked, setUserChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/login')
      else setUserChecked(true)
    })
  }, [router])

  useEffect(() => {
    if (!userChecked) return
    const loadAll = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/admin/stats')
        if (res.status === 401) { router.replace('/login'); return }
        if (!res.ok) throw new Error('Failed to load stats')
        const json = await res.json()
        const p: Post[] = json.posts || []
        setPosts(p)
        setStats({
          totalPosts: p.length,
          publishedPosts: p.filter(x => x.published).length,
          draftPosts: p.filter(x => !x.published).length,
          totalCategories: json.stats?.totalCategories || 0,
          totalProducts: json.stats?.totalProducts || 0,
          pendingComments: json.stats?.pendingComments || 0,
          totalOrders: json.stats?.totalOrders || 0,
        })
      } catch (err) {
        console.error('Admin load error:', err)
      }
      setLoading(false)
    }
    loadAll()
  }, [userChecked, router])

  if (!userChecked || loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-screen">
        <div className="text-olive font-[family-name:var(--font-serif)] text-2xl animate-pulse">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto pb-24 relative">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-12">
        <div>
          <h1 className="text-4xl text-olive font-[family-name:var(--font-serif)] mb-1">Digital Sanctuary</h1>
          <p className="text-gray-500 italic font-[family-name:var(--font-serif)]">Welcome back to your creative center.</p>
        </div>
        <Link href="/" target="_blank" className="bg-sage text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-opacity-90 transition inline-flex items-center gap-2 self-start md:self-auto">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          Xem website
        </Link>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <Link href="/editor" className="bg-cream border border-gray-200/60 rounded-2xl p-6 group hover:shadow-sm hover:bg-white transition block">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-[#AEBFA8]/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <span className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition text-lg">→</span>
          </div>
          <h3 className="text-xl text-olive font-[family-name:var(--font-serif)] mb-1">Quản lý bài viết</h3>
          <p className="text-xs text-gray-400 leading-relaxed">Xem, sửa, xóa và tạo bài viết mới.</p>
        </Link>

        <Link href="/admin/categories" className="bg-cream border border-gray-200/60 rounded-2xl p-6 group hover:shadow-sm hover:bg-white transition block">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-[#AEBFA8]/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            </div>
            <span className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition text-lg">→</span>
          </div>
          <h3 className="text-xl text-olive font-[family-name:var(--font-serif)] mb-1">Danh mục</h3>
          <p className="text-xs text-gray-400 leading-relaxed">Quản lý {stats.totalCategories} danh mục bài viết.</p>
        </Link>

        <Link href="/admin/products" className="bg-cream border border-gray-200/60 rounded-2xl p-6 group hover:shadow-sm hover:bg-white transition block">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-[#AEBFA8]/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <span className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition text-lg">→</span>
          </div>
          <h3 className="text-xl text-olive font-[family-name:var(--font-serif)] mb-1">Sản phẩm</h3>
          <p className="text-xs text-gray-400 leading-relaxed">{stats.totalProducts} sản phẩm đang có.</p>
        </Link>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Bài đã xuất bản', value: stats.publishedPosts, color: 'text-sage' },
          { label: 'Bản nháp', value: stats.draftPosts, color: 'text-olive' },
          { label: 'Bình luận chờ duyệt', value: stats.pendingComments, color: 'text-amber-600' },
          { label: 'Đơn hàng', value: stats.totalOrders, color: 'text-olive' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_6px_-4px_rgba(0,0,0,0.05)] p-5">
            <div className={`text-3xl font-[family-name:var(--font-serif)] ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Recent Entries Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-6 md:px-8 py-5 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl text-olive font-[family-name:var(--font-serif)]">Bài viết gần đây</h2>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">{stats.totalPosts} bài</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAFAF9] text-[9px] uppercase tracking-widest text-gray-400 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Tiêu đề</th>
                <th className="px-4 py-3 font-medium">Danh mục</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Ngày đăng</th>
                <th className="px-4 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-olive text-sm max-w-xs truncate">{post.title}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-xs">/chia-se/{post.slug}</div>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">{post.category || '—'}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-medium uppercase tracking-wide ${
                      post.published ? 'bg-[#E8F0E4] text-sage' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {post.published ? 'Đã xuất bản' : 'Nháp'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                      : '—'
                    }
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                      {post.published && (
                        <Link href={`/chia-se/${post.slug}`} target="_blank"
                          className="p-1.5 text-gray-400 hover:text-sage rounded transition" title="Xem bài viết">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </Link>
                      )}
                      <Link href={`/editor/${post.id}`}
                        className="p-1.5 text-gray-400 hover:text-olive rounded transition" title="Chỉnh sửa">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                    Chưa có bài viết nào. <Link href="/editor/new" className="text-sage hover:underline">Viết bài đầu tiên →</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Floating Add Button ── */}
      <Link href="/editor"
        className="fixed bottom-8 right-8 w-14 h-14 bg-sage text-white rounded-full flex items-center justify-center shadow-lg hover:bg-olive transition hover:scale-105 z-50"
        title="Viết bài mới">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  )
}