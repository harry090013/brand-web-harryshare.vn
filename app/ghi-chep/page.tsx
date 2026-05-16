import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, ArrowRight } from 'lucide-react'

import { buildMetadata } from '@/lib/seo'
import { getPublishedPosts } from '@/lib/posts'
import { getPostUrl, getCategoryUrl } from '@/lib/urls'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'Ghi chép | HarryShare',
  description:
    'Tất cả bài viết mới nhất của HarryShare về tư duy sản phẩm, thương hiệu cá nhân, AI, vibe coding và hành trình làm nghề.',
  path: '/ghi-chep',
})

export default async function NotesPage() {
  const posts = await getPublishedPosts()

  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">Ghi chép</p>
        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-olive md:text-7xl">
          Tất cả bài viết
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
          Những ghi chép mới nhất về sản phẩm, thương hiệu cá nhân, AI, vibe coding và hành trình làm nghề thực chiến.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {posts.length > 0 ? posts.map((post) => {
            const category = post.categories
            const coverImage = post.cover_image || post.image

            return (
              <Link
                key={post.id}
                href={getPostUrl(post)}
                className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
              >
                <div className="relative aspect-[16/10] bg-[#F0FDF4]">
                  {coverImage ? (
                    <Image src={coverImage} alt={post.title} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sage">
                      <BookOpen size={34} />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {category && (
                    <span className="mb-4 inline-flex rounded-full bg-[#F0FDF4] px-3 py-1 text-xs font-semibold text-sage">
                      {category.name}
                    </span>
                  )}

                  <p className="text-sm text-zinc-400">
                    {new Date(post.published_at || post.created_at).toLocaleDateString('vi-VN')}
                  </p>

                  <h2 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.02em] text-zinc-900">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="mt-4 line-clamp-3 leading-7 text-zinc-600">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-5 inline-flex items-center text-sm font-semibold text-olive">
                    Đọc tiếp <ArrowRight size={16} className="ml-2 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            )
          }) : (
            <div className="col-span-full rounded-3xl border border-dashed border-black/15 bg-white/70 p-10 text-center text-zinc-500">
              Chưa có bài viết nào.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
