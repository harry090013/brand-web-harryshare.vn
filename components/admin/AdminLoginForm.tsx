'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function AdminLoginForm() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setPending(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setPending(false)

    if (error) {
      setMessage('Email hoặc mật khẩu không đúng.')
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label className="text-sm font-semibold text-zinc-700">
          Email admin
        </label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          required
          placeholder="admin@harryshare.vn"
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-zinc-700">
          Mật khẩu
        </label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          required
          placeholder="••••••••"
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
        />
      </div>

      {message && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Lock size={16} className="mr-2" />
        {pending ? 'Đang đăng nhập...' : 'Đăng nhập Admin'}
      </button>
    </form>
  )
}
