'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    const { error } = await supabase.from('contacts').insert({ ...form, read: false })
    setSending(false)
    if (error) { alert('Gửi thất bại: ' + error.message); return }
    setSent(true)
  }

  return (
    <div className="bg-cream min-h-screen py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white border border-gray-200/50 rounded-3xl p-8 md:p-12 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-[family-name:var(--font-serif)] text-olive mb-3">Kết nối với mình</h1>
            <p className="text-gray-500 text-sm">Có dự án hay câu chuyện thú vị? Hãy để lại lời nhắn nhé.</p>
          </div>

          {sent ? (
            <div className="bg-[#F0FDF4] border border-[#DCFCE7] text-[#166534] p-6 rounded-2xl text-center">
              <p className="font-medium">Cảm ơn bạn!</p>
              <p className="text-sm mt-1">Mình đã nhận được tin nhắn và sẽ phản hồi sớm.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Tên của bạn</label>
                  <input required placeholder="VD: Quang Hiếu" className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sage focus:bg-white transition"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Email</label>
                  <input required type="email" placeholder="hello@example.com" className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sage focus:bg-white transition"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Tin nhắn</label>
                <textarea required rows={5} placeholder="Bạn muốn nói gì..." className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sage focus:bg-white resize-none transition"
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <button disabled={sending} className="w-full bg-sage text-white px-6 py-3.5 rounded-xl font-medium text-sm hover:bg-opacity-90 transition disabled:opacity-50">
                {sending ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
