import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Về Harry | HarryShare',
  description:
    'Câu chuyện của Harry: từ phục vụ bàn, POD, code freelance đến content, marketing, sản phẩm và hành trình xây HarryShare.',
  path: '/ve-harry',
})

export default function AboutHarryPage() {
  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">About</p>
        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-olive md:text-7xl">
          Về Harry
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
          Mình là Harry. Mình viết HarryShare để ghi lại những gì đã học, đã sai và đang thử trong hành trình làm sản phẩm, content, AI và thương hiệu cá nhân.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {['Phục vụ bàn', 'POD', 'Code freelance', 'Content / Marketing', 'Xây sản phẩm nhỏ'].map((item, index) => (
            <div key={item} className="rounded-3xl border border-black/10 bg-white/70 p-5">
              <p className="text-sm text-zinc-400">0{index + 1}</p>
              <h2 className="mt-4 text-lg font-semibold text-zinc-900">{item}</h2>
            </div>
          ))}
        </div>

        <Link href="/ghi-chep" className="mt-10 inline-flex items-center rounded-full bg-olive px-6 py-3 text-sm font-semibold text-white">
          Đọc ghi chép của mình <ArrowRight size={16} className="ml-2" />
        </Link>
      </section>
    </main>
  )
}
