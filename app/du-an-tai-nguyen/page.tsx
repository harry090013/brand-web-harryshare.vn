import Link from 'next/link'
import { ArrowRight, Box, Gift, Hammer, Star } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Dự án & Tài nguyên | HarryShare',
  description:
    'Sản phẩm Harry tự tạo, công cụ đang dùng, tài nguyên miễn phí và các case study nhỏ trong quá trình làm content, AI và sản phẩm.',
  path: '/du-an-tai-nguyen',
})

const sections = [
  {
    title: 'Sản phẩm của mình',
    description: 'Template, prompt pack, checklist, ebook hoặc sản phẩm số do mình tự tạo.',
    href: '/du-an-tai-nguyen/san-pham',
    icon: Box,
  },
  {
    title: 'Công cụ mình dùng',
    description: 'Các công cụ AI, marketing, website, hosting, design mà mình thật sự sử dụng hoặc thấy phù hợp.',
    href: '/du-an-tai-nguyen/cong-cu-minh-dung',
    icon: Hammer,
  },
  {
    title: 'Tài nguyên miễn phí',
    description: 'Checklist, template, prompt, file mẫu hoặc tài liệu nhỏ mình chia sẻ miễn phí.',
    href: '/du-an-tai-nguyen/tai-nguyen-mien-phi',
    icon: Gift,
  },
  {
    title: 'Case study / Thử nghiệm',
    description: 'Những lần mình thử xây landing page, content system, sản phẩm nhỏ hoặc workflow AI.',
    href: '/du-an-tai-nguyen/case-study',
    icon: Star,
  },
]

export default function ProjectsResourcesPage() {
  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">Projects & Resources</p>
        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-olive md:text-7xl">
          Dự án & Tài nguyên
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
          Những sản phẩm mình đang xây, công cụ mình thật sự sử dụng và tài nguyên mình tạo ra trong quá trình học, làm content, xây thương hiệu và thử nghiệm sản phẩm.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon

            return (
              <Link
                key={section.href}
                href={section.href}
                className="group rounded-3xl border border-black/10 bg-white/70 p-7 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-black/5"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0FDF4] text-sage">
                  <Icon size={22} />
                </div>
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-zinc-900">{section.title}</h2>
                <p className="mt-4 leading-7 text-zinc-600">{section.description}</p>
                <div className="mt-6 inline-flex items-center text-sm font-semibold text-olive">
                  Xem thêm <ArrowRight size={16} className="ml-2 transition group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 rounded-3xl border border-black/10 bg-white/70 p-7 text-sm leading-7 text-zinc-500">
          <strong className="text-zinc-800">Minh bạch affiliate:</strong> Một số liên kết trong trang này sau này có thể là affiliate link. Nếu bạn đăng ký qua link đó, mình có thể nhận một khoản hoa hồng nhỏ. Mình chỉ nên giới thiệu những công cụ mình đã dùng hoặc thật sự thấy phù hợp.
        </div>
      </section>
    </main>
  )
}
