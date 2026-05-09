'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Post = {
  id: string
  title: string
  slug: string
  category: string
  published: boolean
  published_at?: string | null
  updated_at?: string | null
  created_at?: string | null
}

type Category = { name: string; slug: string }

export default function PostManager() {
  const [posts, setPosts] = useState<Post[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterStatus, setFilterStatus] = useState<'' | 'published' | 'draft'>('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const router = useRouter()

  // ── Auth + Load ──
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/login'); return }

      const [{ data: p }, { data: c }] = await Promise.all([
        supabase.from('posts').select('id,title,slug,category,published,published_at,updated_at,created_at').order('updated_at', { ascending: false }),
        supabase.from('categories').select('name,slug').order('name'),
      ])
      if (p) setPosts(p)
      if (c && c.length > 0) setCats(c)
      setLoading(false)
    }
    init()
  }, [router])

  // ── Delete single ──
  const handleDelete = async (post: Post) => {
    if (!confirm(`Xóa bài viết "${post.title}"?\nHành động này không thể hoàn tác!`)) return
    setDeleting(post.id)
    const { error } = await supabase.from('posts').delete().eq('id', post.id)
    if (error) { alert('Lỗi: ' + error.message); setDeleting(null); return }
    setPosts(prev => prev.filter(p => p.id !== post.id))
    setSelectedIds(prev => { const s = new Set(prev); s.delete(post.id); return s })
    setDeleting(null)
  }

  // ── Delete selected ──
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Xóa ${selectedIds.size} bài viết đã chọn?\nHành động này không thể hoàn tác!`)) return
    const ids = Array.from(selectedIds)
    const { error } = await supabase.from('posts').delete().in('id', ids)
    if (error) { alert('Lỗi: ' + error.message); return }
    setPosts(prev => prev.filter(p => !selectedIds.has(p.id)))
    setSelectedIds(new Set())
  }

  // ── Toggle publish ──
  const togglePublish = async (post: Post) => {
    const newVal = !post.published
    const { error } = await supabase.from('posts').update({
      published: newVal,
      published_at: newVal ? (post.published_at || new Date().toISOString()) : null,
      updated_at: new Date().toISOString()
    }).eq('id', post.id)
    if (error) { alert('Lỗi: ' + error.message); return }
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: newVal, published_at: newVal ? (p.published_at || new Date().toISOString()) : null } : p))
  }

  // ── Filter ──
  const filtered = posts.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filterCat && p.category !== filterCat) return false
    if (filterStatus === 'published' && !p.published) return false
    if (filterStatus === 'draft' && p.published) return false
    return true
  })

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(filtered.map(p => p.id)))
  }

  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#FCFBF9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#14532D', fontSize: '1.5rem' }}>Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-cream flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <header className="h-16 border-b border-gray-200/50 flex items-center justify-between px-8 bg-cream shrink-0">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="text-2xl text-olive font-[family-name:var(--font-serif)]">Harry Share</Link>
          <nav className="hidden md:flex gap-1 text-sm">
            <Link href="/admin" className="px-3 py-1.5 rounded-lg text-gray-500 hover:text-olive hover:bg-white transition">Dashboard</Link>
            <Link href="/editor" className="px-3 py-1.5 rounded-lg bg-white text-olive font-medium shadow-sm">Quản lý bài</Link>
            <Link href="/editor/new" className="px-3 py-1.5 rounded-lg text-gray-500 hover:text-olive hover:bg-white transition">Tạo bài mới</Link>
          </nav>
        </div>
        <Link href="/editor/new"
          className="px-4 py-2 bg-sage text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Viết bài mới
        </Link>
      </header>

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-6xl mx-auto">

          {/* Stats mini */}
          <div className="flex items-center gap-6 mb-6">
            <h1 className="text-2xl text-olive font-[family-name:var(--font-serif)]">Quản lý bài viết</h1>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>{posts.length} tổng</span>
              <span className="text-sage">{posts.filter(p => p.published).length} đã xuất bản</span>
              <span>{posts.filter(p => !p.published).length} nháp</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Tìm theo tiêu đề..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-olive placeholder:text-gray-400 focus:outline-none focus:border-sage transition"
              />
            </div>

            {/* Category filter */}
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
              className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-olive focus:outline-none focus:border-sage transition"
            >
              <option value="">Tất cả danh mục</option>
              {cats.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as '' | 'published' | 'draft')}
              className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-olive focus:outline-none focus:border-sage transition"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Nháp</option>
            </select>

            {/* Bulk delete */}
            {selectedIds.size > 0 && (
              <button onClick={handleDeleteSelected}
                className="px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Xóa {selectedIds.size} bài
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FAFAF9] text-[9px] uppercase tracking-widest text-gray-400 border-b border-gray-100">
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-sage focus:ring-sage cursor-pointer" />
                  </th>
                  <th className="px-4 py-3 font-medium">Tiêu đề</th>
                  <th className="px-4 py-3 font-medium">Danh mục</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Cập nhật</th>
                  <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id} className={`border-b border-gray-50 transition group ${deleting === post.id ? 'opacity-40' : 'hover:bg-gray-50/40'}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedIds.has(post.id)} onChange={() => toggleSelect(post.id)}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-sage focus:ring-sage cursor-pointer" />
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/editor/${post.id}`} className="block">
                        <div className="font-medium text-olive text-sm max-w-xs truncate hover:text-sage transition">{post.title || 'Chưa có tiêu đề'}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-xs">/chia-se/{post.slug}</div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {cats.find(c => c.slug === post.category)?.name || post.category || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePublish(post)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-medium uppercase tracking-wide transition cursor-pointer ${
                          post.published ? 'bg-[#E8F0E4] text-sage hover:bg-[#d5e8cf]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-sage' : 'bg-gray-400'}`} />
                        {post.published ? 'Đã xuất bản' : 'Nháp'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {post.updated_at
                        ? new Date(post.updated_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                        : '—'
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {post.published && (
                          <Link href={`/chia-se/${post.slug}`} target="_blank"
                            className="p-2 text-gray-400 hover:text-sage rounded-lg hover:bg-gray-100 transition" title="Xem bài viết">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </Link>
                        )}
                        <Link href={`/editor/${post.id}`}
                          className="p-2 text-gray-400 hover:text-olive rounded-lg hover:bg-gray-100 transition" title="Chỉnh sửa">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </Link>
                        <button onClick={() => handleDelete(post)} disabled={deleting === post.id}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition disabled:opacity-50" title="Xóa">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                      {posts.length === 0
                        ? <>Chưa có bài viết nào. <Link href="/editor/new" className="text-sage hover:underline">Viết bài đầu tiên →</Link></>
                        : 'Không tìm thấy bài viết phù hợp.'
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Results count */}
          <div className="mt-4 text-xs text-gray-400">
            Hiển thị {filtered.length} / {posts.length} bài viết
          </div>
        </div>
      </div>
    </div>
  )
}
