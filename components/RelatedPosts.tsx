import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { getPostUrl } from '@/lib/urls'

type RelatedPost = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
}

type RelatedPostsProps = {
  posts: RelatedPost[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="mt-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">
            Đọc tiếp
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-serif)] text-3xl font-bold tracking-[-0.035em] text-olive">
            Bài viết liên quan
          </h2>
        </div>

        <Link href="/ghi-chep" className="hidden text-sm font-semibold text-olive md:inline-flex">
          Xem tất cả
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={getPostUrl(post)}
            className="group rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-black/5"
          >
            <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0FDF4] text-sage">
              <BookOpen size={20} />
            </div>

            <h3 className="text-xl font-semibold leading-snug tracking-[-0.02em] text-zinc-900">
              {post.title}
            </h3>

            {post.excerpt && (
              <p className="mt-4 line-clamp-3 leading-7 text-zinc-600">
                {post.excerpt}
              </p>
            )}

            <div className="mt-6 inline-flex items-center text-sm font-semibold text-olive">
              Đọc tiếp
              <ArrowRight size={16} className="ml-2 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
