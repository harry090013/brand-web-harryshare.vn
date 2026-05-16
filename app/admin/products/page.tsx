import Link from 'next/link'
import { Plus } from 'lucide-react'

import { getResourcesForAdmin } from '@/lib/resources'

function getTypeLabel(type: string) {
  switch (type) {
    case 'tool':
      return 'Công cụ'
    case 'product':
      return 'Sản phẩm'
    case 'freebie':
      return 'Miễn phí'
    case 'case_study':
      return 'Case study'
    default:
      return type
  }
}

function formatDate(date?: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('vi-VN')
}

export default async function AdminProductsPage() {
  const resources = await getResourcesForAdmin()

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-500">
            Dự án & Tài nguyên
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-emerald-900">
            Sản phẩm / Tài nguyên
          </h1>

          <p className="mt-4 max-w-2xl leading-8 text-zinc-500">
            Quản lý sản phẩm số, affiliate tool, tài nguyên miễn phí và case study của HarryShare.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600"
        >
          <Plus size={17} className="mr-2" />
          Thêm tài nguyên
        </Link>
      </div>

      <section className="mt-10 overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-[0.18em] text-zinc-400">
              <tr>
                <th className="px-6 py-4">Tiêu đề</th>
                <th className="px-6 py-4">Loại</th>
                <th className="px-6 py-4">Keyword</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ngày tạo</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id} className="border-t border-black/5">
                  <td className="px-6 py-4">
                    <p className="max-w-sm truncate font-bold text-emerald-900">
                      {resource.title}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      /du-an-tai-nguyen/{resource.slug}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-zinc-500">
                    {getTypeLabel(resource.resource_type)}
                  </td>

                  <td className="px-6 py-4 text-zinc-500">
                    {resource.focus_keyword || '—'}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        resource.published
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      {resource.published ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-zinc-500">
                    {formatDate(resource.created_at)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-4">
                      {resource.published && (
                        <Link
                          href={`/du-an-tai-nguyen/${resource.slug}`}
                          className="font-bold text-zinc-500 hover:text-emerald-700"
                        >
                          Xem
                        </Link>
                      )}
                      <Link
                        href={`/admin/products/${resource.id}/edit`}
                        className="font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        Sửa
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {resources.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                    Chưa có tài nguyên nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
