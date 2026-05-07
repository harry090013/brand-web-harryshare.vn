import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 0
const PAGE_SIZE = 9

export default async function ChiaSeList({ searchParams }: { searchParams: Promise<{ cat?: string; page?: string }> }) {
  const sp = await searchParams
  const cat = sp.cat || 'all'
  const page = parseInt(sp.page || '1')
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('posts')
    .select('id,title,slug,image,excerpt,published_at,category,views', { count: 'exact' })
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (cat !== 'all') {
    query = query.eq('category', cat)
  }

  const { data: posts, count } = await query
  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'Chia sẻ', label: 'Chia sẻ' },
    { key: 'Đã dùng', label: 'Sản phẩm mình dùng' },
    { key: 'Của tôi', label: 'Sản phẩm mình sản xuất' },
  ]

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Bài viết</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(t => (
            <Link
              key={t.key}
              href={`/chia-se?cat=${encodeURIComponent(t.key)}`}
              className={`px-4 py-1.5 rounded-full border text-sm ${
                cat === t.key ? 'bg-black text-white border-black' : 'bg-white hover:bg-gray-50'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map(p => (
            <Link key={p.id} href={`/chia-se/${p.slug}`} className="group bg-white border rounded-2xl overflow-hidden hover:shadow-sm transition">
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                <img src={p.image || 'https://placehold.co/600x375'} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>
              <div className="p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">{p.category}</div>
                <h3 className="font-medium leading-snug line-clamp-2 group-hover:underline">{p.title}</h3>
                <p className="text-xs text-gray-500 mt-2">
                  {p.published_at && new Date(p.published_at).toLocaleDateString('vi-VN', { timeZone: 'Asia/Bangkok' })} • {p.views || 0} lượt xem
                </p>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1
              return (
                <Link
                  key={p}
                  href={`/chia-se?cat=${encodeURIComponent(cat)}&page=${p}`}
                  className={`w-9 h-9 grid place-items-center rounded-lg border text-sm ${
                    p === page ? 'bg-black text-white border-black' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {p}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}