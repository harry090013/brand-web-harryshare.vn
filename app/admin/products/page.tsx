'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Tab = 'owned' | 'affiliate'

type ProductOwned = {
  id?: string; slug: string; name: string; short_desc: string;
  content_html: string; price: number; category: string; images: string[]; published: boolean;
}

type ProductAffiliate = {
  id?: string; slug: string; name: string; description: string;
  affiliate_url: string; image: string; price: number; category: string; published: boolean;
}

const slugify = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')

const emptyOwned: ProductOwned = { slug: '', name: '', short_desc: '', content_html: '', price: 0, category: '', images: [], published: false }
const emptyAffiliate: ProductAffiliate = { slug: '', name: '', description: '', affiliate_url: '', image: '', price: 0, category: '', published: true }

export default function ProductsAdmin() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('owned')
  const [ownedList, setOwnedList] = useState<ProductOwned[]>([])
  const [affiliateList, setAffiliateList] = useState<ProductAffiliate[]>([])
  const [editOwned, setEditOwned] = useState<ProductOwned>(emptyOwned)
  const [editAffiliate, setEditAffiliate] = useState<ProductAffiliate>(emptyAffiliate)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/login')
      else load()
    })
  }, [router])

  const load = async () => {
    setLoading(true)
    const [{ data: o }, { data: a }] = await Promise.all([
      supabase.from('products_owned').select('*').order('created_at', { ascending: false }),
      supabase.from('products_affiliate').select('*').order('created_at', { ascending: false }),
    ])
    setOwnedList(o || [])
    setAffiliateList(a || [])
    setLoading(false)
  }

  const resetForm = () => {
    setEditingId(null)
    setEditOwned(emptyOwned)
    setEditAffiliate(emptyAffiliate)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const name = `products/${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('images').upload(name, file, { upsert: true })
    if (error) { alert('Upload lỗi: ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from('images').getPublicUrl(name)
    if (tab === 'owned') setEditOwned(f => ({ ...f, images: [...f.images, data.publicUrl] }))
    else setEditAffiliate(f => ({ ...f, image: data.publicUrl }))
    setUploading(false)
  }

  // ── Save Owned Product ──
  const saveOwned = async () => {
    if (!editOwned.name.trim()) { alert('Tên sản phẩm không được để trống!'); return }
    setSaving(true)
    const payload = { ...editOwned, slug: editOwned.slug || slugify(editOwned.name) }
    if (editingId) {
      const { error } = await supabase.from('products_owned').update(payload).eq('id', editingId)
      if (error) { alert(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('products_owned').insert(payload)
      if (error) { alert(error.message); setSaving(false); return }
    }
    setSaving(false); resetForm(); await load()
  }

  // ── Save Affiliate Product ──
  const saveAffiliate = async () => {
    if (!editAffiliate.name.trim()) { alert('Tên sản phẩm không được để trống!'); return }
    setSaving(true)
    const payload = { ...editAffiliate, slug: editAffiliate.slug || slugify(editAffiliate.name) }
    if (editingId) {
      const { error } = await supabase.from('products_affiliate').update(payload).eq('id', editingId)
      if (error) { alert(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('products_affiliate').insert(payload)
      if (error) { alert(error.message); setSaving(false); return }
    }
    setSaving(false); resetForm(); await load()
  }

  const deleteOwned = async (id: string, name: string) => {
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return
    await supabase.from('products_owned').delete().eq('id', id); await load()
  }

  const deleteAffiliate = async (id: string, name: string) => {
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return
    await supabase.from('products_affiliate').delete().eq('id', id); await load()
  }

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">Sản phẩm</p>
        <h1 className="text-4xl text-olive font-[family-name:var(--font-serif)]">Quản lý Sản phẩm</h1>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-gray-100/60 rounded-xl mb-8 w-fit">
        <button onClick={() => { setTab('owned'); resetForm() }}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${tab === 'owned' ? 'bg-white text-olive shadow-sm' : 'text-gray-500 hover:text-olive'}`}>
          Sản phẩm của tôi
        </button>
        <button onClick={() => { setTab('affiliate'); resetForm() }}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${tab === 'affiliate' ? 'bg-white text-olive shadow-sm' : 'text-gray-500 hover:text-olive'}`}>
          Affiliate / Review
        </button>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* ── Form Panel ── */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 sticky top-8">
            <h2 className="text-lg text-olive font-[family-name:var(--font-serif)] mb-6">
              {editingId ? 'Chỉnh sửa' : 'Thêm mới'}
            </h2>

            {tab === 'owned' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Tên sản phẩm *</label>
                  <input type="text" value={editOwned.name}
                    onChange={e => setEditOwned({ ...editOwned, name: e.target.value, slug: editingId ? editOwned.slug : slugify(e.target.value) })}
                    placeholder="VD: Notion Template" className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Slug</label>
                  <input type="text" value={editOwned.slug} onChange={e => setEditOwned({ ...editOwned, slug: slugify(e.target.value) })}
                    className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-sage" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Mô tả ngắn</label>
                  <textarea rows={3} value={editOwned.short_desc} onChange={e => setEditOwned({ ...editOwned, short_desc: e.target.value })}
                    className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage resize-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Danh mục</label>
                  <input
                    type="text"
                    list="product-categories"
                    value={editOwned.category}
                    onChange={e => setEditOwned({ ...editOwned, category: e.target.value })}
                    placeholder="VD: Template, Tài liệu, Khóa học..."
                    className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Giá (VNĐ)</label>
                  <input type="number" value={editOwned.price} onChange={e => setEditOwned({ ...editOwned, price: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">
                    Hình ảnh {uploading && <span className="text-sage">(Đang upload...)</span>}
                  </label>
                  <label className="flex items-center gap-2 w-full p-3 bg-cream border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer hover:border-sage transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Chọn ảnh để upload
                    <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                  </label>
                  {editOwned.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {editOwned.images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img src={img} className="w-16 h-16 object-cover rounded-lg border" />
                          <button onClick={() => setEditOwned(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 text-sm text-olive cursor-pointer">
                  <div className={`w-9 h-5 rounded-full flex items-center transition-colors ${editOwned.published ? 'bg-sage' : 'bg-gray-200'}`}
                    onClick={() => setEditOwned(f => ({ ...f, published: !f.published }))}>
                    <div className={`w-3.5 h-3.5 bg-white rounded-full shadow mx-0.5 transition-transform ${editOwned.published ? 'translate-x-4' : ''}`} />
                  </div>
                  <span className="text-xs">{editOwned.published ? 'Hiển thị công khai' : 'Ẩn'}</span>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Tên sản phẩm *</label>
                  <input type="text" value={editAffiliate.name}
                    onChange={e => setEditAffiliate({ ...editAffiliate, name: e.target.value, slug: editingId ? editAffiliate.slug : slugify(e.target.value) })}
                    className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Link Affiliate *</label>
                  <input type="url" value={editAffiliate.affiliate_url} onChange={e => setEditAffiliate({ ...editAffiliate, affiliate_url: e.target.value })}
                    placeholder="https://..." className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Mô tả</label>
                  <textarea rows={3} value={editAffiliate.description} onChange={e => setEditAffiliate({ ...editAffiliate, description: e.target.value })}
                    className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage resize-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Danh mục</label>
                  <input
                    type="text"
                    list="product-categories"
                    value={editAffiliate.category}
                    onChange={e => setEditAffiliate({ ...editAffiliate, category: e.target.value })}
                    placeholder="VD: Công cụ, Sách, Khóa học..."
                    className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage"
                  />
                  <datalist id="product-categories">
                    <option value="Template" />
                    <option value="Tài liệu" />
                    <option value="Công cụ" />
                    <option value="Sách" />
                    <option value="Khóa học" />
                    <option value="Phần mềm" />
                    <option value="Thiết bị" />
                  </datalist>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Giá (VNĐ)</label>
                  <input type="number" value={editAffiliate.price} onChange={e => setEditAffiliate({ ...editAffiliate, price: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 bg-cream border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">
                    Ảnh {uploading && <span className="text-sage">(Đang upload...)</span>}
                  </label>
                  <label className="flex items-center gap-2 w-full p-3 bg-cream border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer hover:border-sage transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Chọn ảnh để upload
                    <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                  </label>
                  {editAffiliate.image && <img src={editAffiliate.image} className="mt-2 w-full aspect-video object-cover rounded-lg border" />}
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-9 h-5 rounded-full flex items-center transition-colors ${editAffiliate.published ? 'bg-sage' : 'bg-gray-200'}`}
                    onClick={() => setEditAffiliate(f => ({ ...f, published: !f.published }))}>
                    <div className={`w-3.5 h-3.5 bg-white rounded-full shadow mx-0.5 transition-transform ${editAffiliate.published ? 'translate-x-4' : ''}`} />
                  </div>
                  <span className="text-xs text-olive">{editAffiliate.published ? 'Hiển thị' : 'Ẩn'}</span>
                </label>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={tab === 'owned' ? saveOwned : saveAffiliate} disabled={saving}
                className="flex-1 bg-sage text-white py-2.5 rounded-lg text-sm font-medium hover:bg-opacity-90 transition disabled:opacity-50">
                {saving ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm mới')}
              </button>
              {editingId && (
                <button onClick={resetForm} className="px-4 py-2.5 border border-gray-200 text-olive rounded-lg text-sm hover:bg-gray-50 transition">
                  Hủy
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Product List ── */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-olive font-medium text-sm">
                {loading ? 'Đang tải...' : tab === 'owned' ? `${ownedList.length} sản phẩm của tôi` : `${affiliateList.length} sản phẩm affiliate`}
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-sm text-gray-400">Đang tải...</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {(tab === 'owned' ? ownedList : affiliateList).map((p: any) => (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition group">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-cream-alt shrink-0">
                      {(tab === 'owned' ? p.images?.[0] : p.image) ? (
                        <img src={tab === 'owned' ? p.images[0] : p.image} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-olive text-sm truncate">{p.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
                        {p.price ? `${p.price.toLocaleString('vi-VN')} đ` : 'Miễn phí'}
                        {p.category && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 font-medium">{p.category}</span>
                        )}
                        <span className={`text-[9px] px-2 py-0.5 rounded-full ${p.published ? 'bg-[#E8F0E4] text-sage' : 'bg-gray-100 text-gray-500'}`}>
                          {p.published ? 'Hiển thị' : 'Ẩn'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                      <button onClick={() => {
                      setEditingId(p.id)
                        if (tab === 'owned') {
                          setEditOwned({ ...emptyOwned, ...p, category: p.category || '', images: p.images || [] })
                        } else {
                          setEditAffiliate({ ...emptyAffiliate, ...p, category: p.category || '', image: p.image || '' })
                        }
                      }} className="p-2 text-gray-400 hover:text-sage rounded-lg transition" title="Sửa">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => tab === 'owned' ? deleteOwned(p.id, p.name) : deleteAffiliate(p.id, p.name)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition" title="Xóa">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
                {(tab === 'owned' ? ownedList : affiliateList).length === 0 && (
                  <div className="p-8 text-center text-sm text-gray-400">Chưa có sản phẩm nào.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
