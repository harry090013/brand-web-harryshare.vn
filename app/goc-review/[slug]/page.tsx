import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60; // ISR 1 minute

export default async function AffiliateProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const { data: product } = await supabase
    .from("products_affiliate")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) return notFound();

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <section className="bg-cream border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 py-16 lg:py-24 text-center">
          <Link href="/goc-review" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-gray-500 hover:text-sage transition mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Tất cả Review
          </Link>
          
          <h1 className="text-4xl lg:text-6xl font-[family-name:var(--font-serif)] text-olive leading-tight mb-6">
            {product.name}
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            {product.description}
          </p>

          <a 
            href={product.affiliate_url} 
            rel="sponsored nofollow" 
            target="_blank" 
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-olive text-white rounded-xl text-sm font-medium hover:bg-sage transition shadow-sm"
          >
            Đến trang sản phẩm
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </section>

      {/* Featured Image */}
      {product.image && (
        <section className="max-w-5xl mx-auto px-4 -mt-10 lg:-mt-16 relative z-10">
          <div className="aspect-[21/9] md:aspect-[21/9] bg-white p-2 rounded-2xl shadow-xl">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-16 lg:py-24">
        <div className="prose prose-olive prose-lg max-w-none">
          {product.content_html ? (
            <div dangerouslySetInnerHTML={{ __html: product.content_html }} />
          ) : (
            <div className="text-gray-500 italic text-center">Bài review chi tiết đang được cập nhật...</div>
          )}
        </div>

        {/* Bottom CTA */}
        {product.affiliate_url && (
          <div className="mt-16 pt-12 border-t border-gray-200 text-center">
            <h3 className="text-2xl font-[family-name:var(--font-serif)] text-olive mb-6">Bạn quan tâm đến {product.name}?</h3>
            <a 
              href={product.affiliate_url} 
              rel="sponsored nofollow" 
              target="_blank" 
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-sage text-white rounded-xl text-sm font-medium hover:bg-opacity-90 transition shadow-sm"
            >
              Tìm hiểu ngay
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        )}
      </section>
    </div>
  )
}
