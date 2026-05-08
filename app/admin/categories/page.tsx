'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Category = {
  id?: string
  name: string
  slug: string
  description: string
}

const slugify = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')

const emptyForm: Category = { name: '', slug: '', description: '' }

export default function CategoriesAdmin() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<Category>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/login')
      else load()
    })
  }, [router])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { alert('Tên danh mục không được để trống!'); return }
    if (!form.slug.trim()) { alert('Slug không được để trống!'); return }
    setSaving(true)

    if (editingId) {
      const { error } = await supabase.from('categories').update(form).eq('id', editingId)
      if (error) { alert('Lỗi: ' + error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('categories').insert(form)
      if (error) { alert('Lỗi: ' + error.message); setSaving(false); return }
    }

    setForm(emptyForm)
    setEditingId(null)
    setSaving(false)
    await load()
  }

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id || null)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description })
  }

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Xóa danh mục "${cat.name}"?`)) return
    const { error } = await supabase.from('categories').delete().eq('id', cat.id)
    if (error) { alert('Lỗi: ' + error.message); return }
    await load()
  }

  const handleCancel = () => { setForm(emptyForm); setEditingId(null) }

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">Danh mục</p>
        <h1 className="text-4xl text-olive font-[family-name:var(--font-serif)]">Quản lý Danh mục</h1>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Form thêm/sửa (bên trái, 2/5) */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 sticky top-8">
            <h2 className="text-lg text-olive font-[family-name:var(--font-serif)] mb-6">
              {editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Tên danh mục *</label>
                <input
                  type="text"
                  placeholder="VD: Làm sản phẩm"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value, slug: editingId ? form.slug : slugify(e.target.value) })}
                  className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm text-olive focus:outline-none focus:border-sage transition"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Slug (URL) *</label>
                <input
                  type="text"
                  placeholder="VD: lam-san-pham"
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: slugify(e.target.value) })}
                  className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-xs text-gray-600 font-mono focus:outline-none focus:border-sage transition"
                />
                <p className="text-[10px] text-gray-400 mt-1">/chia-se?category={form.slug || '...'}</p>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Mô tả (không bắt buộc)</label>
                <textarea
                  placeholder="Mô tả ngắn về danh mục..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:border-sage resize-none transition"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-sage text-white py-2.5 rounded-lg text-sm font-medium hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm mới')}
              </button>
              {editingId && (
                <button onClick={handleCancel} className="px-4 py-2.5 border border-gray-200 text-olive rounded-lg text-sm hover:bg-gray-50 transition">
                  Hủy
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Danh sách (bên phải, 3/5) */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-olive font-medium">
                {loading ? 'Đang tải...' : `${categories.length} danh mục`}
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-sm text-gray-400">Đang tải danh mục...</div>
            ) : categories.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {categories.map(cat => (
                  <div key={cat.id} className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition group ${editingId === cat.id ? 'bg-cream' : ''}`}>
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="font-medium text-olive text-sm">{cat.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{cat.slug}</div>
                      {cat.description && (
                        <div className="text-xs text-gray-500 mt-1 truncate">{cat.description}</div>
                      )}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition shrink-0">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-1.5 text-gray-400 hover:text-sage transition rounded"
                        title="Sửa"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition rounded"
                        title="Xóa"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
