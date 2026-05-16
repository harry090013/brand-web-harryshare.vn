import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen, CheckCircle2, FileText } from 'lucide-react'

import type { Category, Post } from '@/lib/types'
import { getPostUrl } from '@/lib/urls'

type SuggestedPost = {
  title: string
  description: string
  keyword: string
}

type DynamicPillarPageProps = {
  category: Category
  posts: Post[]
  suggestedPosts: SuggestedPost[]
  primaryKeyword: string
  relatedKeywords: string[]
  startHereTitle: string
  startHereDescription: string
}

function formatDate(date?: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

export default function DynamicPillarPage({
  category,
  posts,
  suggestedPosts,
  primaryKeyword,
  relatedKeywords,
  startHereTitle,
  startHereDescription,
}: DynamicPillarPageProps) {
  const startHerePosts = posts.filter((post) => post.is_start_here).slice(0, 3)
  const normalPosts = posts.filter((post) => !post.is_start_here)

  const featuredPost =
    startHerePosts[0] ||
    posts.find((post) => post.is_featured) ||
    posts[0]

  const latestPosts = normalPosts
    .filter((post) => post.id !== featuredPost?.id)
    .slice(0, 6)

  return (
    <main className="bg-cream">
      {/* Hero */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">
            Pillar Topic
          </p>

          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-serif)] text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-olive md:text-7xl">
            {category.name}
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-600 md:text-xl">
            {category.pillar_intro || category.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="rounded-full bg-olive px-4 py-2 text-sm font-semibold text-white">
              {primaryKeyword}
            </span>

            {relatedKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-zinc-600"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Start Here + Featured */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] border border-black/10 bg-white/70 p-7 shadow-sm">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0FDF4] text-sage">
            <BookOpen size={22} />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">
            Start Here
          </p>

          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] text-zinc-900">
            {startHereTitle}
          </h2>

          <p className="mt-4 leading-8 text-zinc-600">
            {startHereDescription}
          </p>

          {startHerePosts.length > 0 ? (
            <div className="mt-7 space-y-3">
              {startHerePosts.map((post) => (
                <Link
                  key={post.id}
                  href={getPostUrl(post)}
                  className="group block rounded-2xl border border-black/10 bg-cream p-4 transition hover:bg-white"
                >
                  <p className="text-sm font-semibold text-zinc-900">
                    {post.title}
                  </p>
                  <div className="mt-2 inline-flex items-center text-xs font-semibold text-olive">
                    Đọc bài nền tảng
                    <ArrowRight size={14} className="ml-1 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-black/15 bg-cream p-5 text-sm leading-7 text-zinc-500">
              Chưa có bài Start Here trong cụm này. Sau này bạn chỉ cần đánh dấu
              <span className="font-semibold text-zinc-800"> is_start_here = true </span>
              trong Supabase là bài sẽ tự xuất hiện ở đây.
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm">
          {featuredPost ? (
            <Link href={getPostUrl(featuredPost)} className="group block">
              <div className="relative aspect-[16/9] bg-[#F0FDF4]">
                {featuredPost.cover_image || featuredPost.image ? (
                  <Image
                    src={featuredPost.cover_image || featuredPost.image || ''}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sage">
                    <FileText size={42} />
                  </div>
                )}
              </div>

              <div className="p-7">
                <p className="text-sm text-zinc-400">
                  {formatDate(featuredPost.published_at || featuredPost.created_at)}
                </p>

                <h2 className="mt-3 font-[family-name:var(--font-serif)] text-4xl font-bold leading-tight tracking-[-0.035em] text-zinc-900">
                  {featuredPost.title}
                </h2>

                {featuredPost.excerpt && (
                  <p className="mt-5 leading-8 text-zinc-600">
                    {featuredPost.excerpt}
                  </p>
                )}

                <div className="mt-6 inline-flex items-center text-sm font-semibold text-olive">
                  Đọc bài nổi bật
                  <ArrowRight size={16} className="ml-2 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
              <FileText size={42} className="text-sage" />
              <h2 className="mt-5 text-2xl font-semibold text-zinc-900">
                Chưa có bài viết trong cụm này
              </h2>
              <p className="mt-3 max-w-md leading-7 text-zinc-500">
                Khi bạn thêm bài viết và gán category này trong Supabase, bài sẽ tự xuất hiện ở đây.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Latest posts */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">
              Latest in this topic
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-serif)] text-4xl font-bold tracking-[-0.035em] text-olive">
              Bài mới trong chủ đề này
            </h2>
          </div>

          <Link href="/ghi-chep" className="hidden text-sm font-semibold text-olive md:inline-flex">
            Xem tất cả
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={getPostUrl(post)}
                className="group rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-black/5"
              >
                <p className="text-sm text-zinc-400">
                  {formatDate(post.published_at || post.created_at)}
                </p>

                <h3 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.02em] text-zinc-900">
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
        ) : (
          <div className="rounded-3xl border border-dashed border-black/15 bg-white/70 p-10 text-center text-zinc-500">
            Chưa có thêm bài mới trong chủ đề này.
          </div>
        )}
      </section>

      {/* Topic map */}
      <section className="border-y border-black/10 bg-white/45">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">
            Topic Map
          </p>

          <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-serif)] text-4xl font-bold tracking-[-0.035em] text-olive">
            Những bài nên có trong cụm này
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {suggestedPosts.map((post, index) => (
              <div
                key={post.title}
                className="rounded-3xl border border-black/10 bg-cream p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0FDF4] text-sage">
                    <CheckCircle2 size={17} />
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">
                      0{index + 1} • Keyword: {post.keyword}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-zinc-900">
                      {post.title}
                    </h3>
                    <p className="mt-2 leading-7 text-zinc-600">
                      {post.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal link CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-[2rem] border border-black/10 bg-[#F0FDF4] p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">
            Internal Link
          </p>

          <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-serif)] text-4xl font-bold leading-tight tracking-[-0.035em] text-olive">
            Chủ đề này là một phần trong hệ ghi chép lớn hơn của HarryShare.
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-zinc-600">
            Bạn có thể đọc thêm các ghi chép mới nhất hoặc xem các dự án, tài nguyên,
            công cụ mình dùng trong quá trình học và làm thật.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/ghi-chep"
              className="inline-flex items-center justify-center rounded-full bg-olive px-6 py-3 text-sm font-semibold text-white"
            >
              Đọc ghi chép mới nhất
              <ArrowRight size={16} className="ml-2" />
            </Link>

            <Link
              href="/du-an-tai-nguyen"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-zinc-800"
            >
              Dự án & Tài nguyên
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
