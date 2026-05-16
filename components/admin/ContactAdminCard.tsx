'use client'

import { useTransition } from 'react'
import { Archive, CheckCircle2, Mail, Trash2 } from 'lucide-react'

import type { ContactMessage } from '@/lib/posts'
import { deleteContact, updateContactStatus } from '@/app/admin/contacts/actions'

export default function ContactAdminCard({
  contact,
}: {
  contact: ContactMessage
}) {
  const [isPending, startTransition] = useTransition()

  function handleStatus(status: 'new' | 'read' | 'replied' | 'archived') {
    startTransition(async () => {
      await updateContactStatus(contact.id, status)
    })
  }

  function handleDelete() {
    const confirmed = window.confirm('Bạn chắc chắn muốn xóa liên hệ này?')
    if (!confirmed) return

    startTransition(async () => {
      await deleteContact(contact.id)
    })
  }

  return (
    <article className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-emerald-900">
              {contact.name}
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                contact.status === 'new'
                  ? 'bg-orange-100 text-orange-700'
                  : contact.status === 'replied'
                    ? 'bg-emerald-100 text-emerald-700'
                    : contact.status === 'archived'
                      ? 'bg-zinc-100 text-zinc-500'
                      : 'bg-blue-100 text-blue-700'
              }`}
            >
              {contact.status}
            </span>
          </div>

          <p className="mt-1 text-sm text-zinc-400">
            {new Date(contact.created_at).toLocaleString('vi-VN')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            disabled={isPending}
            onClick={() => handleStatus('read')}
            className="inline-flex items-center rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 disabled:opacity-50"
          >
            <CheckCircle2 size={14} className="mr-1" />
            Đã đọc
          </button>

          <button
            disabled={isPending}
            onClick={() => handleStatus('replied')}
            className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 disabled:opacity-50"
          >
            <Mail size={14} className="mr-1" />
            Đã trả lời
          </button>

          <button
            disabled={isPending}
            onClick={() => handleStatus('archived')}
            className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-600 disabled:opacity-50"
          >
            <Archive size={14} className="mr-1" />
            Lưu trữ
          </button>

          <button
            disabled={isPending}
            onClick={handleDelete}
            className="inline-flex items-center rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-600 disabled:opacity-50"
          >
            <Trash2 size={14} className="mr-1" />
            Xóa
          </button>
        </div>
      </div>

      {contact.subject && (
        <h3 className="mt-5 text-lg font-bold text-zinc-900">
          {contact.subject}
        </h3>
      )}

      <p className="mt-4 whitespace-pre-wrap leading-8 text-zinc-600">
        {contact.message}
      </p>

      <div className="mt-6 grid gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-zinc-600 md:grid-cols-2">
        <p>
          <span className="font-bold text-zinc-800">Email:</span>{' '}
          {contact.email || '—'}
        </p>
        <p>
          <span className="font-bold text-zinc-800">Phone:</span>{' '}
          {contact.phone || '—'}
        </p>
        <p>
          <span className="font-bold text-zinc-800">Source:</span>{' '}
          {contact.source || 'website'}
        </p>
      </div>
    </article>
  )
}
