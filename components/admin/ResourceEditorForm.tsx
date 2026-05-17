'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Sparkles } from 'lucide-react'

import type { Resource, ResourceType } from '@/lib/types'
import { slugify } from '@/lib/content-utils'
import { createResource, updateResource } from '@/app/admin/products/actions'
import ImageUploader from '@/components/admin/ImageUploader'

type ResourceEditorFormProps = {
  resource?: Resource
  mode?: 'create' | 'edit'
}

const resourceTypes: { value: ResourceType; label: string; description: string }[] = [
  {
    value: 'tool',
    label: 'Công cụ mình dùng',
    description: 'AI tool, SaaS, hosting, domain, design, marketing tool.',
  },
  {
    value: 'product',
    label: 'Sản phẩm của mình',
    description: 'Template, ebook, prompt pack, checklist, khóa học nhỏ.',
  },
  {
    value: 'freebie',
    label: 'Tài nguyên miễn phí',
    description: 'Checklist, template, prompt, file mẫu chia sẻ miễn phí.',
  },
  {
    value: 'case_study',
    label: 'Case study / Thử nghiệm',
    description: 'Những lần thử xây sản phẩm, landing page, workflow AI.',
  },
]

export default function ResourceEditorForm({
  resource,
  mode = 'create',
}: ResourceEditorFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [title, setTitle] = useState(resource?.title || '')
  const [slug, setSlug] = useState(resource?.slug || '')
  const [description, setDescription] = useState(resource?.description || '')
  const [content, setContent] = useState(resource?.content || '')
  const [resourceType, setResourceType] = useState<ResourceType>(
    resource?.resource_type || 'tool'
  )
  const [url, setUrl] = useState(resource?.url || '')
  const [affiliateUrl, setAffiliateUrl] = useState(resource?.affiliate_url || '')
  const [image, setImage] = useState(resource?.image || '')
  const [published, setPublished] = useState(resource?.published || false)
  const [isFeatured, setIsFeatured] = useState(resource?.is_featured || false)
  const [seoTitle, setSeoTitle] = useState(resource?.seo_title || '')
  const [seoDescription, setSeoDescription] = useState(
    resource?.seo_description || ''
  )
  const [focusKeyword, setFocusKeyword] = useState(resource?.focus_keyword || '')
  const [message, setMessage] = useState('')

  const generatedSlug = useMemo(() => slugify(title), [title])

  function handleUseGeneratedSlug() {
    setSlug(generatedSlug)
  }

  function handleSubmit() {
    setMessage('')

    const payload = {
      title,
      slug: slug || generatedSlug,
      description,
      content,
      resource_type: resourceType,
      url,
      affiliate_url: affiliateUrl,
      image,
      published,
      is_featured: isFeatured,
      seo_title: seoTitle,
      seo_description: seoDescription,
      focus_keyword: focusKeyword,
    }

    startTransition(async () => {
      const result =
        mode === 'edit' && resource
          ? await updateResource({
              id: resource.id,
              ...payload,
            })
          : await createResource(payload)

      setMessage(result.message)

      if (result.ok) {
        router.refresh()
        router.push('/admin/products')
      }
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-5">
        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <label className="text-sm font-semibold text-zinc-700">
            Tiêu đề
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ví dụ: Lovable"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-lg outline-none transition focus:border-emerald-500"
          />
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-semibold text-zinc-700">
              Slug
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
            placeholder={generatedSlug || 'slug-tai-nguyen'}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          />

          <p className="mt-2 text-sm text-zinc-400">
            URL: <span className="font-bold text-emerald-700">/du-an-tai-nguyen/{slug || generatedSlug || 'slug-tai-nguyen'}</span>
          </p>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <label className="text-sm font-semibold text-zinc-700">
            Mô tả ngắn
          </label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Tóm tắt tài nguyên/sản phẩm/công cụ này giúp gì."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <label className="text-sm font-semibold text-zinc-700">
            Nội dung chi tiết Markdown
          </label>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={16}
            placeholder="# Vì sao mình dùng công cụ này?&#10;&#10;Viết nội dung chi tiết ở đây..."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-mono text-sm leading-7 outline-none transition focus:border-emerald-500"
          />
        </div>
      </section>

      <aside className="space-y-5">
        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <label className="text-sm font-semibold text-zinc-700">
            Loại tài nguyên
          </label>
          <select
            value={resourceType}
            onChange={(event) => setResourceType(event.target.value as ResourceType)}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          >
            {resourceTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {resourceTypes.find((type) => type.value === resourceType)?.description}
          </p>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <ImageUploader
            label="Ảnh tài nguyên"
            description="Ảnh hiển thị trong card resource và trang chi tiết."
            value={image}
            folder="resources"
            onChange={setImage}
          />
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <label className="text-sm font-semibold text-zinc-700">
            Link chính
          </label>
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://..."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          />

          <label className="mt-4 block text-sm font-semibold text-zinc-700">
            Affiliate link
          </label>
          <input
            value={affiliateUrl}
            onChange={(event) => setAffiliateUrl(event.target.value)}
            placeholder="https://..."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          />

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Nếu có affiliate link, public page sẽ ưu tiên nút CTA sang affiliate link.
          </p>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
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
            Đánh dấu nổi bật
          </label>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
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
            rows={3}
            placeholder="Mô tả ngắn hiển thị trên Google."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
          />

          <label className="mt-4 block text-sm text-zinc-600">
            Focus keyword
          </label>
          <input
            value={focusKeyword}
            onChange={(event) => setFocusKeyword(event.target.value)}
            placeholder="công cụ AI cho marketer"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
          />
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={handleSubmit}
          className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={16} className="mr-2" />
          {isPending
            ? 'Đang lưu...'
            : mode === 'edit'
              ? 'Cập nhật'
              : 'Lưu tài nguyên'}
        </button>

        {message && (
          <div className="rounded-2xl border border-black/10 bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>
        )}
      </aside>
    </div>
  )
}
