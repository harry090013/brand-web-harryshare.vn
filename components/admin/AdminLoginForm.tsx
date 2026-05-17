'use client'

import { useActionState } from 'react'
import { Lock } from 'lucide-react'
import { loginAdmin } from '@/app/login-admin/actions'

const initialState = {
  ok: false,
  message: '',
}

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState)

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label className="text-sm font-semibold text-zinc-700">
          Email admin
        </label>
        <input
          name="email"
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
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
        />
      </div>

      {state?.message && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Lock size={16} className="mr-2" />
        {pending ? 'Đang đăng nhập...' : 'Đăng nhập Admin'}
      </button>
    </form>
  )
}
