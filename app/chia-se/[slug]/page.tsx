import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { CalendarDays, Clock, ArrowLeft } from 'lucide-react'

import { buildMetadata } from '@/lib/seo'
import { blogPostingSchema, breadcrumbSchema } from '@/lib/schema'
import { getPostBySlug, getRelatedPosts } from '@/lib/posts'
import { getCategoryUrl } from '@/lib/urls'

import JsonLd from '@/components/JsonLd'
import Breadcrumbs from '@/components/Breadcrumbs'
import AuthorBox from '@/components/AuthorBox'
import RelatedPosts from '@/components/RelatedPosts'
import ArticleCTA from '@/components/ArticleCTA'
import LikeButton from '@/components/LikeButton'
import CommentBox from '@/components/CommentBox'

export const revalidate = 60

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

function formatDate(date?: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

function estimateReadingTime(content?: string | null) {
  if (!content) return 3

  const words = content
    .replace(/<[^>]+>/g, '')
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(3, Math.ceil(words / 220))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return buildMetadata({
      title: 'Không tìm thấy bài viết | HarryShare',
      description: 'Bài viết này không tồn tại hoặc đã được gỡ khỏi HarryShare.',
      path: `/chia-se/${slug}`,
    })
  }

  return buildMetadata({
    title: post.seo_title || `${post.title} | HarryShare`,
    description: post.seo_description || post.excerpt || post.title,
    path: `/chia-se/${post.slug}`,
    image: post.og_image || post.cover_image || post.image,
    type: 'article',
    publishedTime: post.published_at || post.created_at,
    modifiedTime: post.updated_at || post.published_at || post.created_at,
  })
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post)
  const category = post.categories
  const categoryName = category?.name || 'Ghi chép'
  const categoryUrl = getCategoryUrl(category?.slug)

  const publishedDate = post.published_at || post.created_at
  const readingTime = post.reading_time || estimateReadingTime(post.content)
  const coverImage = post.cover_image || post.image

  return (
    <main className="bg-cream">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Ghi chép', url: 'https://harryshare.vn/ghi-chep' },
          { name: categoryName, url: `https://harryshare.vn${categoryUrl}` },
          { name: post.title, url: `https://harryshare.vn/chia-se/${post.slug}` },
        ])}
      />

      <JsonLd data={blogPostingSchema(post)} />

      <article className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        <Breadcrumbs
          items={[
            { label: 'Ghi chép', href: '/ghi-chep' },
            { label: categoryName, href: categoryUrl },
            { label: post.title },
          ]}
        />

        <Link
          href="/ghi-chep"
          className="mb-8 inline-flex items-center text-sm font-semibold text-olive transition hover:opacity-70"
        >
          <ArrowLeft size={16} className="mr-2" />
          Quay lại ghi chép
        </Link>

        <header>
          <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <Link
              href={categoryUrl}
              className="rounded-full bg-[#F0FDF4] px-3 py-1 font-semibold text-sage transition hover:bg-white"
            >
              {categoryName}
            </Link>

            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} />
              {formatDate(publishedDate)}
            </span>

            <span className="inline-flex items-center gap-2">
              <Clock size={16} />
              {readingTime} phút đọc
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-serif)] text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-olive md:text-7xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 text-xl leading-9 text-zinc-600">
              {post.excerpt}
            </p>
          )}
        </header>

        {coverImage && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[2rem] border border-black/10 bg-zinc-100 shadow-xl shadow-black/5">
            <Image
              src={coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg prose-zinc mt-12 max-w-none prose-headings:font-[family-name:var(--font-serif)] prose-headings:tracking-[-0.025em] prose-headings:text-olive prose-a:font-semibold prose-a:text-olive prose-img:rounded-2xl prose-blockquote:border-l-sage prose-blockquote:text-zinc-600">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {post.content || ''}
          </ReactMarkdown>
        </div>

        <div className="mt-12 flex justify-center border-y border-black/10 py-8">
          <LikeButton slug={post.slug} />
        </div>

        <AuthorBox />

        <ArticleCTA />

        <RelatedPosts posts={relatedPosts} />

        <section className="mt-14">
          <CommentBox postId={post.id} />
        </section>
      </article>
    </main>
  )
}