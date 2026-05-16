'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { CheckCircle2, Eye, Trash2, XCircle } from 'lucide-react'

import type { CommentItem } from '@/lib/posts'
import {
  deleteComment,
  replyToComment,
  updateCommentApproval,
} from '@/app/admin/comments/actions'

export default function CommentAdminCard({
  comment,
}: {
  comment: CommentItem
}) {
  const [isPending, startTransition] = useTransition()
  const [reply, setReply] = useState(comment.reply_content || '')
  const [message, setMessage] = useState('')

  function handleApprove(approved: boolean) {
    startTransition(async () => {
      await updateCommentApproval(comment.id, approved)
    })
  }

  function handleDelete() {
    const confirmed = window.confirm('Bạn chắc chắn muốn xóa bình luận này?')
    if (!confirmed) return

    startTransition(async () => {
      await deleteComment(comment.id)
    })
  }

  function handleReply() {
    setMessage('')

    startTransition(async () => {
      const result = await replyToComment(comment.id, reply)
      setMessage(result.message)
    })
  }

  return (
    <article className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-emerald-900">
              {comment.name}
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                comment.approved
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              {comment.approved ? 'Đã duyệt' : 'Chờ duyệt'}
            </span>
          </div>

          <p className="mt-1 text-sm text-zinc-400">
            {new Date(comment.created_at).toLocaleString('vi-VN')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {!comment.approved ? (
            <button
              disabled={isPending}
              onClick={() => handleApprove(true)}
              className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 disabled:opacity-50"
            >
              <CheckCircle2 size={14} className="mr-1" />
              Duyệt
            </button>
          ) : (
            <button
              disabled={isPending}
              onClick={() => handleApprove(false)}
              className="inline-flex items-center rounded-full bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600 disabled:opacity-50"
            >
              <XCircle size={14} className="mr-1" />
              Ẩn
            </button>
          )}

          {comment.posts && (
            <Link
              href={`/chia-se/${comment.posts.slug}`}
              className="inline-flex items-center rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600"
            >
              <Eye size={14} className="mr-1" />
              Xem bài
            </Link>
          )}

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

      <p className="mt-5 whitespace-pre-wrap leading-8 text-zinc-600">
        {comment.content}
      </p>

      <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
        <label className="text-sm font-bold text-emerald-800">
          Trả lời bình luận
        </label>

        <textarea
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          rows={4}
          placeholder="Viết phản hồi của Harry..."
          className="mt-3 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-emerald-500"
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={isPending}
            onClick={handleReply}
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Đang lưu...' : 'Lưu trả lời'}
          </button>

          {comment.replied_at && (
            <p className="text-xs text-emerald-700">
              Đã trả lời lúc {new Date(comment.replied_at).toLocaleString('vi-VN')}
            </p>
          )}
        </div>

        {message && (
          <p className="mt-3 text-sm font-semibold text-emerald-700">
            {message}
          </p>
        )}
      </div>

      <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-zinc-600">
        <p>
          <span className="font-bold text-zinc-800">Email:</span>{' '}
          {comment.email || '—'}
        </p>
        <p className="mt-1">
          <span className="font-bold text-zinc-800">Bài viết:</span>{' '}
          {comment.posts?.title || '—'}
        </p>
      </div>
    </article>
  )
}
