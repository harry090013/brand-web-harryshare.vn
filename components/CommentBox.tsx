'use client'

import { useEffect, useMemo, useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Comment = {
  id: string
  post_id: string
  parent_id: string | null
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
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null)
  const [replyName, setReplyName] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [replyLoading, setReplyLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [replyMessage, setReplyMessage] = useState('')

  async function loadComments() {
    const { data, error } = await supabase
      .from('comments')
      .select(
        'id,post_id,parent_id,name,content,created_at,reply_content,replied_at,replied_by'
      )
      .eq('post_id', postId)
      .eq('approved', true)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('loadComments error:', error)
      return
    }

    setComments((data || []) as Comment[])
  }

  useEffect(() => {
    loadComments()
  }, [postId])

  const rootComments = useMemo(() => {
    return comments.filter((comment) => !comment.parent_id)
  }, [comments])

  const repliesByParent = useMemo(() => {
    const map = new Map<string, Comment[]>()

    comments
      .filter((comment) => comment.parent_id)
      .forEach((reply) => {
        const list = map.get(reply.parent_id as string) || []
        list.push(reply)
        map.set(reply.parent_id as string, list)
      })

    return map
  }, [comments])

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
      parent_id: null,
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

  async function handleReplySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!replyingTo) return

    const cleanName = replyName.trim()
    const cleanContent = replyContent.trim()

    if (!cleanName || !cleanContent) {
      setReplyMessage('Bạn vui lòng nhập tên và nội dung trả lời.')
      return
    }

    setReplyLoading(true)
    setReplyMessage('')

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      parent_id: replyingTo.id,
      name: cleanName,
      content: cleanContent,
      approved: false,
    })

    setReplyLoading(false)

    if (error) {
      console.error('submitReply error:', error)
      setReplyMessage('Có lỗi khi gửi trả lời. Vui lòng thử lại.')
      return
    }

    setReplyName('')
    setReplyContent('')
    setReplyMessage('Trả lời đã được gửi và đang chờ duyệt.')
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

      <div className="mt-10 space-y-5">
        {rootComments.length > 0 ? (
          rootComments.map((comment) => {
            const replies = repliesByParent.get(comment.id) || []

            return (
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

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(comment)
                      setReplyMessage('')
                    }}
                    className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <MessageCircle size={14} className="mr-1" />
                    Trả lời
                  </button>
                </div>

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

                {replies.length > 0 && (
                  <div className="mt-5 space-y-3 border-l-2 border-emerald-100 pl-4">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="rounded-2xl border border-black/10 bg-emerald-50/60 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm font-bold text-zinc-900">
                            {reply.name}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {new Date(reply.created_at).toLocaleString('vi-VN')}
                          </p>
                        </div>

                        <p className="mt-2 whitespace-pre-wrap leading-7 text-zinc-600">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {replyingTo?.id === comment.id && (
                  <form
                    onSubmit={handleReplySubmit}
                    className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4"
                  >
                    <p className="text-sm font-bold text-emerald-800">
                      Trả lời {comment.name}
                    </p>

                    <input
                      value={replyName}
                      onChange={(event) => setReplyName(event.target.value)}
                      placeholder="Tên của bạn"
                      className="mt-3 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-olive"
                    />

                    <textarea
                      value={replyContent}
                      onChange={(event) => setReplyContent(event.target.value)}
                      rows={4}
                      placeholder="Viết trả lời..."
                      className="mt-3 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-olive"
                    />

                    {replyMessage && (
                      <div
                        className={`mt-3 rounded-xl px-4 py-3 text-sm ${
                          replyMessage.includes('đã được gửi')
                            ? 'bg-white text-emerald-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {replyMessage}
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={replyLoading}
                        className="inline-flex items-center rounded-xl bg-olive px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Send size={15} className="mr-2" />
                        {replyLoading ? 'Đang gửi...' : 'Gửi trả lời'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setReplyingTo(null)
                          setReplyMessage('')
                        }}
                        className="rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-600"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                )}
              </article>
            )
          })
        ) : (
          <p className="italic text-zinc-400">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </p>
        )}
      </div>
    </div>
  )
}
