'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@/components/TinyEditor'), {
  ssr: false,
  loading: () => <div className="p-10 text-center text-gray-400 font-[family-name:var(--font-serif)] italic text-sm animate-pulse">Đang tải công cụ soạn thảo...</div>
})

type Course = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  original_price: number;
  lessons_count: number;
  duration: string;
  content_html: string;
  published: boolean;
}

const emptyCourse: Course = {
  slug: '', title: '', description: '', thumbnail: '',
  price: 0, original_price: 0, lessons_count: 0, duration: '',
  content_html: '', published: false
}

const slugify = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')

export default function CoursesAdmin() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [form, setForm] = useState<Course>(emptyCourse)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Toggle form visibility for better UX
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/login')
      else load()
    })
  }, [router])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
    setCourses(data || [])
    setLoading(false)
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyCourse)
    setShowForm(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const name = `courses/thumb_${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('images').upload(name, file, { upsert: true })
    if (error) { alert('Upload lỗi: ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from('images').getPublicUrl(name)
    setForm(f => ({ ...f, thumbnail: data.publicUrl }))
    setUploading(false)
  }

  const tinyImageUpload = useCallback(async (blobInfo: any): Promise<string> => {
    const file = blobInfo.blob()
    const name = `courses/content_${Date.now()}-${blobInfo.filename()}`
    const { error } = await supabase.storage.from('images').upload(name, file)
    if (error) throw new Error(error.message)
    const { data } = supabase.storage.from('images').getPublicUrl(name)
    return data.publicUrl
  }, [])

  const saveCourse = async () => {
    if (!form.title.trim()) { alert('Tên khóa học không được để trống!'); return }
    setSaving(true)
    
    const payload = { 
      ...form, 
      slug: form.slug || slugify(form.title) 
    }
    
    if (editingId) {
      const { error } = await supabase.from('courses').update(payload).eq('id', editingId)
      if (error) { alert(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('courses').insert(payload)
      if (error) { alert(error.message); setSaving(false); return }
    }
    
    setSaving(false)
    resetForm()
    await load()
  }

  const deleteCourse = async (id: string, title: string) => {
    if (!confirm(`Bạn chắc chắn muốn XÓA khóa học "${title}"? Hành động này không thể hoàn tác.`)) return
    const { error } = await supabase.from('courses').delete().eq('id', id)
    if (error) { alert('Lỗi khi xóa: ' + error.message); return }
    await load()
  }

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">Đào tạo</p>
          <h1 className="text-4xl text-olive font-[family-name:var(--font-serif)]">Quản lý Khóa học</h1>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-olive text-white rounded-lg text-sm font-medium hover:bg-sage transition flex items-center gap-2 w-fit">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Tạo khóa học mới
          </button>
        )}
      </div>

      {showForm ? (
        /* ── Form Section ── */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-[#FCFBF9]">
            <h2 className="text-xl text-olive font-[family-name:var(--font-serif)]">
              {editingId ? 'Chỉnh sửa Khóa học' : 'Tạo Khóa học mới'}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            
            {/* Grid 2 Columns for Basic Info */}
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Tên khóa học *</label>
                  <input type="text" value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value, slug: editingId ? form.slug : slugify(e.target.value) })}
                    placeholder="VD: Next.js Thực chiến" className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage transition" />
                </div>
                
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Slug (URL)</label>
                  <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: slugify(e.target.value) })}
                    className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-sage transition" />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Mô tả ngắn</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage resize-none transition" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Số bài học</label>
                    <input type="number" value={form.lessons_count || ''} onChange={e => setForm({ ...form, lessons_count: parseInt(e.target.value) || 0 })}
                      className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage transition" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Thời lượng</label>
                    <input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                      placeholder="VD: 10 giờ 30 phút" className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage transition" />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Giá bán (VNĐ)</label>
                    <input type="number" value={form.price || ''} onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                      className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage transition text-olive font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Giá gốc (Gạch ngang)</label>
                    <input type="number" value={form.original_price || ''} onChange={e => setForm({ ...form, original_price: parseInt(e.target.value) || 0 })}
                      className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage transition text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">
                    Ảnh Thumbnail {uploading && <span className="text-sage normal-case">(Đang upload...)</span>}
                  </label>
                  <div className="flex gap-4 items-start">
                    {form.thumbnail && (
                      <div className="relative group shrink-0">
                        <img src={form.thumbnail} className="w-32 h-24 object-cover rounded-lg border border-gray-200" />
                        <button onClick={() => setForm({ ...form, thumbnail: '' })}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-200 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-red-50">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    )}
                    <label className="flex-1 flex flex-col items-center justify-center p-6 bg-cream border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer hover:border-sage hover:bg-sage/5 transition h-24">
                      <svg className="w-6 h-6 mb-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span>{form.thumbnail ? 'Đổi ảnh khác' : 'Chọn ảnh upload'}</span>
                      <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div className="bg-[#FCFBF9] p-4 rounded-xl border border-gray-100 mt-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-medium text-olive block">Trạng thái hiển thị</span>
                      <span className="text-xs text-gray-400 mt-0.5 block">{form.published ? 'Khóa học đang hiển thị công khai trên web' : 'Đang ẩn khỏi người dùng'}</span>
                    </div>
                    <div className={`w-11 h-6 rounded-full flex items-center transition-colors ${form.published ? 'bg-sage' : 'bg-gray-200'}`}
                      onClick={() => setForm(f => ({ ...f, published: !f.published }))}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow mx-1 transition-transform ${form.published ? 'translate-x-5' : ''}`} />
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Sale Page Editor (TinyMCE) */}
            <div className="pt-8 border-t border-gray-100">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-4">Nội dung chi tiết (Sale Page)</label>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <Editor
                  key={editingId || 'new'}
                  apiKey="9i9hfqwabe50l20qj1sdwvnk3wxh7bzbxhl0e0dp4e5u8m2g"
                  value={form.content_html}
                  onEditorChange={(html: string) => setForm(f => ({ ...f, content_html: html }))}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: 'image link lists table codesample',
                    toolbar: 'bold italic underline | h2 h3 | bullist numlist | link image table codesample | removeformat',
                    placeholder: 'Viết nội dung giới thiệu khóa học, lợi ích, chương trình học...',
                    images_upload_handler: tinyImageUpload,
                    content_style: `
                      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');
                      body { font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.6; color: #4b5563; }
                      h2 { font-family: Georgia, serif; color: #2D372B; font-weight: normal; }
                      h3 { font-family: Georgia, serif; color: #2D372B; font-weight: normal; }
                      img { max-width: 100%; border-radius: 8px; }
                    `,
                  }}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button onClick={resetForm} className="px-6 py-2.5 border border-gray-200 text-olive rounded-lg text-sm hover:bg-gray-50 transition">
                Hủy
              </button>
              <button onClick={saveCourse} disabled={saving}
                className="px-8 py-2.5 bg-sage text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {saving ? 'Đang lưu...' : (editingId ? 'Cập nhật Khóa học' : 'Tạo Khóa học')}
              </button>
            </div>

          </div>
        </div>
      ) : null}

      {/* ── Courses List ── */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center p-12 text-gray-400">Đang tải danh sách...</div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422M12 14v7m-3-3l6 0" /></svg>
            </div>
            <h3 className="text-lg font-medium text-olive mb-1">Chưa có khóa học nào</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">Tạo ngay một khóa học mới để bắt đầu chia sẻ kiến thức của bạn tới cộng đồng.</p>
            <button onClick={() => setShowForm(true)} className="px-6 py-2.5 bg-sage text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition">
              Tạo khóa học đầu tiên
            </button>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition group">
              
              {/* Thumbnail */}
              <div className="w-full md:w-64 aspect-video rounded-xl overflow-hidden bg-cream-alt shrink-0 relative">
                {course.thumbnail ? (
                  <img src={course.thumbnail} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                )}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${course.published ? 'bg-sage/90 text-white' : 'bg-white/80 text-gray-500'}`}>
                  {course.published ? 'Đã xuất bản' : 'Bản nháp'}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-[family-name:var(--font-serif)] text-olive mb-1 line-clamp-1">{course.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{course.description}</p>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => {
                      setForm(course);
                      setEditingId(course.id!);
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} className="w-8 h-8 flex items-center justify-center rounded bg-gray-50 text-gray-500 hover:text-sage hover:bg-[#E8F0E4] transition" title="Sửa">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => deleteCourse(course.id!, course.title)}
                      className="w-8 h-8 flex items-center justify-center rounded bg-gray-50 text-gray-500 hover:text-red-500 hover:bg-red-50 transition" title="Xóa">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-auto">
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-bold text-olive">{course.price ? `${course.price.toLocaleString('vi-VN')} đ` : 'Miễn phí'}</span>
                    {course.original_price > course.price && (
                      <span className="text-xs text-gray-400 line-through mb-1">{course.original_price.toLocaleString('vi-VN')} đ</span>
                    )}
                  </div>
                  
                  <div className="w-px h-4 bg-gray-200 hidden md:block"></div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    {course.lessons_count} bài học
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {course.duration || 'Chưa cập nhật'}
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .tox-tinymce { border-radius: 0.75rem !important; border-color: #f3f4f6 !important; }
          .tox .tox-toolbar__primary { background: #fcfbf9 !important; border-bottom: 1px solid #f3f4f6 !important; }
        `
      }} />
    </div>
  )
}
