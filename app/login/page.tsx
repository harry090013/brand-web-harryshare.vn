'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const router = useRouter()

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) setErr(error.message)
    else window.location.href = '/admin' // Force full page load để middleware chạy lại
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <form onSubmit={login} className="bg-white p-8 rounded-2xl border shadow-sm w-full max-w-sm">
        <h1 className="text-xl font-bold mb-6">Đăng nhập Admin</h1>
        <input className="w-full border rounded p-2 mb-3" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border rounded p-2 mb-3" type="password" placeholder="Mật khẩu" value={pass} onChange={e=>setPass(e.target.value)} required />
        {err && <p className="text-red-600 text-sm mb-2">{err}</p>}
        <button className="w-full bg-black text-white py-2 rounded">Đăng nhập</button>
      </form>
    </div>
  )
}