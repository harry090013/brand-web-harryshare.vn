'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Comment = {
  id: string; post_slug: string; name: string; content: string;
  approved: boolean; created_at: string;
}

export default function CommentsAdmin() {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/login')
      else load()
    })
  }, [router])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false })
    setComments(data || [])
    setLoading(false)
  }

  const approve = async (id: string) => {
    await supabase.from('comments').update({ approved: true }).eq('id', id)
    await load()
  }

  const unapprove = async (id: string) => {
    await supabase.from('comments').update({ approved: false }).eq('id', id)
    await load()
  }

  const deleteComment = async (id: string) => {
    if (!confirm('Xóa bình luận này?')) return
    await supabase.from('comments').delete().eq('id', id)
    await load()
  }

  const filtered = comments.filter(c => {
    if (filter === 'pending') return !c.approved
    if (filter === 'approved') return c.approved
    return true
  })

  const pendingCount = comments.filter(c => !c.approved).length

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto pb-24">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">Tương tác</p>
        <h1 className="text-4xl text-olive font-[family-name:var(--font-serif)]">Bình luận</h1>
        {pendingCount > 0 && (
          <p className="text-sm text-amber-600 mt-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Có {pendingCount} bình luận đang chờ duyệt
          </p>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100/60 rounded-xl mb-8 w-fit">
        {(['pending', 'approved', 'all'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${filter === f ? 'bg-white text-olive shadow-sm' : 'text-gray-500 hover:text-olive'}`}>
            {f === 'pending' ? `Chờ duyệt (${pendingCount})` : f === 'approved' ? 'Đã duyệt' : 'Tất cả'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          Không có bình luận nào.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(comment => (
            <div key={comment.id} className={`bg-white rounded-2xl border shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-6 transition ${comment.approved ? 'border-gray-100' : 'border-amber-200/60'}`}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-cream-alt flex items-center justify-center text-xs font-bold text-olive uppercase">
                      {comment.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-olive">{comment.name}</p>
                      <p className="text-[10px] text-gray-400">
                        Bài: <span className="font-mono">/chia-se/{comment.post_slug}</span> · {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <span className={`ml-auto text-[9px] px-2.5 py-1 rounded-full font-medium ${comment.approved ? 'bg-[#E8F0E4] text-sage' : 'bg-amber-50 text-amber-600'}`}>
                      {comment.approved ? 'Đã duyệt' : 'Chờ duyệt'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-11">{comment.content}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100/50">
                {!comment.approved ? (
                  <button onClick={() => approve(comment.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-sage text-white rounded-lg text-xs font-medium hover:bg-opacity-90 transition">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Duyệt
                  </button>
                ) : (
                  <button onClick={() => unapprove(comment.id)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-xs hover:bg-gray-50 transition">
                    Hủy duyệt
                  </button>
                )}
                <button onClick={() => deleteComment(comment.id)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 rounded-lg text-xs hover:bg-red-50 transition">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
