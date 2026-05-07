'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

// Editor chỉ load ở client, có kiểu chuẩn
const Editor = dynamic(() => import('@/components/TinyEditor'), {
  ssr: false,
  loading: () => <div className="p-4 text-sm text-gray-500">Đang tải editor...</div>
})

const slugify = (str: string) => {
  return str
    .toLowerCase()
    .normalize('NFD')                    // tách dấu: à -> a + ̀
    .replace(/[\u0300-\u036f]/g, '')     // xóa dấu
    .replace(/đ/g, 'd')                  // đ -> d
    .replace(/[^a-z0-9\s-]/g, '')        // bỏ ký tự lạ
    .trim()
    .replace(/\s+/g, '-')                // space -> -
    .replace(/-+/g, '-')                 // -- -> -
}

type Post = {
  id?: string; title: string; slug: string; excerpt: string;
  image: string; content: string; category: string; published: boolean;
  published_at?: string | null;
}
type Category = { name: string; slug: string }

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<Post>({ title:'', slug:'', excerpt:'', image:'', content:'', category:'chia-se', published:false, published_at:null })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const router = useRouter()
const [userChecked, setUserChecked] = useState(false)

useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    if (!data.session) router.replace('/login')
    else setUserChecked(true)
  })
}, [router])

  const formRef = useRef(form)
  useEffect(()=>{ formRef.current = form }, [form])

  const loadAll = async () => {
    setLoading(true)
    const { data: p } = await supabase.from('posts').select('*').order('created_at', { ascending:false })
    const { data: c } = await supabase.from('categories').select('name,slug').order('name')
    setPosts(p || [])
    setCats(c?.length? c : [{name:'Chia sẻ',slug:'chia-se'},{name:'Case study',slug:'case-study'}])
    setLoading(false)
  }
  useEffect(()=>{ loadAll() }, [])

  const selectPost = (p:any) => { setEditing(p.id); setForm({...p, published:!!p.published}) }
  const newPost = () => { setEditing(null); setForm({ title:'', slug:'', excerpt:'', image:'', content:'', category:'chia-se', published:false, published_at:null }) }
  const validate = () => { if(!form.title.trim()){alert('Thiếu tiêu đề');return false} if(!form.slug.trim()){alert('Thiếu slug');return false} if(!form.content.trim()){alert('Thiếu nội dung');return false} return true }

  const handleUpload = async (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if(!file) return
    setUploading(true)
    const name = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi,'-')}`
    const { error } = await supabase.storage.from('images').upload(name, file)
    if(error){ alert(error.message); setUploading(false); return }
    const { data } = supabase.storage.from('images').getPublicUrl(name)
    setForm(f=>({...f, image:data.publicUrl})); setUploading(false)
  }

  const savePost = async (silent=false) => {
    if(!validate()) return
    const payload = {...form, published_at: form.published? new Date().toISOString() : null}
    const q = editing? supabase.from('posts').update(payload).eq('id',editing) : supabase.from('posts').insert(payload).select().single()
    const { data, error } = await q
    if(error){ if(!silent) alert('LƯU LỖI: '+error.message); return }
    if(!editing && data) setEditing(data.id)
    await loadAll(); if(!silent) alert('✓ Đã lưu')
  }

  const duplicatePost = async () => {
    if(!editing) return
    const copy = {...form, title:form.title+' (copy)', slug:form.slug+'-copy-'+Date.now(), published:false, published_at:null}
    const { data } = await supabase.from('posts').insert(copy).select().single()
    await loadAll(); if(data) selectPost(data)
  }
  const deletePost = async () => {
    if(!editing ||!confirm('Xóa?')) return
    await supabase.from('posts').delete().eq('id',editing); await loadAll(); newPost()
  }

  // Auto-save 5s, dùng formRef để không bị ghi đè published
  useEffect(()=>{
    if(!editing) return
    const id = setInterval(async ()=>{
      const current = formRef.current
      if(!current.title) return
      await supabase.from('posts').update({...current, published_at: current.published? new Date().toISOString() : null}).eq('id', editing)
    }, 5000)
    return ()=> clearInterval(id)
  }, [editing])

  if (!userChecked) return <div className="p-10 text-center">Đang kiểm tra...</div>
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w- mx-auto p-4 grid lg:grid-cols-[280px_1fr_380px] gap-4">
        <div className="bg-white border rounded-xl p-3 h- overflow-auto">
          <div className="flex justify-between mb-2">
  <b>Bài viết</b>
  <div className="flex gap-2">
    <button onClick={newPost} className="text-xs border px-2 py-1 rounded">+ Mới</button>
    <button onClick={async()=>{await supabase.auth.signOut(); router.push('/login')}} className="text-xs border px-2 py-1 rounded text-red-600">Thoát</button>
  </div>
</div>
          {loading && <div className="text-xs text-gray-500">Đang tải...</div>}
          {posts.map(p=>(
            <div key={p.id} onClick={()=>selectPost(p)} className={`p-2 mb-1 rounded cursor-pointer text-sm ${editing===p.id?'bg-black text-white':'hover:bg-gray-100'}`}>
              {p.title} <span className="opacity-60">({p.published?'Đã đăng':'Nháp'})</span>
            </div>
          ))}
        </div>

        <div className="bg-white border rounded-xl p-4 h- overflow-auto">
          <div className="flex justify-between items-center mb-3">
            <h1 className="font-semibold">{editing?'Cập nhật bài viết':'Bài viết mới'}</h1>
            <span className="text-xs text-gray-500">Tự động lưu sau 5s</span>
          </div>
          <input className="w-full text-2xl font-bold border-0 border-b pb-2 mb-3 focus:outline-none" placeholder="Tiêu đề bài viết" value={form.title} onChange={e=>setForm({...form, title:e.target.value, slug: editing? form.slug : slugify(e.target.value)})}/>

          <div className="mb-4">
            <label className="text-sm font-medium">Tóm tắt</label>
            <textarea className="w-full mt-1 border rounded p-2 h-20 text-sm" value={form.excerpt} onChange={e=>setForm({...form, excerpt:e.target.value})}/>
          </div>

          <div>
            <label className="text-sm font-medium">Nội dung</label>
            <Editor
              key={editing || 'new'}
              apiKey="9i9hfqwabe50l20qj1sdwvnk3wxh7bzbxhl0e0dp4e5u8m2g"
              initialValue={form.content}
              onEditorChange={(html: string)=> setForm(f=>({...f, content: html}))}
              init={{
                height: 520,
                menubar: false,
                plugins: 'image link lists table code fullscreen wordcount',
                toolbar: 'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image table | removeformat code fullscreen',
                images_upload_handler: async (blobInfo: any) => {
                  const file = blobInfo.blob()
                  const name = `${Date.now()}-${blobInfo.filename()}`
                  const { error } = await supabase.storage.from('images').upload(name, file)
                  if(error) throw new Error(error.message)
                  const { data } = supabase.storage.from('images').getPublicUrl(name)
                  return data.publicUrl
                },
                content_style: 'body{font-family:Inter,sans-serif;font-size:15px;line-height:1.7} img{max-width:100%;height:auto;border-radius:8px}'
              }}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={()=>savePost()} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Lưu</button>
            {editing && <><button onClick={duplicatePost} className="px-3 py-2 border rounded text-sm">Nhân bản</button><button onClick={deletePost} className="px-3 py-2 border border-red-300 text-red-600 rounded text-sm">Xóa</button></>}
          </div>
        </div>

        <div className="space-y-4 h- overflow-auto">
          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-medium mb-2">Thông tin khác</h3>
            <label className="text-xs">Liên kết</label>
            <input className="w-full border rounded p-2 text-xs mb-2" value={`https://yourdomain.com/chia-se/${form.slug}`} readOnly/>
            <label className="text-xs">Slug (tự động)</label>
<input 
  className="w-full border rounded p-2 text-xs mb-2 font-mono" 
  value={form.slug} 
  onChange={e=>setForm({...form, slug: slugify(e.target.value)})}
/>
            
            <label className="text-xs">Danh mục</label>
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full border rounded p-2 text-sm mb-3">
              {cats.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm mb-3">
              <input type="checkbox" checked={form.published} onChange={e=>setForm({...form, published: e.target.checked})}/>
              Xuất bản ngay
            </label>
            <label className="text-xs">Ảnh đại diện</label>
            <div className="flex gap-2">
              <input className="flex-1 border rounded p-2 text-xs" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/>
              <label className="px-2 py-1 border rounded text-xs cursor-pointer">{uploading?'...':'Chọn'}<input type="file" hidden onChange={handleUpload}/></label>
            </div>
            {form.image && <img src={form.image} className="mt-2 rounded border h-24 object-cover w-full"/>}
          </div>
        </div>
      </div>
    </div>
  )
}