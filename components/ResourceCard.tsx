import Link from 'next/link'
import { ArrowRight, Box, Gift, Hammer, Star } from 'lucide-react'
import type { Resource } from '@/lib/types'

function getTypeMeta(type: string) {
  switch (type) {
    case 'tool':
      return {
        label: 'Công cụ mình dùng',
        icon: Hammer,
      }
    case 'product':
      return {
        label: 'Sản phẩm của mình',
        icon: Box,
      }
    case 'freebie':
      return {
        label: 'Tài nguyên miễn phí',
        icon: Gift,
      }
    case 'case_study':
      return {
        label: 'Case study',
        icon: Star,
      }
    default:
      return {
        label: 'Tài nguyên',
        icon: Box,
      }
  }
}

export default function ResourceCard({ resource }: { resource: Resource }) {
  const meta = getTypeMeta(resource.resource_type)
  const Icon = meta.icon

  return (
    <Link
      href={`/du-an-tai-nguyen/${resource.slug}`}
      className="group rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-black/5"
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0FDF4] text-sage">
          <Icon size={22} />
        </div>

        {resource.is_featured && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            Nổi bật
          </span>
        )}
      </div>

      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage">
        {meta.label}
      </p>

      <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.025em] text-zinc-900">
        {resource.title}
      </h2>

      {resource.description && (
        <p className="mt-4 line-clamp-3 leading-7 text-zinc-600">
          {resource.description}
        </p>
      )}

      <div className="mt-6 inline-flex items-center text-sm font-semibold text-olive">
        Xem chi tiết
        <ArrowRight size={16} className="ml-2 transition group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
