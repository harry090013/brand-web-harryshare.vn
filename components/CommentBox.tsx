'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Comment = {
  id: string
  name: string
  content: string
  created_at: string
  reply_content: string | null
  replied_at: string | null
  replied_by: string | null
}

type CommentBoxProps = {
  postId: string
}

export default function CommentBox({ postId }: CommentBoxProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function loadComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('id,name,content,created_at,reply_content,replied_at,replied_by')
      .eq('post_id', postId)
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('loadComments error:', error)
      return
    }

    setComments(data || [])
  }

  useEffect(() => {
    loadComments()
  }, [postId])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanName = name.trim()
    const cleanContent = content.trim()

    if (!cleanName || !cleanContent) {
      setMessage('Bạn vui lòng nhập tên và nội dung bình luận.')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      name: cleanName,
      content: cleanContent,
      approved: false,
    })

    setLoading(false)

    if (error) {
      console.error('submitComment error:', error)
      setMessage('Có lỗi khi gửi bình luận. Vui lòng thử lại.')
      return
    }

    setName('')
    setContent('')
    setMessage('Bình luận đã được gửi và đang chờ duyệt.')
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-olive">
        Bình luận
      </h2>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Tên của bạn"
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-olive"
        />

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={5}
          placeholder="Viết bình luận..."
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-olive"
        />

        {message && (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              message.includes('đã được gửi')
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-olive px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Đang gửi...' : 'Gửi bình luận'}
        </button>
      </form>

      <div className="mt-10 space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-2xl border border-black/10 bg-white/70 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-zinc-900">{comment.name}</p>
                <p className="text-xs text-zinc-400">
                  {new Date(comment.created_at).toLocaleString('vi-VN')}
                </p>
              </div>

              <p className="mt-3 whitespace-pre-wrap leading-7 text-zinc-600">
                {comment.content}
              </p>

              {comment.reply_content && (
                <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold text-emerald-800">
                      {comment.replied_by || 'Harry'} trả lời
                    </p>

                    {comment.replied_at && (
                      <p className="text-xs text-emerald-700/70">
                        {new Date(comment.replied_at).toLocaleString('vi-VN')}
                      </p>
                    )}
                  </div>

                  <p className="mt-3 whitespace-pre-wrap leading-7 text-zinc-700">
                    {comment.reply_content}
                  </p>
                </div>
              )}
            </article>
          ))
        ) : (
          <p className="italic text-zinc-400">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </p>
        )}
      </div>
    </div>
  )
}
