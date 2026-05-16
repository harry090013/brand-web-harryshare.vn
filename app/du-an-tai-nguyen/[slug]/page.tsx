import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { ArrowLeft, ExternalLink } from 'lucide-react'

import { buildMetadata } from '@/lib/seo'
import { getResourceBySlug } from '@/lib/resources'

export const revalidate = 60

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'tool':
      return 'Công cụ mình dùng'
    case 'product':
      return 'Sản phẩm của mình'
    case 'freebie':
      return 'Tài nguyên miễn phí'
    case 'case_study':
      return 'Case study'
    default:
      return 'Tài nguyên'
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const resource = await getResourceBySlug(slug)

  if (!resource) {
    return buildMetadata({
      title: 'Không tìm thấy tài nguyên | HarryShare',
      description: 'Tài nguyên này không tồn tại hoặc chưa được xuất bản.',
      path: `/du-an-tai-nguyen/${slug}`,
    })
  }

  return buildMetadata({
    title: resource.seo_title || `${resource.title} | HarryShare`,
    description: resource.seo_description || resource.description || resource.title,
    path: `/du-an-tai-nguyen/${resource.slug}`,
    image: resource.image,
  })
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const resource = await getResourceBySlug(slug)

  if (!resource) {
    notFound()
  }

  const ctaUrl = resource.affiliate_url || resource.url

  return (
    <main className="bg-cream">
      <article className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        <Link
          href="/du-an-tai-nguyen"
          className="mb-8 inline-flex items-center text-sm font-semibold text-olive transition hover:opacity-70"
        >
          <ArrowLeft size={16} className="mr-2" />
          Quay lại Dự án & Tài nguyên
        </Link>

        <header>
          <p className="inline-flex rounded-full bg-[#F0FDF4] px-4 py-2 text-sm font-bold text-sage">
            {getTypeLabel(resource.resource_type)}
          </p>

          <h1 className="mt-6 font-[family-name:var(--font-serif)] text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-olive md:text-7xl">
            {resource.title}
          </h1>

          {resource.description && (
            <p className="mt-6 text-xl leading-9 text-zinc-600">
              {resource.description}
            </p>
          )}

          {ctaUrl && (
            <a
              href={ctaUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="mt-8 inline-flex items-center rounded-full bg-olive px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-olive/15 transition hover:-translate-y-0.5"
            >
              Truy cập tài nguyên
              <ExternalLink size={16} className="ml-2" />
            </a>
          )}
        </header>

        {resource.affiliate_url && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-800">
            <strong>Minh bạch affiliate:</strong> Link trong trang này có thể là affiliate link. Nếu bạn đăng ký qua link đó, mình có thể nhận một khoản hoa hồng nhỏ mà không làm bạn tốn thêm chi phí.
          </div>
        )}

        <div className="prose prose-lg prose-zinc mt-12 max-w-none prose-headings:font-[family-name:var(--font-serif)] prose-headings:tracking-[-0.025em] prose-headings:text-olive prose-a:font-semibold prose-a:text-olive prose-img:rounded-2xl">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {resource.content || ''}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  )
}
