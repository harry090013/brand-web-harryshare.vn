import { supabase } from "@/lib/supabase";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export const revalidate = 60;

export default async function OwnedProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const sp = await searchParams
  const cat = sp.cat || 'all'

  const { data: products } = await supabase
    .from("products_owned")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  // Lấy danh mục unique từ data thực tế
  const allCategories = Array.from(
    new Set((products || []).map((p: any) => p.category).filter(Boolean))
  ) as string[]

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    ...allCategories.map(c => ({ key: c, label: c }))
  ]

  const filtered = cat === 'all'
    ? (products || [])
    : (products || []).filter((p: any) => p.category === cat)

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-cream border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <p className="uppercase tracking-widest text-[10px] text-gray-500 font-medium mb-4">Sản phẩm kỹ thuật số</p>
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-serif)] text-olive mb-6">
            Sản phẩm của tôi
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Những tài liệu, công cụ và quy trình thực chiến do chính mình đúc kết sau nhiều năm làm nghề. Hy vọng chúng sẽ giúp bạn rút ngắn thời gian mài mò.
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
                href={`/san-pham-cua-toi?cat=${encodeURIComponent(t.key)}`}
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
                <Link href={`/san-pham-cua-toi/${p.slug}`} className="block relative bg-gray-100 overflow-hidden" style={{ height: '220px', width: '100%' }}>
                  {p.images && p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} className="group-hover:scale-105 transition duration-700" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 group-hover:scale-105 transition duration-500">
                      <svg className="w-10 h-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-sage">
                    {p.category || 'Sản phẩm'}
                  </div>
                </Link>
                
                <div className="p-6 flex flex-col flex-1">
                  <Link href={`/san-pham-cua-toi/${p.slug}`} className="flex-1">
                    <h3 className="text-xl font-[family-name:var(--font-serif)] text-olive leading-snug mb-3 group-hover:text-sage transition">{p.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6">{p.short_desc}</p>
                  </Link>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div>
                      {p.original_price > p.price && (
                        <div className="text-[10px] text-gray-400 line-through mb-0.5">
                          {p.original_price.toLocaleString('vi-VN')} đ
                        </div>
                      )}
                      <div className="font-bold text-olive">
                        {p.price ? `${p.price.toLocaleString('vi-VN')} đ` : 'Miễn phí'}
                      </div>
                    </div>
                    
                    <Link href={`/san-pham-cua-toi/${p.slug}`} className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-olive group-hover:bg-sage group-hover:text-white transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
            {cat === 'all' ? 'Chưa có sản phẩm nào.' : `Chưa có sản phẩm nào trong danh mục "${cat}".`}
          </div>
        )}
      </section>
    </div>
  )
}
