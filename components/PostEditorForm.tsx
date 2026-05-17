'use client'

import Image from 'next/image'
import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Eye,
  Heading2,
  ImageIcon,
  LinkIcon,
  Quote,
  Save,
  Sparkles,
} from 'lucide-react'

import type { Category, Post } from '@/lib/types'
import { slugify } from '@/lib/content-utils'
import { createPost, updatePost } from '@/app/admin/posts/actions'
import ImageUploader from '@/components/admin/ImageUploader'

type PostEditorFormProps = {
  categories: Category[]
  post?: Post
  mode?: 'create' | 'edit'
}

function insertAtCursor(
  current: string,
  setValue: (value: string) => void,
  insertText: string
) {
  setValue(`${current}\n\n${insertText}\n`)
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

  const [image, setImage] = useState(post?.image || '')
  const [coverImage, setCoverImage] = useState(post?.cover_image || '')
  const [ogImage, setOgImage] = useState(post?.og_image || '')

  const [seoTitle, setSeoTitle] = useState(post?.seo_title || '')
  const [seoDescription, setSeoDescription] = useState(
    post?.seo_description || ''
  )
  const [focusKeyword, setFocusKeyword] = useState(post?.focus_keyword || '')
  const [published, setPublished] = useState(post?.published || false)
  const [isFeatured, setIsFeatured] = useState(post?.is_featured || false)
  const [isStartHere, setIsStartHere] = useState(post?.is_start_here || false)

  const [message, setMessage] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const generatedSlug = useMemo(() => slugify(title), [title])

  const selectedCategory = categories.find((category) => category.id === categoryId)

  const publicUrlPreview = selectedCategory?.slug
    ? `/${selectedCategory.slug}/${slug || generatedSlug || 'slug-bai-viet'}`
    : `/chia-se/${slug || generatedSlug || 'slug-bai-viet'}`

  const previewImage = coverImage || image || ogImage

  function handleUseGeneratedSlug() {
    setSlug(generatedSlug)
  }

  function handleUseCoverForAll() {
    const value = coverImage || image || ogImage
    if (!value) return

    setImage(value)
    setCoverImage(value)
    setOgImage(value)
  }

  function handleInsertImageMarkdown() {
    const imageUrl = coverImage || image || ogImage

    if (!imageUrl) {
      setMessage('Bạn cần nhập URL ảnh trước khi chèn ảnh vào Markdown.')
      return
    }

    insertAtCursor(
      content,
      setContent,
      `![${title || 'Ảnh minh họa'}](${imageUrl})`
    )
  }

  function handleInsertHeading() {
    insertAtCursor(content, setContent, `## Tiêu đề phụ`)
  }

  function handleInsertQuote() {
    insertAtCursor(content, setContent, `> Trích dẫn hoặc ý quan trọng.`)
  }

  function handleInsertLink() {
    insertAtCursor(content, setContent, `[Tên link](https://example.com)`)
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
        image,
        cover_image: coverImage,
        og_image: ogImage,
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

      setMessage(result.message)

      if (result.ok) {
        router.refresh()

        if (mode === 'edit') {
          router.push('/admin/posts')
        } else {
          router.push(publicUrlPreview)
        }
      }
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section className="space-y-5">
        {/* Basic */}
        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
          <label className="text-sm font-semibold text-zinc-700">
            Tiêu đề bài viết
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ví dụ: Vibe coding là gì?"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-lg outline-none transition focus:border-emerald-500"
          />
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-semibold text-zinc-700">
              Slug URL
            </label>
            <button
              type="button"
              onClick={handleUseGeneratedSlug}
              className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600"
            >
              <Sparkles size={13} className="mr-1" />
              Tạo từ tiêu đề
            </button>
          </div>

          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder={generatedSlug || 'slug-bai-viet'}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          />

          <p className="mt-2 text-sm text-zinc-500">
            URL bài viết sẽ là:{' '}
            <span className="font-semibold text-emerald-700">
              {publicUrlPreview}
            </span>
          </p>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
          <label className="text-sm font-semibold text-zinc-700">
            Mô tả ngắn / excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            rows={3}
            placeholder="Tóm tắt ngắn giúp người đọc hiểu bài này nói về gì."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </div>

        {/* Image Manager */}
        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-700">
                Ảnh bài viết
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Upload ảnh trực tiếp lên Supabase Storage hoặc dán URL ảnh có sẵn.
              </p>
            </div>

            <button
              type="button"
              onClick={handleUseCoverForAll}
              className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600"
            >
              Dùng 1 ảnh cho tất cả
            </button>
          </div>

          <div className="mt-5 grid gap-5">
            <ImageUploader
              label="Cover image"
              description="Ảnh chính hiển thị trong card và đầu bài viết."
              value={coverImage}
              folder="posts"
              onChange={setCoverImage}
            />

            <ImageUploader
              label="OG image"
              description="Ảnh khi share Facebook, Zalo, LinkedIn. Có thể dùng chung với cover."
              value={ogImage}
              folder="posts"
              onChange={setOgImage}
            />

            <ImageUploader
              label="Image fallback"
              description="Ảnh fallback cũ. Có thể dùng chung với cover."
              value={image}
              folder="posts"
              onChange={setImage}
            />
          </div>
        </div>

        {/* Markdown editor */}
        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <label className="text-sm font-semibold text-zinc-700">
                Nội dung bài viết Markdown
              </label>
              <p className="mt-1 text-sm text-zinc-400">
                Có thể chèn heading, quote, link và ảnh bằng toolbar nhanh.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-zinc-600"
            >
              <Eye size={14} className="mr-2" />
              {showPreview ? 'Ẩn preview' : 'Xem preview thô'}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleInsertHeading}
              className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-600"
            >
              <Heading2 size={14} className="mr-1" />
              H2
            </button>

            <button
              type="button"
              onClick={handleInsertQuote}
              className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-600"
            >
              <Quote size={14} className="mr-1" />
              Quote
            </button>

            <button
              type="button"
              onClick={handleInsertLink}
              className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-600"
            >
              <LinkIcon size={14} className="mr-1" />
              Link
            </button>

            <button
              type="button"
              onClick={handleInsertImageMarkdown}
              className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600"
            >
              <ImageIcon size={14} className="mr-1" />
              Chèn ảnh cover
            </button>
          </div>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={22}
            placeholder="# Tiêu đề phụ&#10;&#10;Viết nội dung bài ở đây..."
            className="mt-4 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-mono text-sm leading-7 outline-none transition focus:border-emerald-500"
          />

          {showPreview && (
            <div className="mt-5 rounded-2xl border border-black/10 bg-cream p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                Preview thô
              </p>
              <pre className="mt-3 max-h-[360px] overflow-auto whitespace-pre-wrap text-sm leading-7 text-zinc-700">
                {content || 'Chưa có nội dung.'}
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* Sidebar */}
      <aside className="space-y-5">
        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
          <label className="text-sm font-semibold text-zinc-700">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
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

        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
          <p className="text-sm font-semibold text-zinc-700">SEO</p>

          <label className="mt-4 block text-sm text-zinc-600">
            SEO title
          </label>
          <input
            value={seoTitle}
            onChange={(event) => setSeoTitle(event.target.value)}
            placeholder={title ? `${title} | HarryShare` : 'SEO title'}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
          />

          <label className="mt-4 block text-sm text-zinc-600">
            SEO description
          </label>
          <textarea
            value={seoDescription}
            onChange={(event) => setSeoDescription(event.target.value)}
            rows={5}
            placeholder="Mô tả ngắn hiển thị trên Google."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
          />

          <label className="mt-4 block text-sm text-zinc-600">
            Focus keyword
          </label>
          <input
            value={focusKeyword}
            onChange={(event) => setFocusKeyword(event.target.value)}
            placeholder="vibe coding là gì"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
          />
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={handleSubmit}
          className="inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/15 transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
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

        <div className="rounded-[2rem] border border-black/10 bg-emerald-50 p-5 text-sm leading-7 text-zinc-600">
          <p className="font-bold text-emerald-900">Gợi ý ảnh</p>
          <p className="mt-2">
            Đặt ảnh trong <span className="font-mono">public/posts</span> rồi nhập
            path dạng <span className="font-mono">/posts/ten-file.png</span>.
          </p>
        </div>
      </aside>
    </div>
  )
}
