'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

const Editor = dynamic(() => import('@/components/TinyEditor'), {
  ssr: false,
  loading: () => (
    <div className="p-10 text-center text-gray-400 font-[family-name:var(--font-serif)] italic text-xl animate-pulse">
      Preparing your canvas...
    </div>
  )
})

const slugify = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')

type Post = {
  id?: string
  title: string
  slug: string
  excerpt: string
  image: string
  content_html: string
  category: string
  published: boolean
  published_at?: string | null
}

type PostListItem = {
  id: string
  title: string
  slug: string
  category: string
  published: boolean
  updated_at?: string | null
}

const emptyPost: Post = {
  title: '', slug: '', excerpt: '', image: '',
  content_html: '', category: '', published: false, published_at: null
}

export default function FullscreenEditor() {
  const params = useParams()
  const router = useRouter()
  const rawId = params?.id
  const postId = rawId === 'new' ? null : (typeof rawId === 'string' ? rawId : null)



  const [form, setForm] = useState<Post>(emptyPost)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [cats, setCats] = useState<{ name: string; slug: string }[]>([])
  const [wordCount, setWordCount] = useState(0)
  const [allPosts, setAllPosts] = useState<PostListItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const formRef = useRef(form)

  useEffect(() => { formRef.current = form }, [form])

  // ──────────────────────────────────────────────────────────────
  // Init: check auth + load categories + load post (if editing)
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!params) return;
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/login'); return }

      const { data: c } = await supabase.from('categories').select('name,slug').order('name')
      const fallback = [
        { name: 'Làm sản phẩm', slug: 'lam-san-pham' },
        { name: 'Code thực chiến', slug: 'code' },
        { name: 'Nhật ký', slug: 'nhat-ky' },
      ]
      const catList = (c && c.length > 0) ? c : fallback
      setCats(catList)

      if (postId) {
        const { data: post, error } = await supabase.from('posts').select('*').eq('id', postId).single()
        if (error) { alert('Không tìm thấy bài viết'); router.replace('/admin'); return }
        setForm({ ...emptyPost, ...post, published: !!post.published })
      } else {
        // Set default category for new post
        setForm(f => ({ ...f, category: catList[0]?.slug || '' }))
      }
      // Load all posts for sidebar
      const { data: posts } = await supabase
        .from('posts')
        .select('id,title,slug,category,published,updated_at')
        .order('updated_at', { ascending: false })
      if (posts) setAllPosts(posts)

      setLoading(false)
    }
    init()
  }, [postId, router])

  // ──────────────────────────────────────────────────────────────
  // Auto-save every 10 seconds when editing existing post
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!postId) return
    const interval = setInterval(async () => {
      const current = formRef.current
      if (!current.title.trim()) return
      setSaveStatus('saving')
      const { error } = await supabase.from('posts')
        .update({ ...current, updated_at: new Date().toISOString() })
        .eq('id', postId)
      setSaveStatus(error ? 'error' : 'saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }, 10000)
    return () => clearInterval(interval)
  }, [postId])

  // ──────────────────────────────────────────────────────────────
  // Save / Publish
  // ──────────────────────────────────────────────────────────────
  const handleSave = async (publish: boolean) => {
    if (!form.title.trim()) { alert('Bài viết cần có tiêu đề!'); return }
    if (!form.slug.trim()) { alert('Bài viết cần có slug!'); return }
    setSaving(true)
    setSaveStatus('saving')

    const payload = {
      ...form,
      published: publish,
      published_at: publish ? (form.published_at || new Date().toISOString()) : null,
      updated_at: new Date().toISOString()
    }

    if (postId) {
      const { error } = await supabase.from('posts').update(payload).eq('id', postId)
      if (error) { alert('Lỗi khi lưu: ' + error.message); setSaveStatus('error') }
      else setSaveStatus('saved')
    } else {
      if (!form.content_html.trim()) { alert('Bài viết cần có nội dung!'); setSaving(false); setSaveStatus('idle'); return }
      const { data, error } = await supabase.from('posts').insert(payload).select().single()
      if (error) { alert('Lỗi khi tạo bài: ' + error.message); setSaveStatus('error') }
      else if (data) {
        setSaveStatus('saved')
        router.replace(`/editor/${data.id}`)
      }
    }

    setForm(f => ({ ...f, published: publish }))
    setSaving(false)
    setTimeout(() => setSaveStatus('idle'), 3000)
  }

  // ──────────────────────────────────────────────────────────────
  // Delete
  // ──────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!postId) return
    if (!confirm(`Bạn chắc chắn muốn XÓA bài viết "${form.title}"?\nHành động này không thể hoàn tác!`)) return
    const { error } = await supabase.from('posts').delete().eq('id', postId)
    if (error) { alert('Lỗi khi xóa: ' + error.message); return }
    router.replace('/admin')
  }

  // ──────────────────────────────────────────────────────────────
  // Image upload to Supabase Storage
  // ──────────────────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const ext = file.name.split('.').pop()
    const name = `posts/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('images').upload(name, file, { upsert: true })
    if (error) { alert('Upload lỗi: ' + error.message); return }
    const { data } = supabase.storage.from('images').getPublicUrl(name)
    setForm(f => ({ ...f, image: data.publicUrl }))
  }

  // ──────────────────────────────────────────────────────────────
  // TinyMCE image upload handler
  // ──────────────────────────────────────────────────────────────
  const tinyImageUpload = useCallback(async (blobInfo: any): Promise<string> => {
    const file = blobInfo.blob()
    const name = `posts/${Date.now()}-${blobInfo.filename()}`
    const { error } = await supabase.storage.from('images').upload(name, file)
    if (error) throw new Error(error.message)
    const { data } = supabase.storage.from('images').getPublicUrl(name)
    return data.publicUrl
  }, [])

  // ──────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#FCFBF9', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1 }}>
        <div style={{ color: '#14532D', fontSize: '1.5rem' }}>Loading editor...</div>
      </div>
    )
  }

  const saveStatusLabel = {
    idle: '',
    saving: 'Đang lưu...',
    saved: '✓ Đã lưu',
    error: '✗ Lỗi lưu',
  }[saveStatus]

  return (
    <div className="fixed inset-0 z-[100] bg-cream flex flex-col overflow-hidden">

      {/* ── Top Navbar ── */}
      <header className="h-16 border-b border-gray-200/50 flex items-center justify-between px-8 bg-cream shrink-0">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="text-2xl text-olive font-[family-name:var(--font-serif)]">Harry Share</Link>
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="/admin" className="text-gray-500 hover:text-olive transition">Dashboard</Link>
            <span className="text-olive font-medium border-b border-olive pb-1">Editor</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus !== 'idle' && (
            <span className={`text-xs ${saveStatus === 'saved' ? 'text-sage' : saveStatus === 'error' ? 'text-red-500' : 'text-gray-400'}`}>
              {saveStatusLabel}
            </span>
          )}
          {postId && (
            <Link href={`/chia-se/${form.slug}`} target="_blank"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm text-olive hover:bg-white transition">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              Preview
            </Link>
          )}
          <button onClick={() => handleSave(false)} disabled={saving}
            className="px-4 py-2 border border-gray-200 rounded-md text-sm text-olive hover:bg-white transition disabled:opacity-50">
            {saving ? 'Đang lưu...' : 'Save Draft'}
          </button>
          <button onClick={() => handleSave(true)} disabled={saving}
            className="px-4 py-2 bg-sage text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition disabled:opacity-50">
            {form.published ? 'Update' : 'Publish'}
          </button>
          {postId && (
            <button onClick={handleDelete}
              className="px-3 py-2 border border-red-200 text-red-500 rounded-md text-sm hover:bg-red-50 transition" title="Xóa bài viết">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
        </div>
      </header>

      {/* ── Main Body ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Left Sidebar: Post List ── */}
        {sidebarOpen && (
          <aside className="w-[280px] border-r border-gray-200/50 bg-white shrink-0 flex flex-col overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-olive uppercase tracking-widest">Bài viết</h3>
                <Link href="/editor/new"
                  className="w-7 h-7 bg-sage text-white rounded-lg flex items-center justify-center hover:bg-olive transition" title="Tạo bài mới">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </Link>
              </div>
              <div className="relative">
                <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  placeholder="Tìm bài viết..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-olive placeholder:text-gray-400 focus:outline-none focus:border-sage transition"
                />
              </div>
            </div>
            {/* Post List */}
            <div className="flex-1 overflow-y-auto">
              {allPosts
                .filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(p => {
                  const isActive = p.id === postId
                  return (
                    <Link key={p.id} href={`/editor/${p.id}`}
                      className={`block px-4 py-3 border-b border-gray-50 transition ${isActive ? 'bg-[#F0FDF4] border-l-2 border-l-sage' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${isActive ? 'text-olive font-medium' : 'text-gray-700'}`}>
                            {p.title || 'Chưa có tiêu đề'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${p.published ? 'bg-sage' : 'bg-gray-300'}`} />
                            <span className="text-[10px] text-gray-400">
                              {p.published ? 'Đã xuất bản' : 'Nháp'}
                            </span>
                            {p.category && <span className="text-[10px] text-gray-400">· {p.category}</span>}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })
              }
              {allPosts.length === 0 && (
                <div className="p-6 text-center text-xs text-gray-400">Chưa có bài viết nào</div>
              )}
            </div>
          </aside>
        )}

        {/* Toggle sidebar button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-6 bg-gray-50 hover:bg-gray-100 border-r border-gray-200/50 flex items-center justify-center shrink-0 transition"
          title={sidebarOpen ? 'Ẩn sidebar' : 'Hiện sidebar'}
        >
          <svg className={`w-3 h-3 text-gray-400 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* ── Editor Area ── */}
        <div className="flex-1 overflow-y-auto py-12 px-6 md:px-16">
          <div className="max-w-3xl mx-auto">

            {/* Title */}
            <input
              type="text"
              placeholder="Tiêu đề bài viết của bạn..."
              className="w-full text-4xl md:text-5xl font-[family-name:var(--font-serif)] text-olive bg-transparent border-none outline-none placeholder:text-gray-200 mb-4 leading-tight"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value, slug: postId ? form.slug : slugify(e.target.value) })}
            />

            <div className="flex items-center gap-3 text-[10px] text-gray-400 tracking-widest uppercase mb-10 pb-8 border-b border-gray-200/50">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              <span>•</span>
              <span>{cats.find(c => c.slug === form.category)?.name || form.category}</span>
              {form.published && <><span>•</span><span className="text-sage">Đã xuất bản</span></>}
            </div>

            {/* Content Editor */}
            <div className="min-h-[500px]">
              <Editor
                key={postId || 'new'}
                apiKey="9i9hfqwabe50l20qj1sdwvnk3wxh7bzbxhl0e0dp4e5u8m2g"
                value={form.content_html}
                onEditorChange={(html: string, editor: any) => {
                  setForm(f => ({ ...f, content_html: html }))
                  try { setWordCount(editor.plugins.wordcount.body.getWordCount()) } catch (_) {}
                }}
                init={{
                  height: 700,
                  menubar: false,
                  inline: true,
                  plugins: 'image link lists wordcount table codesample',
                  toolbar: 'bold italic underline | h2 h3 | bullist numlist | link image table codesample | removeformat',
                  placeholder: 'Bắt đầu viết tại đây... Hãy để ngôn từ chảy ra thật tự nhiên.',
                  images_upload_handler: tinyImageUpload,
                  content_style: `
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');
                    body { font-family: 'Inter', sans-serif; font-size: 1.125rem; line-height: 1.85; color: #4b5563; max-width: 100%; }
                    p { margin-bottom: 1.5em; }
                    h2 { font-family: Georgia, serif; font-size: 1.75rem; color: #2D372B; margin-top: 2.5em; margin-bottom: 0.5em; font-weight: normal; }
                    h3 { font-family: Georgia, serif; font-size: 1.375rem; color: #2D372B; margin-top: 2em; margin-bottom: 0.5em; font-weight: normal; }
                    img { max-width: 100%; height: auto; border-radius: 8px; }
                    a { color: #4A5D4E; text-decoration: underline; }
                    blockquote { border-left: 3px solid #4A5D4E; padding-left: 1.5em; font-style: italic; margin: 2em 0; color: #6b7280; }
                    pre { background: #f9f7f4; padding: 1.5em; border-radius: 8px; overflow-x: auto; font-size: 0.875rem; }
                  `,
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="w-[300px] xl:w-[340px] border-l border-gray-200/50 bg-[#FCFBF9] shrink-0 overflow-y-auto p-6 space-y-6">

          {/* Featured Image */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-3">Ảnh đại diện</h4>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-cream-alt border border-gray-200 group cursor-pointer">
              {form.image ? (
                <img src={form.image} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                  <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-xs">Chọn ảnh</span>
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <span className="text-xs text-white uppercase tracking-wider font-medium border border-white/50 px-3 py-1.5 rounded hover:bg-white/10">
                  {form.image ? 'Đổi ảnh' : 'Chọn ảnh'}
                </span>
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </label>
            </div>
            {form.image && (
              <button onClick={() => setForm(f => ({ ...f, image: '' }))} className="text-[10px] text-red-400 mt-2 hover:text-red-600">
                Xóa ảnh
              </button>
            )}
          </div>

          {/* Category */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-3">Danh mục</h4>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm text-olive focus:outline-none focus:border-sage transition"
            >
              {cats.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>

          {/* Excerpt */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-3">Tóm tắt (Excerpt)</h4>
            <textarea
              value={form.excerpt || ''}
              onChange={e => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Mô tả ngắn để hiển thị ngoài trang danh sách..."
              rows={4}
              className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm text-gray-600 focus:outline-none focus:border-sage resize-none transition"
            />
          </div>

          {/* Slug */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-3">Slug / URL</h4>
            <input
              type="text"
              value={form.slug}
              onChange={e => setForm({ ...form, slug: slugify(e.target.value) })}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-600 focus:outline-none focus:border-sage font-mono transition"
            />
            <p className="text-[10px] text-gray-400 mt-1">harryshare.vn/chia-se/{form.slug || '...'}</p>
          </div>

          {/* Publish Status Toggle */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-olive">Trạng thái</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{form.published ? 'Đang hiển thị công khai' : 'Bản nháp – chưa xuất bản'}</p>
              </div>
              <div className={`w-10 h-6 rounded-full flex items-center transition-colors cursor-pointer ${form.published ? 'bg-sage' : 'bg-gray-200'}`}
                onClick={() => setForm(f => ({ ...f, published: !f.published }))}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm mx-1 transition-transform ${form.published ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="pt-4 border-t border-gray-200/50 space-y-3">
            <div className="flex justify-between text-[10px] font-medium">
              <span className="text-gray-400 uppercase tracking-widest">Số từ</span>
              <span className="text-olive">{wordCount.toLocaleString()} từ</span>
            </div>
            <div className="flex justify-between text-[10px] font-medium">
              <span className="text-gray-400 uppercase tracking-widest">Thời gian đọc</span>
              <span className="text-olive">~{Math.max(1, Math.ceil(wordCount / 200))} phút</span>
            </div>
          </div>

        </aside>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .tox-tinymce-inline { z-index: 200 !important; border-radius: 8px !important; box-shadow: 0 4px 20px -4px rgba(0,0,0,0.1) !important; }
          .tox-editor-container { border: none !important; }
        `
      }} />
    </div>
  )
}
