import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderForm from "@/components/OrderForm";

export const revalidate = 60; // ISR 1 minute

export default async function OwnedProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const { data: product } = await supabase
    .from("products_owned")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) return notFound();

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header with Image */}
      <section className="bg-cream border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="order-2 lg:order-1">
            <Link href="/san-pham-cua-toi" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-gray-500 hover:text-sage transition mb-8">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Quay lại danh sách
            </Link>
            
            <h1 className="text-4xl lg:text-5xl font-[family-name:var(--font-serif)] text-olive leading-tight mb-6">
              {product.name}
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {product.short_desc}
            </p>

            <div className="flex items-end gap-4 mb-10">
              <div className="text-3xl font-bold text-sage">
                {product.price ? `${product.price.toLocaleString('vi-VN')} đ` : 'Miễn phí'}
              </div>
              {product.original_price > product.price && (
                <div className="text-lg text-gray-400 line-through pb-1">
                  {product.original_price.toLocaleString('vi-VN')} đ
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#order-form" className="px-8 py-3.5 bg-sage text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition shadow-sm text-center">
                Đăng ký ngay
              </a>
              <a href="#details" className="px-8 py-3.5 border border-gray-300 text-olive rounded-lg text-sm font-medium hover:bg-gray-50 transition text-center">
                Xem chi tiết
              </a>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-100 border border-gray-200/50">
              {product.images && product.images[0] ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Content & Form */}
      <section className="max-w-6xl mx-auto px-4 py-16 lg:py-24" id="details">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Main Content (Rich Text) */}
          <div className="lg:col-span-7 prose prose-olive prose-lg max-w-none">
            {product.content_html ? (
              <div dangerouslySetInnerHTML={{ __html: product.content_html }} />
            ) : (
              <div className="text-gray-500 italic">Sản phẩm này chưa có bài viết giới thiệu chi tiết.</div>
            )}
          </div>

          {/* Sidebar (Order Form) */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24">
              <OrderForm 
                productId={product.id} 
                productName={product.name} 
                price={product.price || 0} 
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
