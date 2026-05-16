'use client'

import { useActionState } from 'react'
import { Send } from 'lucide-react'
import { submitContact } from '@/app/lien-he/actions'

const initialState = {
  ok: false,
  message: '',
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="text-sm font-semibold text-zinc-700">
          Tên của bạn
        </label>
        <input
          name="name"
          required
          placeholder="Harry"
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-olive"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-zinc-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="email@example.com"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-olive"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-zinc-700">
            Số điện thoại
          </label>
          <input
            name="phone"
            placeholder="Tuỳ chọn"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-olive"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-zinc-700">
          Chủ đề
        </label>
        <input
          name="subject"
          placeholder="Bạn muốn trao đổi về điều gì?"
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-olive"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-zinc-700">
          Nội dung
        </label>
        <textarea
          name="message"
          required
          rows={7}
          placeholder="Viết điều bạn muốn nhắn cho mình..."
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 leading-7 outline-none transition focus:border-olive"
        />
      </div>

      {state.message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            state.ok
              ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
              : 'border-red-100 bg-red-50 text-red-600'
          }`}
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-olive px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-olive/15 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        <Send size={16} className="mr-2" />
        {pending ? 'Đang gửi...' : 'Gửi liên hệ'}
      </button>
    </form>
  )
}
