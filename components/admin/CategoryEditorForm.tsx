'use client'

import { useState, useTransition } from 'react'
import { Save, Sparkles } from 'lucide-react'

import type { Category } from '@/lib/types'
import { slugify } from '@/lib/content-utils'
import { updateCategory } from '@/app/admin/categories/actions'

type CategoryEditorFormProps = {
  category: Category
}

export default function CategoryEditorForm({ category }: CategoryEditorFormProps) {
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState(category.name || '')
  const [slug, setSlug] = useState(category.slug || '')
  const [description, setDescription] = useState(category.description || '')
  const [seoTitle, setSeoTitle] = useState(category.seo_title || '')
  const [seoDescription, setSeoDescription] = useState(category.seo_description || '')
  const [pillarIntro, setPillarIntro] = useState(category.pillar_intro || '')
  const [sortOrder, setSortOrder] = useState(category.sort_order || 0)
  const [message, setMessage] = useState('')

  function handleGenerateSlug() {
    setSlug(slugify(name))
  }

  function handleSubmit() {
    setMessage('')

    startTransition(async () => {
      const result = await updateCategory({
        id: category.id,
        name,
        slug,
        description,
        seo_title: seoTitle,
        seo_description: seoDescription,
        pillar_intro: pillarIntro,
        sort_order: Number(sortOrder),
      })

      setMessage(result.message)
    })
  }

  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-zinc-700">
              Tên danh mục
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-semibold text-zinc-700">
                Slug
              </label>

              <button
                type="button"
                onClick={handleGenerateSlug}
                className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600"
              >
                <Sparkles size={13} className="mr-1" />
                Tạo từ tên
              </button>
            </div>

            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
            />

            <p className="mt-2 text-sm text-zinc-400">
              URL pillar page:{' '}
              <span className="font-semibold text-emerald-700">/{slug}</span>
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-700">
              Description ngắn
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-700">
              Pillar intro
            </label>
            <textarea
              value={pillarIntro}
              onChange={(event) => setPillarIntro(event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
            />

            <p className="mt-2 text-sm text-zinc-400">
              Đoạn này sẽ xuất hiện ở phần hero của trang pillar.
            </p>
          </div>
        </div>

        <aside className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-zinc-700">
              Sort order
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(event) => setSortOrder(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-700">
              SEO title
            </label>
            <input
              value={seoTitle}
              onChange={(event) => setSeoTitle(event.target.value)}
              placeholder={`${name} | HarryShare`}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-700">
              SEO description
            </label>
            <textarea
              value={seoDescription}
              onChange={(event) => setSeoDescription(event.target.value)}
              rows={5}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
            />
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={handleSubmit}
            className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} className="mr-2" />
            {isPending ? 'Đang lưu...' : 'Lưu danh mục'}
          </button>

          {message && (
            <div className="rounded-2xl border border-black/10 bg-emerald-50 p-4 text-sm text-emerald-700">
              {message}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
