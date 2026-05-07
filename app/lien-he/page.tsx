'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('contacts').insert(form)
    setSent(true)
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white border rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2">Liên hệ</h1>
          <p className="text-gray-600 mb-6">Có gì muốn nói với mình?</p>
          {sent? (
            <div className="bg-green-50 p-4 rounded-xl">Cảm ơn! Mình sẽ phản hồi sớm.</div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <input required placeholder="Tên" className="w-full border rounded-lg px-3 py-2"
                value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
              <input required type="email" placeholder="Email" className="w-full border rounded-lg px-3 py-2"
                value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
              <textarea required rows={5} placeholder="Tin nhắn" className="w-full border rounded-lg px-3 py-2"
                value={form.message} onChange={e=>setForm({...form, message:e.target.value})} />
              <button className="bg-black text-white px-6 py-2.5 rounded-lg">Gửi</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}