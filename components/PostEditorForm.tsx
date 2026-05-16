'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Sparkles } from 'lucide-react'

import type { Category, Post } from '@/lib/types'
import { slugify } from '@/lib/content-utils'
import { createPost, updatePost } from '@/app/admin/posts/actions'
import { getPostUrl } from '@/lib/urls'

type PostEditorFormProps = {
  categories: Category[]
  post?: Post
  mode?: 'create' | 'edit'
}

export default function PostEditorForm({
  categories,
  post,
  mode = 'create',
}: PostEditorFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [categoryId, setCategoryId] = useState(
    post?.category_id || categories[0]?.id || ''
  )
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [content, setContent] = useState(post?.content || '')
  const [seoTitle, setSeoTitle] = useState(post?.seo_title || '')
  const [seoDescription, setSeoDescription] = useState(
    post?.seo_description || ''
  )
  const [focusKeyword, setFocusKeyword] = useState(post?.focus_keyword || '')
  const [published, setPublished] = useState(post?.published || false)
  const [isFeatured, setIsFeatured] = useState(post?.is_featured || false)
  const [isStartHere, setIsStartHere] = useState(post?.is_start_here || false)
  const [message, setMessage] = useState('')

  const generatedSlug = useMemo(() => {
    return slugify(title)
  }, [title])

  const currentCategorySlug = useMemo(() => {
    return categories.find((c) => c.id === categoryId)?.slug
  }, [categories, categoryId])

  function handleUseGeneratedSlug() {
    setSlug(generatedSlug)
  }

  function handleSubmit() {
    setMessage('')

    startTransition(async () => {
      const payload = {
        category_id: categoryId,
        title,
        slug: slug || generatedSlug,
        excerpt,
        content,
        published,
        seo_title: seoTitle,
        seo_description: seoDescription,
        focus_keyword: focusKeyword,
        is_featured: isFeatured,
        is_start_here: isStartHere,
      }

      const result =
        mode === 'edit' && post
          ? await updatePost({
              id: post.id,
              ...payload,
            })
          : await createPost(payload)

      console.log(result)
      setMessage(result.message)

      if (result.ok) {
        router.refresh()

        if (mode === 'edit' && post) {
          router.push('/admin/posts')
        } else {
          router.push(`/chia-se/${result.slug}`)
        }
      }
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-5">
        <div className="rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-sm">
          <label className="text-sm font-semibold text-zinc-700">
            Tiêu đề bài viết
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ví dụ: Vibe coding là gì?"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-lg outline-none transition focus:border-olive"
          />
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-semibold text-zinc-700">
              Slug URL
            </label>
            <button
              type="button"
              onClick={handleUseGeneratedSlug}
              className="inline-flex items-center rounded-full bg-[#F0FDF4] px-3 py-1 text-xs font-semibold text-sage"
            >
              <Sparkles size={13} className="mr-1" />
              Tạo từ tiêu đề
            </button>
          </div>

          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder={generatedSlug || 'slug-bai-viet'}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-olive"
          />

          <p className="mt-2 text-sm text-zinc-500">
            URL bài viết sẽ là:{' '}
            <span className="font-semibold text-olive">
              {currentCategorySlug
                ? `/${currentCategorySlug}/${slug || generatedSlug || 'slug-bai-viet'}`
                : `/chia-se/${slug || generatedSlug || 'slug-bai-viet'}`}
            </span>
          </p>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-sm">
          <label className="text-sm font-semibold text-zinc-700">
            Mô tả ngắn / excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            rows={3}
            placeholder="Tóm tắt ngắn giúp người đọc hiểu bài này nói về gì."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-olive"
          />
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-sm">
          <label className="text-sm font-semibold text-zinc-700">
            Nội dung bài viết Markdown
          </label>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={18}
            placeholder="# Tiêu đề phụ&#10;&#10;Viết nội dung bài ở đây..."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-mono text-sm leading-7 outline-none transition focus:border-olive"
          />
          <p className="mt-2 text-sm text-zinc-500">
            Hiện tại dùng Markdown. TinyMCE hoặc editor rich text sẽ nâng cấp sau nếu cần.
          </p>
        </div>
      </section>

      <aside className="space-y-5">
        <div className="rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-sm">
          <label className="text-sm font-semibold text-zinc-700">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-olive"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-sm">
          <p className="text-sm font-semibold text-zinc-700">Trạng thái</p>

          <label className="mt-4 flex items-center gap-3 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
            />
            Xuất bản
          </label>

          <label className="mt-4 flex items-center gap-3 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(event) => setIsFeatured(event.target.checked)}
            />
            Đánh dấu bài nổi bật
          </label>

          <label className="mt-4 flex items-center gap-3 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={isStartHere}
              onChange={(event) => setIsStartHere(event.target.checked)}
            />
            Đưa vào Start Here
          </label>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-sm">
          <p className="text-sm font-semibold text-zinc-700">SEO</p>

          <label className="mt-4 block text-sm text-zinc-600">
            SEO title
          </label>
          <input
            value={seoTitle}
            onChange={(event) => setSeoTitle(event.target.value)}
            placeholder={title ? `${title} | HarryShare` : 'SEO title'}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-olive"
          />

          <label className="mt-4 block text-sm text-zinc-600">
            SEO description
          </label>
          <textarea
            value={seoDescription}
            onChange={(event) => setSeoDescription(event.target.value)}
            rows={3}
            placeholder="Mô tả ngắn hiển thị trên Google."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-olive"
          />

          <label className="mt-4 block text-sm text-zinc-600">
            Focus keyword
          </label>
          <input
            value={focusKeyword}
            onChange={(event) => setFocusKeyword(event.target.value)}
            placeholder="vibe coding là gì"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-olive"
          />
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={handleSubmit}
          className="inline-flex w-full items-center justify-center rounded-full bg-olive px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-olive/15 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={16} className="mr-2" />
          {isPending
            ? 'Đang lưu...'
            : mode === 'edit'
              ? 'Cập nhật bài viết'
              : 'Lưu bài viết'}
        </button>

        {message && (
          <div className="rounded-2xl border border-black/10 bg-white/70 p-4 text-sm text-zinc-700">
            {message}
          </div>
        )}
      </aside>
    </div>
  )
}
