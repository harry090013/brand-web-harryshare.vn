'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Eye,
  Heading2,
  ImageIcon,
  LinkIcon,
  Quote,
  Save,
  Send,
  Sparkles,
} from 'lucide-react'

import type { Category, Post } from '@/lib/types'
import { slugify } from '@/lib/content-utils'
import { createPost, updatePost } from '@/app/admin/posts/actions'
import CompactPostImagePanel from '@/components/admin/CompactPostImagePanel'

type Visibility = 'public' | 'private' | 'unlisted'

type PostEditorFormProps = {
  categories: Category[]
  post?: Post
  mode?: 'create' | 'edit'
}

function appendToContent(
  current: string,
  setValue: (value: string) => void,
  insertText: string
) {
  const nextValue = current.trim()
    ? `${current}\n\n${insertText}\n`
    : `${insertText}\n`

  setValue(nextValue)
}

function toDatetimeLocalValue(date?: string | null) {
  if (!date) return ''

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return ''

  const offset = parsedDate.getTimezoneOffset()
  const localDate = new Date(parsedDate.getTime() - offset * 60 * 1000)

  return localDate.toISOString().slice(0, 16)
}

function parseTags(tagsText: string) {
  return tagsText
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
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

  const [tagsText, setTagsText] = useState(post?.tags?.join(', ') || '')
  const [visibility, setVisibility] = useState<Visibility>(
    post?.visibility || 'public'
  )
  const [scheduledAt, setScheduledAt] = useState(
    toDatetimeLocalValue(post?.scheduled_at)
  )

  const [message, setMessage] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const generatedSlug = useMemo(() => slugify(title), [title])

  const selectedCategory = categories.find(
    (category) => category.id === categoryId
  )

  const finalSlug = slug || generatedSlug || 'slug-bai-viet'

  const publicUrlPreview = selectedCategory?.slug
    ? `/${selectedCategory.slug}/${finalSlug}`
    : `/chia-se/${finalSlug}`

  const isPublishing = published

  function handleUseGeneratedSlug() {
    setSlug(generatedSlug)
  }

  function handleInsertImageMarkdown() {
    const imageUrl = coverImage || image || ogImage

    if (!imageUrl) {
      setMessage('Bạn cần nhập hoặc upload ảnh trước khi chèn ảnh vào Markdown.')
      return
    }

    appendToContent(
      content,
      setContent,
      `![${title || 'Ảnh minh họa'}](${imageUrl})`
    )
  }

  function handleInsertHeading() {
    appendToContent(content, setContent, '## Tiêu đề phụ')
  }

  function handleInsertQuote() {
    appendToContent(content, setContent, '> Trích dẫn hoặc ý quan trọng.')
  }

  function handleInsertLink() {
    appendToContent(content, setContent, '[Tên link](https://example.com)')
  }

  function validateBeforeSubmit(nextPublished: boolean) {
    if (!title.trim()) {
      return 'Bạn cần nhập tiêu đề bài viết.'
    }

    if (!categoryId) {
      return 'Bạn cần chọn danh mục cho bài viết.'
    }

    if (nextPublished && !content.trim()) {
      return 'Bạn đang chọn xuất bản, vui lòng nhập nội dung bài viết.'
    }

    if (nextPublished && !excerpt.trim()) {
      return 'Bạn đang chọn xuất bản, nên nhập tóm tắt để hiển thị đẹp trên website.'
    }

    if (nextPublished && !coverImage && !image && !ogImage) {
      return 'Bạn đang chọn xuất bản, nên thêm ảnh bài viết trước khi đăng.'
    }

    return ''
  }

  function submitPost(nextPublished: boolean) {
    setMessage('')

    const validationMessage = validateBeforeSubmit(nextPublished)

    if (validationMessage) {
      setMessage(validationMessage)
      return
    }

    const scheduledIso = scheduledAt
      ? new Date(scheduledAt).toISOString()
      : null

    const payload = {
      category_id: categoryId,
      title,
      slug: slug || generatedSlug,
      excerpt,
      content,
      image,
      cover_image: coverImage,
      og_image: ogImage,
      published: nextPublished,
      seo_title: seoTitle,
      seo_description: seoDescription,
      focus_keyword: focusKeyword,
      is_featured: isFeatured,
      is_start_here: isStartHere,
      tags: parseTags(tagsText),
      visibility,
      scheduled_at: scheduledIso,
    }

    startTransition(async () => {
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
          return
        }

        if (nextPublished) {
          router.push(publicUrlPreview)
          return
        }

        router.push('/admin/posts')
      }
    })
  }

  function handleSaveDraft() {
    setPublished(false)
    submitPost(false)
  }

  function handlePublish() {
    setPublished(true)
    submitPost(true)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="space-y-5">
        {/* Basic info */}
        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
          <label className="text-sm font-semibold text-zinc-700">
            Tiêu đề bài viết <span className="text-red-500">*</span>
          </label>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ví dụ: Vibe coding là gì?"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-lg outline-none transition focus:border-emerald-500"
          />

          <p className="mt-2 text-xs leading-5 text-zinc-400">
            Tiêu đề nên ngắn gọn, rõ ý, dễ hiểu khi hiển thị trong card và kết quả tìm kiếm.
          </p>
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
            Tóm tắt / excerpt
          </label>

          <textarea
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            rows={3}
            placeholder="Tóm tắt ngắn giúp người đọc hiểu bài này nói về gì."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          />

          <p className="mt-2 text-xs leading-5 text-zinc-400">
            Dùng cho card bài viết, metadata fallback và phần mở đầu trên trang chi tiết.
          </p>
        </div>

        {/* Images */}
        <CompactPostImagePanel
          image={image}
          coverImage={coverImage}
          ogImage={ogImage}
          onImageChange={setImage}
          onCoverImageChange={setCoverImage}
          onOgImageChange={setOgImage}
        />

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
            rows={24}
            placeholder="# Tiêu đề phụ&#10;&#10;Viết nội dung bài ở đây..."
            className="mt-4 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-mono text-sm leading-7 outline-none transition focus:border-emerald-500"
          />

          <div className="mt-2 flex flex-col gap-2 text-xs text-zinc-400 md:flex-row md:items-center md:justify-between">
            <p>
              Nháp có thể lưu khi chưa có nội dung. Khi xuất bản, nội dung là bắt buộc.
            </p>
            <p>{content.trim().split(/\s+/).filter(Boolean).length} words</p>
          </div>

          {showPreview && (
            <div className="mt-5 rounded-2xl border border-black/10 bg-cream p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                Preview thô
              </p>

              <pre className="mt-3 max-h-[420px] overflow-auto whitespace-pre-wrap text-sm leading-7 text-zinc-700">
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
            Category <span className="text-red-500">*</span>
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
            Đánh dấu là đã xuất bản
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
          <p className="text-sm font-semibold text-zinc-700">Phân phối</p>

          <label className="mt-4 block text-sm text-zinc-600">
            Tags / Hashtags
          </label>

          <input
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
            placeholder="product thinking, content, ai"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
          />

          <label className="mt-4 block text-sm text-zinc-600">
            Quyền xem
          </label>

          <select
            value={visibility}
            onChange={(event) =>
              setVisibility(event.target.value as Visibility)
            }
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
          >
            <option value="public">Công khai</option>
            <option value="unlisted">Không niêm yết</option>
            <option value="private">Riêng tư</option>
          </select>

          <label className="mt-4 block text-sm text-zinc-600">
            Lên lịch đăng
          </label>

          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
          />

          <p className="mt-3 text-xs leading-5 text-zinc-400">
            Nếu bật xuất bản và chọn thời gian tương lai, bài chỉ nên hiện public sau thời điểm đó.
          </p>
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

        <div className="sticky bottom-5 rounded-[2rem] border border-black/10 bg-white/90 p-5 shadow-xl shadow-black/5 backdrop-blur">
          <div className="grid gap-3">
            <button
              type="button"
              disabled={isPending}
              onClick={handleSaveDraft}
              className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} className="mr-2" />
              {isPending ? 'Đang lưu...' : 'Lưu nháp'}
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={handlePublish}
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/15 transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={16} className="mr-2" />
              {isPending
                ? 'Đang đăng...'
                : mode === 'edit'
                  ? 'Cập nhật & xuất bản'
                  : 'Đăng bài'}
            </button>
          </div>

          {message && (
            <div
              className={`mt-4 rounded-2xl border p-4 text-sm leading-6 ${
                message.includes('thành công') || message.includes('Đã')
                  ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                  : 'border-amber-100 bg-amber-50 text-amber-800'
              }`}
            >
              {message}
            </div>
          )}

          <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-xs leading-5 text-zinc-500">
            <p className="font-bold text-emerald-900">Quy trình gợi ý</p>
            <p className="mt-1">
              Viết tiêu đề → chọn category → lưu nháp → thêm ảnh/SEO → xem preview → đăng bài.
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
