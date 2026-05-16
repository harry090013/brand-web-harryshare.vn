import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import ResourceEditorForm from '@/components/admin/ResourceEditorForm'
import { getResourceByIdForAdmin } from '@/lib/resources'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditResourcePage({ params }: PageProps) {
  const { id } = await params
  const resource = await getResourceByIdForAdmin(id)

  if (!resource) {
    notFound()
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-8 inline-flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-700"
      >
        <ArrowLeft size={16} className="mr-2" />
        Quay lại danh sách
      </Link>

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-500">
          Dự án & Tài nguyên
        </p>

        <h1 className="mt-3 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-emerald-900">
          Sửa tài nguyên
        </h1>

        <p className="mt-4 max-w-2xl leading-8 text-zinc-500">
          Cập nhật nội dung, link affiliate, SEO metadata và trạng thái xuất bản.
        </p>
      </div>

      <div className="mt-10">
        <ResourceEditorForm
          resource={resource}
          mode="edit"
        />
      </div>
    </div>
  )
}
