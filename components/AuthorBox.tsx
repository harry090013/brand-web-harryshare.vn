import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function AuthorBox() {
  return (
    <section className="mt-14 rounded-[2rem] border border-black/10 bg-white/70 p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl bg-zinc-100">
          <Image
            src="/harry.jpg"
            alt="Harry"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">
            Viết bởi Harry
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-zinc-900">
            Mình viết để ghi lại những gì đã học, đã sai và đang thử.
          </h2>
          <p className="mt-3 leading-7 text-zinc-600">
            HarryShare là nơi mình chia sẻ về tư duy sản phẩm, thương hiệu cá nhân,
            AI, vibe coding và hành trình làm nghề từ trải nghiệm thật.
          </p>

          <Link
            href="/ve-harry"
            className="mt-5 inline-flex items-center text-sm font-semibold text-olive"
          >
            Đọc thêm về Harry
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
