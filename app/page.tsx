import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import FadeIn from '@/components/FadeIn'

export const revalidate = 60

export default async function Home() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id,title,slug,excerpt,image,published_at,created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  const { data: categories } = await supabase
    .from('categories')
    .select('name,slug,description')
    .limit(3)

  // Fallback nếu chưa có categories trong DB
  const cats = categories?.length ? categories : [
    { name: 'Làm sản phẩm', slug: 'lam-san-pham', description: 'Hành trình xây dựng sản phẩm số từ số 0.' },
    { name: 'Code thực chiến', slug: 'code', description: 'Ghi chép và chia sẻ những bài học thực tế, không lý thuyết suông.' },
    { name: 'Nhật ký Duy Xuyên', slug: 'nhat-ky', description: 'Góc nhỏ bình yên ở quê nhà.' },
  ]

  const catImages = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
  ]

  return (
    <main className="bg-cream min-h-screen">
      {/* HERO SECTION - Split Layout */}
      <section className="max-w-6xl mx-auto px-4 pt-32 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <FadeIn direction="right" delay={100}>
          <div className="max-w-xl">
            <p className="uppercase tracking-widest text-[10px] md:text-xs mb-6 text-gray-500 font-medium">Quang Hiếu • Duy Xuyên, Quảng Nam</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight text-olive font-[family-name:var(--font-serif)]">
              Những điều mình<br />học được khi làm<br /><span className="italic text-sage">sản phẩm.</span>
            </h1>
            <p className="mt-8 text-lg text-gray-600 leading-relaxed">
              Không màu mè. Viết cho chính mình của sau này. Từng phục vụ bàn → POD → code freelance. Giờ làm content.
            </p>
            <div className="mt-10 flex gap-4">
              <Link href="/chia-se" className="bg-sage text-white px-8 py-3 rounded-md font-medium text-sm hover:bg-opacity-90 transition">
                Đọc bài viết
              </Link>
              <Link href="/about" className="border border-gray-300 text-olive px-8 py-3 rounded-md font-medium text-sm hover:bg-gray-50 transition">
                Về mình
              </Link>
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="left" delay={300}>
          <div className="relative h-[600px] rounded-sm overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800"
              alt="Quang Hiếu Harry"
              className="w-full h-full object-cover"
            />
          </div>
        </FadeIn>
      </section>

      {/* RECENT POSTS - MAPPING TO 'Recent Journal Entries' */}
      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-gray-200">
        <FadeIn direction="up">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="uppercase tracking-widest text-[10px] text-gray-500 font-medium mb-2">Tạp chí</p>
              <h2 className="text-3xl font-[family-name:var(--font-serif)] text-olive">Bài viết mới nhất</h2>
            </div>
            <Link href="/chia-se" className="text-xs uppercase tracking-widest border-b border-gray-300 pb-1 hover:border-olive transition hidden md:block text-gray-500">
              Xem tất cả
            </Link>
          </div>
        </FadeIn>

        {posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-12 gap-8">
            {/* Featured Post (Trái) */}
            <div className="md:col-span-7 group cursor-pointer">
              <FadeIn direction="up" delay={200}>
                <Link href={`/chia-se/${posts[0].slug}`}>
                  <div className="overflow-hidden rounded-sm mb-6 bg-gray-100">
                    <img src={posts[0].image || 'https://placehold.co/800x450?text=Harry+Share'} alt={posts[0].title} className="w-full aspect-[4/3] object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                    {posts[0].published_at ? new Date(posts[0].published_at).toLocaleDateString('vi-VN') : new Date(posts[0].created_at).toLocaleDateString('vi-VN')} • {Math.ceil((posts[0].excerpt?.length || 0) / 500) || 3} phút
                  </div>
                  <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-serif)] text-olive leading-tight mb-3 group-hover:text-sage transition">
                    {posts[0].title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 leading-relaxed">
                    {posts[0].excerpt}
                  </p>
                </Link>
              </FadeIn>
            </div>

            {/* Smaller Posts (Phải) */}
            <div className="md:col-span-5 flex flex-col gap-8">
              {posts.slice(1, 3).map((post, index) => (
                <div key={post.id} className="group cursor-pointer">
                  <FadeIn direction="up" delay={400 + index * 200}>
                    <Link href={`/chia-se/${post.slug}`}>
                      <div className="overflow-hidden rounded-sm mb-4 bg-gray-100">
                        <img src={post.image || 'https://placehold.co/800x450?text=Harry+Share'} alt={post.title} className="w-full aspect-[16/9] object-cover transition duration-700 group-hover:scale-105" />
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                        {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </div>
                      <h3 className="text-xl font-[family-name:var(--font-serif)] text-olive leading-tight group-hover:text-sage transition">
                        {post.title}
                      </h3>
                    </Link>
                  </FadeIn>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">Chưa có bài viết nào.</div>
        )}
      </section>

      {/* ABOUT ME - MAPPING TO 'Quote Section' */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <FadeIn direction="up">
          <div className="bg-cream-alt rounded-3xl p-12 md:p-24 text-center border border-gray-200/50">
            <p className="uppercase tracking-widest text-[10px] text-gray-500 font-medium mb-8">Một chút về mình</p>
            <h2 className="text-2xl md:text-4xl leading-relaxed text-olive font-[family-name:var(--font-serif)] italic">
              "Không dạy đời, chỉ ghi lại hành trình. Vì sự chân thật luôn có sức mạnh lan tỏa bền vững nhất."
            </h2>
            <p className="mt-8 text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Mình là Quang Hiếu, một người làm content và sản phẩm số từ Quảng Nam. Mình tin vào sự phát triển chậm rãi, những thành quả nhỏ bé nhưng thiết thực.
            </p>
            <div className="mt-10">
              <Link href="/about" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium hover:text-sage transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Xem thêm về mình
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CATEGORIES - MAPPING TO 'Curated Digital Tools' */}
      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-gray-200">
        <FadeIn direction="up">
          <p className="uppercase tracking-widest text-[10px] text-gray-500 font-medium mb-2">Chuyên mục</p>
          <h2 className="text-3xl font-[family-name:var(--font-serif)] text-olive mb-12">Chủ đề chính</h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {cats.map((cat, i) => (
            <FadeIn key={cat.slug} direction="up" delay={i * 150}>
              <Link href={`/chia-se?cat=${cat.slug}`} className="bg-white p-8 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition group flex flex-col h-full">
                <div className="w-12 h-12 bg-cream-alt rounded-full flex items-center justify-center mb-6 text-sage">
                  {/* SVG Icon */}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-[family-name:var(--font-serif)] text-olive mb-3">{cat.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
                  {cat.description || 'Ghi chép và chia sẻ những bài học thực tế, không lý thuyết suông.'}
                </p>
                <div className="text-xs uppercase tracking-widest font-medium text-gray-400 group-hover:text-sage flex items-center gap-2 transition mt-auto">
                  Xem bài viết <span className="text-lg leading-none">→</span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-4 py-16 border-t border-gray-200">
        <FadeIn direction="up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-200">
            <div className="text-center px-4">
              <div className="text-4xl font-[family-name:var(--font-serif)] text-olive mb-2">3 năm</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">POD & SP số</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-[family-name:var(--font-serif)] text-olive mb-2">47</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Sản phẩm</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-[family-name:var(--font-serif)] text-olive mb-2">0đ</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Ads đơn đầu</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-[family-name:var(--font-serif)] text-olive mb-2">1</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Nguyên tắc: Thật</div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <FadeIn direction="up">
          <div className="bg-cream-alt rounded-3xl p-12 md:p-20 text-center border border-gray-200/50">
            <p className="uppercase tracking-widest text-[10px] text-gray-500 font-medium mb-4">Newsletter (2 tuần/lần)</p>
            <h2 className="text-3xl md:text-4xl text-olive font-[family-name:var(--font-serif)] mb-4">
              Góc nhỏ cho một đời sống số <br /><span className="italic">bình tĩnh</span> hơn.
            </h2>
            <p className="text-gray-600 text-sm max-w-md mx-auto mb-10">
              Tham gia cùng mọi người để nhận bài viết mới nhất. Mình chỉ gửi email khi có bài thật sự đáng đọc.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-md text-sm text-olive focus:outline-none focus:border-sage transition"
              />
              <button type="button" className="bg-sage text-white px-8 py-3 text-sm font-medium rounded-md hover:bg-opacity-90 transition whitespace-nowrap">
                Đăng ký
              </button>
            </form>
            <p className="text-xs mt-6 text-gray-400">Phật tử Chùa Trà Kiệu</p>
          </div>
        </FadeIn>
      </section>
    </main>
  )
}