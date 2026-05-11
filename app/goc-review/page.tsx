import { supabase } from "@/lib/supabase";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export const revalidate = 60;

export default async function AffiliateProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const sp = await searchParams
  const cat = sp.cat || 'all'

  const { data: products } = await supabase
    .from("products_affiliate")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  // Lấy danh sách category unique từ data thực tế
  const allCategories = Array.from(
    new Set((products || []).map((p: any) => p.category).filter(Boolean))
  ) as string[]

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    ...allCategories.map(c => ({ key: c, label: c }))
  ]

  // Filter phía client (data đã fetch hết, tránh thêm request)
  const filtered = cat === 'all'
    ? (products || [])
    : (products || []).filter((p: any) => p.category === cat)

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-cream border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <p className="uppercase tracking-widest text-[10px] text-gray-500 font-medium mb-4">Góc Review</p>
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-serif)] text-olive mb-6">
            Sản phẩm mình khuyên dùng
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Danh sách những công cụ, sách và khóa học mình đã trực tiếp trải nghiệm và thấy thực sự hữu ích cho hành trình phát triển cá nhân và làm sản phẩm số.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        {/* Category Tabs */}
        <FadeIn direction="up">
          <div className="flex flex-wrap gap-2 mb-10">
            {tabs.map(t => (
              <Link
                key={t.key}
                href={`/goc-review?cat=${encodeURIComponent(t.key)}`}
                className={`px-4 py-1.5 rounded-full border text-sm transition ${
                  cat === t.key
                    ? 'bg-olive text-white border-olive'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-olive hover:text-olive'
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </FadeIn>

        {filtered && filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p: any) => (
              <div key={p.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                <Link href={`/goc-review/${p.slug}`} className="block relative bg-gray-100 overflow-hidden" style={{ height: '220px', width: '100%' }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="group-hover:scale-105 transition duration-700" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 group-hover:scale-105 transition duration-500">
                      <svg className="w-10 h-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-gray-500">
                    {p.category || 'Review'}
                  </div>
                </Link>
                
                <div className="p-6 flex flex-col flex-1">
                  <Link href={`/goc-review/${p.slug}`} className="flex-1">
                    <h3 className="text-xl font-[family-name:var(--font-serif)] text-olive leading-snug mb-3 group-hover:text-sage transition">{p.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6">{p.description}</p>
                  </Link>

                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <Link href={`/goc-review/${p.slug}`} className="text-xs font-bold uppercase tracking-widest text-sage hover:text-olive transition flex items-center gap-2 w-fit">
                      Đọc Review <span className="text-lg leading-none">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
            {cat === 'all' ? 'Chưa có sản phẩm review nào.' : `Chưa có sản phẩm nào trong danh mục "${cat}".`}
          </div>
        )}
      </section>
    </div>
  )
}
