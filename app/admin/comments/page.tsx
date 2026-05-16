import CommentAdminCard from '@/components/admin/CommentAdminCard'
import { getCommentsForAdmin } from '@/lib/posts'

export default async function AdminCommentsPage() {
  const comments = await getCommentsForAdmin()

  const pendingCount = comments.filter((item) => !item.approved).length

  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-500">
          HarryShare Admin
        </p>

        <h1 className="mt-3 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-emerald-900">
          Bình luận
        </h1>

        <p className="mt-4 max-w-2xl leading-8 text-zinc-500">
          Quản lý bình luận người đọc gửi trong từng bài viết. Hiện có{' '}
          <span className="font-bold text-orange-500">{pendingCount}</span> bình luận chờ duyệt.
        </p>
      </div>

      <div className="mt-10 space-y-5">
        {comments.map((comment) => (
          <CommentAdminCard key={comment.id} comment={comment} />
        ))}

        {comments.length === 0 && (
          <div className="rounded-3xl border border-dashed border-black/15 bg-white/70 p-10 text-center text-zinc-400">
            Chưa có bình luận nào.
          </div>
        )}
      </div>
    </div>
  )
}
