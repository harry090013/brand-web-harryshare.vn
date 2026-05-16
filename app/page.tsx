import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen, Brain, Code2, Layers, PenLine, Sparkles, Wrench } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import FadeIn from '@/components/FadeIn'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'HarryShare | Tư duy sản phẩm, thương hiệu cá nhân và AI',
  description:
    'HarryShare là blog cá nhân của Harry về tư duy sản phẩm, thương hiệu cá nhân, AI, vibe coding và những bài học làm nghề từ trải nghiệm thật.',
  path: '/',
})

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  published_at: string | null
  created_at: string
}

const topics = [
  {
    title: 'Tư duy sản phẩm',
    slug: 'tu-duy-san-pham',
    icon: Brain,
    description: 'Cách quan sát người dùng, hiểu nhu cầu, xây MVP và biến ý tưởng thành sản phẩm nhỏ có giá trị.',
  },
  {
    title: 'Thương hiệu cá nhân',
    slug: 'thuong-hieu-ca-nhan',
    icon: PenLine,
    description: 'Ghi chép về định vị bản thân, content pillar, kể chuyện cá nhân và xây dựng niềm tin.',
  },
  {
    title: 'AI & Vibe Coding',
    slug: 'ai-vibe-coding',
    icon: Code2,
    description: 'Cách dùng AI để viết prompt, dựng landing page, prototype và làm việc như một creative director.',
  },
  {
    title: 'Hành trình làm nghề',
    slug: 'hanh-trinh-lam-nghe',
    icon: Layers,
    description: 'Những bài học thật từ phục vụ bàn, POD, code freelance, content, marketing và các lần đổi hướng.',
  },
]

const startHere = [
  {
    title: 'Mình là ai và vì sao mình viết HarryShare?',
    href: '/ve-harry',
    label: 'Về Harry',
  },
  {
    title: 'Tư duy sản phẩm là gì?',
    href: '/tu-duy-san-pham',
    label: 'Tư duy sản phẩm',
  },
  {
    title: 'Vibe coding là gì và vì sao marketer nên quan tâm?',
    href: '/ai-vibe-coding',
    label: 'AI & Vibe Coding',
  },
]

function formatDate(post: Post) {
  const date = post.published_at || post.created_at
  return new Date(date).toLocaleDateString('vi-VN')
}

function estimateReadingTime(text?: string | null) {
  if (!text) return 3
  return Math.max(3, Math.ceil(text.length / 500))
}

export default async function Home() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id,title,slug,excerpt,image,published_at,created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  const publishedPosts = (posts || []) as Post[]
  const featuredPost = publishedPosts[0]
  const latestPosts = publishedPosts.slice(1, 6)

  return (
    <main className="bg-cream text-zinc-900">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,83,45,0.12),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.1),transparent_34%)]" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-[1.08fr_0.92fr] md:items-center md:py-28">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-zinc-600 shadow-sm">
              <Sparkles size={16} className="text-sage" />
              Personal notes on product, brand, AI & career
            </div>

            <h1 className="mt-7 max-w-4xl font-[family-name:var(--font-serif)] text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-olive md:text-7xl">
              Tư duy sản phẩm cho người làm content và thương hiệu.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600 md:text-xl">
              Mình ghi lại những gì đã học, đã sai và đang thử trong hành trình làm sản phẩm, content, AI và thương hiệu cá nhân.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/ghi-chep"
                className="inline-flex items-center justify-center rounded-full bg-olive px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-olive/15 transition hover:-translate-y-0.5"
              >
                Đọc ghi chép
                <ArrowRight size={17} className="ml-2" />
              </Link>
              <Link
                href="/chu-de"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/70 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-white"
              >
                Khám phá chủ đề
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={120} direction="left">
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-sage/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white p-5 shadow-2xl shadow-black/10">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-zinc-100">
                  <Image
                    src="/harry.jpg"
                    alt="HarryShare - Quang Hiếu"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-3 pt-5">
                  <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">Current focus</p>
                  <h2 className="mt-3 font-[family-name:var(--font-serif)] text-3xl font-bold leading-tight text-olive">
                    Build small, write honestly, learn in public.
                  </h2>
                  <p className="mt-4 leading-7 text-zinc-600">
                    Một tạp chí cá nhân về sản phẩm, thương hiệu, AI và hành trình làm nghề của một người đang học thật, làm thật, viết thật.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* START HERE */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <FadeIn>
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">Start Here</p>
              <h2 className="mt-3 font-[family-name:var(--font-serif)] text-4xl font-bold tracking-[-0.035em] text-olive md:text-5xl">
                Nếu bạn mới biết HarryShare
              </h2>
            </div>
            <p className="max-w-xl leading-7 text-zinc-600">
              Bắt đầu từ 3 điểm này để hiểu mình là ai, mình viết về điều gì và vì sao website này tồn tại.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-3">
          {startHere.map((item, index) => (
            <FadeIn key={item.title} delay={index * 80}>
              <Link
                href={item.href}
                className="group block rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-black/5"
              >
                <div className="mb-10 flex items-center justify-between text-sm text-zinc-400">
                  <span>{item.label}</span>
                  <span>0{index + 1}</span>
                </div>
                <h3 className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-zinc-900">
                  {item.title}
                </h3>
                <div className="mt-6 inline-flex items-center text-sm font-semibold text-olive">
                  Đọc tiếp
                  <ArrowRight size={16} className="ml-2 transition group-hover:translate-x-1" />
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* TOPIC CLUSTERS */}
      <section className="border-y border-black/10 bg-white/45">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <FadeIn>
            <div className="mb-9">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">Topic Clusters</p>
              <h2 className="mt-3 font-[family-name:var(--font-serif)] text-4xl font-bold tracking-[-0.035em] text-olive md:text-5xl">
                4 cụm nội dung chính
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-4 md:grid-cols-2">
            {topics.map((topic, index) => {
              const Icon = topic.icon

              return (
                <FadeIn key={topic.slug} delay={index * 80}>
                  <Link
                    href={`/${topic.slug}`}
                    className="group flex h-full gap-5 rounded-3xl border border-black/10 bg-cream p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-black/5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F0FDF4] text-sage">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.025em] text-zinc-900">{topic.title}</h3>
                      <p className="mt-3 leading-7 text-zinc-600">{topic.description}</p>
                      <div className="mt-5 inline-flex items-center text-sm font-semibold text-olive">
                        Vào chủ đề
                        <ArrowRight size={16} className="ml-2 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* POSTS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <FadeIn>
          <div className="mb-9 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">Ghi chép</p>
              <h2 className="mt-3 font-[family-name:var(--font-serif)] text-4xl font-bold tracking-[-0.035em] text-olive md:text-5xl">
                Bài viết mới nhất
              </h2>
            </div>
            <Link href="/ghi-chep" className="hidden items-center text-sm font-semibold text-olive md:inline-flex">
              Xem tất cả <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </FadeIn>

        {featuredPost ? (
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <FadeIn>
              <Link
                href={`/chia-se/${featuredPost.slug}`}
                className="group block overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
              >
                <div className="relative aspect-[16/9] bg-zinc-100">
                  {featuredPost.image ? (
                    <Image src={featuredPost.image} alt={featuredPost.title} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#F0FDF4] text-olive">
                      <BookOpen size={42} />
                    </div>
                  )}
                </div>
                <div className="p-7">
                  <p className="text-sm text-zinc-400">
                    {formatDate(featuredPost)} • {estimateReadingTime(featuredPost.excerpt)} phút đọc
                  </p>
                  <h3 className="mt-4 font-[family-name:var(--font-serif)] text-4xl font-bold leading-tight tracking-[-0.035em] text-zinc-900">
                    {featuredPost.title}
                  </h3>
                  {featuredPost.excerpt && (
                    <p className="mt-5 leading-8 text-zinc-600">{featuredPost.excerpt}</p>
                  )}
                  <div className="mt-6 inline-flex items-center text-sm font-semibold text-olive">
                    Đọc bài nổi bật
                    <ArrowRight size={16} className="ml-2 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </FadeIn>

            <div className="space-y-4">
              {latestPosts.slice(0, 4).map((post, index) => (
                <FadeIn key={post.id} delay={index * 70}>
                  <Link
                    href={`/chia-se/${post.slug}`}
                    className="group block rounded-3xl border border-black/10 bg-white/70 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-black/5"
                  >
                    <p className="text-sm text-zinc-400">{formatDate(post)}</p>
                    <h3 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.02em] text-zinc-900">
                      {post.title}
                    </h3>
                    <div className="mt-5 inline-flex items-center text-sm font-semibold text-olive">
                      Đọc tiếp
                      <ArrowRight size={16} className="ml-2 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-black/15 bg-white/60 p-10 text-center text-zinc-500">
            Chưa có bài viết nào. Sau khi bạn thêm bài trong Supabase, khu vực này sẽ tự hiển thị.
          </div>
        )}
      </section>

      {/* PROJECTS & RESOURCES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <FadeIn>
          <div className="grid gap-5 rounded-[2rem] border border-black/10 bg-olive p-8 text-white shadow-xl shadow-olive/10 md:grid-cols-[0.8fr_1.2fr] md:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/50">Projects & Resources</p>
              <h2 className="mt-4 font-[family-name:var(--font-serif)] text-4xl font-bold leading-tight tracking-[-0.035em] md:text-5xl">
                Dự án, sản phẩm và tài nguyên mình thật sự dùng.
              </h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-white/70">
                Đây sẽ là nơi mình đặt sản phẩm tự tạo, tài nguyên miễn phí, công cụ mình dùng và các case study nhỏ. Về sau phần này có thể hỗ trợ affiliate và bán sản phẩm số mà vẫn giữ được sự minh bạch.
              </p>
              <Link
                href="/du-an-tai-nguyen"
                className="mt-7 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-olive transition hover:-translate-y-0.5"
              >
                Xem Dự án & Tài nguyên
                <ArrowRight size={17} className="ml-2" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ABOUT */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <FadeIn>
          <div className="grid gap-8 rounded-[2rem] border border-black/10 bg-white/70 p-8 md:grid-cols-[0.85fr_1.15fr] md:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">Về Harry</p>
              <h2 className="mt-4 font-[family-name:var(--font-serif)] text-4xl font-bold leading-tight tracking-[-0.035em] text-olive md:text-5xl">
                Không đi đường thẳng, nhưng có ghi chép lại.
              </h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-zinc-600">
                Mình từng làm nhiều việc khác nhau trước khi đến với content và marketing. HarryShare là nơi mình lưu lại hành trình đó: những thứ đã thử, những lỗi đã gặp và những bài học muốn giữ lại cho chính mình của sau này.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Phục vụ bàn', 'POD', 'Code freelance', 'Content / Marketing', 'Xây sản phẩm nhỏ'].map((item, index) => (
                  <span
                    key={item}
                    className="rounded-full border border-black/10 bg-cream px-4 py-2 text-sm font-medium text-zinc-700"
                  >
                    {index + 1}. {item}
                  </span>
                ))}
              </div>
              <Link href="/ve-harry" className="mt-8 inline-flex items-center text-sm font-semibold text-olive">
                Đọc thêm về mình <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-8">
        <FadeIn>
          <div className="rounded-[2rem] border border-black/10 bg-[#F0FDF4] p-8 text-center md:p-12">
            <Wrench className="mx-auto mb-5 text-sage" size={30} />
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">Follow</p>
            <h2 className="mx-auto mt-4 max-w-3xl font-[family-name:var(--font-serif)] text-4xl font-bold leading-tight tracking-[-0.035em] text-olive md:text-5xl">
              Nhận những ghi chép mới khi mình có điều thật sự đáng chia sẻ.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-zinc-600">
              Giai đoạn đầu, bạn có thể theo dõi HarryShare qua các kênh social. Khi newsletter sẵn sàng, phần này sẽ được nâng cấp thành form đăng ký email.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/lien-he" className="rounded-full bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                Kết nối với Harry
              </Link>
              <Link href="/ghi-chep" className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-white/80">
                Đọc bài mới nhất
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </main>
  )
}