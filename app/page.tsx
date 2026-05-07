import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const revalidate = 60

export default async function Home() {
  const { data: posts } = await supabase
  .from('posts')
  .select('id,title,slug,excerpt,image,published_at')
  .eq('published', true)
  .order('published_at', { ascending: false })
  .limit(6)

  const { data: categories } = await supabase
  .from('categories')
  .select('name,slug')
  .limit(3)

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative h-screen">
        <img
          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2000"
          alt="Harry Share"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
          <p className="uppercase tracking-widest text-sm mb-3 opacity-90">Harry Share</p>
          <h1 className="text-4xl md:text-6xl font-bold">Ghi chú nhanh</h1>
          <p className="mt-4 text-lg max-w-xl opacity-90">
            Những điều mình học được khi làm sản phẩm, không màu mè, viết cho chính mình của sau này.
          </p>
        </div>
      </section>

      {/* 3 CHUYÊN MỤC */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {(categories?.length? categories : [
            { name: 'Công việc', slug: 'work' },
            { name: 'Học tập', slug: 'learn' },
            { name: 'Cuộc sống', slug: 'life' },
          ]).map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/chia-se?category=${cat.slug}`}
              className="relative h-64 overflow-hidden group rounded-xl"
            >
              <img
                src={[
                  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
                  'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
                  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
                ][i]}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-6 py-2 font-medium shadow-md rounded">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BÀI VIẾT - KHUNG GIỮA */}
      <section className="bg-[#fafafa] py-16 border-t">
        <div className="max-w-6xl mx-auto px-4">
          {/* khung trắng ở giữa */}
          <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-10">
            <h2 className="text-2xl font-bold mb-8 text-center">Bài mới nhất</h2>

            <div className="space-y-12">
              {posts?.map((post) => (
                <article key={post.id} className="border-b last:border-0 pb-10 last:pb-0">
                  <Link href={`/chia-se/${post.slug}`}>
                    <img
                      src={post.image || 'https://placehold.co/720x400?text=Harry+Share'}
                      alt={post.title}
                      className="w-full h-64 md:h-80 object-cover rounded-xl"
                    />
                  </Link>
                  <div className="pt-5">
                    <div className="text-xs text-gray-500 mb-2">
                      {new Date(post.published_at).toLocaleDateString('vi-VN')} • 3 phút đọc
                    </div>
                    <Link href={`/chia-se/${post.slug}`}>
                      <h3 className="text-xl font-semibold hover:underline mb-2">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/chia-se" className="inline-block border rounded-lg px-6 py-2.5 hover:bg-gray-50">
                Xem tất cả bài viết →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1f1f1f] text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-white font-medium mb-3">Harry Share</h4>
            <p className="text-sm leading-relaxed max-w-sm">
              Mình viết để nhớ, không phải để dạy ai. Nếu bạn thấy hữu ích thì tốt, không thì cũng không sao.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Nhận bài mới</h4>
            <div className="flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-600 text-sm rounded"
              />
              <button className="bg-white text-black px-4 text-sm font-medium rounded">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-xs">
          © 2026 Harry Share
        </div>
      </footer>
    </main>
  )
}