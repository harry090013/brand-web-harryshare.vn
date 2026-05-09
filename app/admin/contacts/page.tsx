'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Contact = {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  read?: boolean
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Contact | null>(null)
  const [filter, setFilter] = useState<'' | 'unread' | 'read'>('')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setContacts(data)
      setLoading(false)
    }
    load()
  }, [])

  const markRead = async (contact: Contact) => {
    await supabase.from('contacts').update({ read: true }).eq('id', contact.id)
    setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, read: true } : c))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa tin nhắn này?')) return
    const { error } = await supabase.from('contacts').delete().eq('id', id)
    if (error) { alert('Lỗi: ' + error.message); return }
    setContacts(prev => prev.filter(c => c.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const filtered = contacts.filter(c => {
    if (filter === 'unread') return !c.read
    if (filter === 'read') return c.read
    return true
  })

  const unreadCount = contacts.filter(c => !c.read).length

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-screen">
        <div className="text-olive font-[family-name:var(--font-serif)] text-2xl animate-pulse">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl text-olive font-[family-name:var(--font-serif)] mb-1">Tin nhắn liên hệ</h1>
          <p className="text-sm text-gray-500">
            {contacts.length} tin nhắn · <span className="text-sage font-medium">{unreadCount} chưa đọc</span>
          </p>
        </div>
        <div className="flex gap-2">
          {['', 'unread', 'read'].map(f => (
            <button key={f} onClick={() => setFilter(f as typeof filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === f ? 'bg-white text-olive shadow-sm' : 'text-gray-500 hover:text-olive hover:bg-white'}`}>
              {f === '' ? 'Tất cả' : f === 'unread' ? 'Chưa đọc' : 'Đã đọc'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">

        {/* List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-400">
              {contacts.length === 0 ? 'Chưa có tin nhắn liên hệ nào.' : 'Không có tin nhắn phù hợp.'}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(c => (
                <div key={c.id}
                  onClick={() => { setSelected(c); if (!c.read) markRead(c) }}
                  className={`px-5 py-4 cursor-pointer transition group ${
                    selected?.id === c.id ? 'bg-[#F0FDF4]' : 'hover:bg-gray-50/50'
                  } ${!c.read ? 'border-l-3 border-l-sage' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!c.read && <span className="w-2 h-2 bg-sage rounded-full shrink-0" />}
                        <span className={`text-sm truncate ${!c.read ? 'font-semibold text-olive' : 'text-gray-700'}`}>
                          {c.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{c.email}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{c.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {new Date(c.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                      </span>
                      <button onClick={e => { e.stopPropagation(); handleDelete(c.id) }}
                        className="p-1 text-gray-300 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition" title="Xóa">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 h-fit lg:sticky lg:top-8">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-[family-name:var(--font-serif)] text-olive">{selected.name}</h3>
                <span className={`text-[9px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full ${selected.read ? 'bg-gray-100 text-gray-500' : 'bg-[#E8F0E4] text-sage'}`}>
                  {selected.read ? 'Đã đọc' : 'Mới'}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${selected.email}`} className="text-sage hover:underline">{selected.email}</a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(selected.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Bangkok' })}
                </div>
              </div>

              <div className="bg-cream rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">Nội dung</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <a href={`mailto:${selected.email}?subject=Re: Liên hệ từ Harry Share`}
                  className="flex-1 text-center px-4 py-2 bg-sage text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition">
                  Trả lời email
                </a>
                <button onClick={() => handleDelete(selected.id)}
                  className="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition">
                  Xóa
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Chọn một tin nhắn để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
