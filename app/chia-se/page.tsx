import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import FadeIn from '@/components/FadeIn'

export const revalidate = 60
const PAGE_SIZE = 9

export default async function ChiaSeList({ searchParams }: { searchParams: Promise<{ cat?: string; page?: string }> }) {
  const sp = await searchParams
  const cat = sp.cat || 'all'
  const page = parseInt(sp.page || '1')
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  // Fetch categories from DB
  const { data: catData } = await supabase.from('categories').select('name,slug').order('created_at', { ascending: true })
  const tabs = [
    { key: 'all', label: 'Tất cả' },
    ...(catData || []).map(c => ({ key: c.slug, label: c.name }))
  ]

  let query = supabase
    .from('posts')
    .select('id,title,slug,image,excerpt,published_at,category,likes', { count: 'exact' })
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (cat !== 'all') {
    query = query.eq('category', cat)
  }

  const { data: posts, count } = await query
  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <FadeIn direction="up">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Bài viết</h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map(t => (
              <Link
                key={t.key}
                href={`/chia-se?cat=${encodeURIComponent(t.key)}`}
                className={`px-4 py-1.5 rounded-full border text-sm ${cat === t.key ? 'bg-black text-white border-black' : 'bg-white hover:bg-gray-50'
                  }`}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </FadeIn>

        {posts && posts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p, index) => {
              const catName = catData?.find(c => c.slug === p.category)?.name || p.category
              return (
                <FadeIn key={p.id} direction="up" delay={index * 60}>
                  <Link href={`/chia-se/${p.slug}`} className="group bg-white border rounded-2xl overflow-hidden hover:shadow-sm transition flex flex-col h-full">
                    <div className="bg-gray-100 overflow-hidden relative" style={{ height: '220px', width: '100%' }}>
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="group-hover:scale-105 transition duration-500"
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 group-hover:scale-105 transition duration-500">
                          <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-medium">{catName}</div>
                      <h3 className="font-[family-name:var(--font-serif)] text-lg text-olive leading-snug line-clamp-2 group-hover:text-sage transition">{p.title}</h3>
                      <p className="text-xs text-gray-400 mt-auto pt-4 flex items-center gap-3">
                        <span>{p.published_at ? new Date(p.published_at).toLocaleDateString('vi-VN', { timeZone: 'Asia/Bangkok' }) : 'Vừa xong'}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                        <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> {p.likes || 0}</span>
                      </p>
                    </div>
                  </Link>
                </FadeIn>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
            Chưa có bài viết nào trong chuyên mục này.
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1
              return (
                <Link
                  key={p}
                  href={`/chia-se?cat=${encodeURIComponent(cat)}&page=${p}`}
                  className={`w-9 h-9 grid place-items-center rounded-lg border text-sm ${p === page ? 'bg-black text-white border-black' : 'bg-white hover:bg-gray-50'
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