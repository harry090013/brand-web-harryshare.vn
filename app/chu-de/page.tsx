import Link from 'next/link'
import { ArrowRight, Brain, Code2, Layers, PenLine } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Chủ đề | HarryShare',
  description:
    'Các cụm chủ đề chính trên HarryShare: tư duy sản phẩm, thương hiệu cá nhân, AI & vibe coding và hành trình làm nghề.',
  path: '/chu-de',
})

const topics = [
  {
    title: 'Tư duy sản phẩm',
    href: '/tu-duy-san-pham',
    icon: Brain,
    description: 'Cách quan sát người dùng, hiểu nhu cầu, xây MVP và biến ý tưởng thành sản phẩm nhỏ có giá trị.',
  },
  {
    title: 'Thương hiệu cá nhân',
    href: '/thuong-hieu-ca-nhan',
    icon: PenLine,
    description: 'Định vị bản thân, chọn content pillar, kể chuyện cá nhân và xây dựng niềm tin.',
  },
  {
    title: 'AI & Vibe Coding',
    href: '/ai-vibe-coding',
    icon: Code2,
    description: 'Cách dùng AI để tạo landing page, prototype, prompt và workflow sáng tạo.',
  },
  {
    title: 'Hành trình làm nghề',
    href: '/hanh-trinh-lam-nghe',
    icon: Layers,
    description: 'Những bài học từ trải nghiệm thật: đổi hướng, freelance, content, marketing và sản phẩm.',
  },
]

export default function TopicsPage() {
  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">Topic Clusters</p>
        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-olive md:text-7xl">
          Chủ đề chính
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
          Đây là 4 cụm nội dung chính giúp HarryShare xây topical authority và giúp người đọc tìm đúng thứ họ cần.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {topics.map((topic) => {
            const Icon = topic.icon

            return (
              <Link
                key={topic.href}
                href={topic.href}
                className="group rounded-3xl border border-black/10 bg-white/70 p-7 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-black/5"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0FDF4] text-sage">
                  <Icon size={22} />
                </div>
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-zinc-900">{topic.title}</h2>
                <p className="mt-4 leading-7 text-zinc-600">{topic.description}</p>
                <div className="mt-6 inline-flex items-center text-sm font-semibold text-olive">
                  Xem chủ đề <ArrowRight size={16} className="ml-2 transition group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
