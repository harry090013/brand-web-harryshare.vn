import Link from 'next/link'

type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-zinc-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="transition hover:text-olive">
            Trang chủ
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            <span className="text-zinc-300">/</span>
            {item.href ? (
              <Link href={item.href} className="transition hover:text-olive">
                {item.label}
              </Link>
            ) : (
              <span className="text-zinc-700">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
