import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import CategoryEditorForm from '@/components/admin/CategoryEditorForm'
import { getCategories } from '@/lib/posts'

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-500">
          HarryShare Admin
        </p>

        <h1 className="mt-3 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-emerald-900">
          Danh mục
        </h1>

        <p className="mt-4 max-w-2xl leading-8 text-zinc-500">
          Quản lý 4 topic cluster chính của HarryShare. Nội dung ở đây ảnh hưởng trực tiếp đến các trang pillar và SEO metadata.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {categories.map((category) => (
          <section key={category.id} className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold tracking-[-0.035em] text-emerald-900">
                  {category.name}
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  /{category.slug}
                </p>
              </div>

              <Link
                href={`/${category.slug}`}
                className="inline-flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-700"
              >
                Xem pillar page
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <CategoryEditorForm category={category} />
          </section>
        ))}

        {categories.length === 0 && (
          <div className="rounded-3xl border border-dashed border-black/15 bg-white/70 p-10 text-center text-zinc-400">
            Chưa có danh mục nào trong database.
          </div>
        )}
      </div>
    </div>
  )
}
