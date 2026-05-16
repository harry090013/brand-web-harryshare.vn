import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function ArticleCTA() {
  return (
    <section className="mt-14 rounded-[2rem] border border-black/10 bg-[#F0FDF4] p-7 text-center md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">
        Tiếp tục khám phá
      </p>

      <h2 className="mx-auto mt-3 max-w-2xl font-[family-name:var(--font-serif)] text-3xl font-bold leading-tight tracking-[-0.035em] text-olive md:text-4xl">
        HarryShare không chỉ là một bài viết rời rạc, mà là một hệ ghi chép theo chủ đề.
      </h2>

      <p className="mx-auto mt-5 max-w-2xl leading-8 text-zinc-600">
        Bạn có thể đọc tiếp theo các cụm: tư duy sản phẩm, thương hiệu cá nhân,
        AI & vibe coding, hành trình làm nghề hoặc các tài nguyên mình đang xây.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/chu-de"
          className="inline-flex items-center justify-center rounded-full bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          Khám phá chủ đề
          <ArrowRight size={16} className="ml-2" />
        </Link>

        <Link
          href="/du-an-tai-nguyen"
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-white/80"
        >
          Dự án & Tài nguyên
        </Link>
      </div>
    </section>
  )
}
