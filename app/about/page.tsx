import Link from 'next/link'

export const metadata = {
  title: 'Tôi là ai - Harry Share',
  description: 'Câu chuyện về Quang Hiếu và hành trình xây dựng sản phẩm.',
}

export default function About() {
  return (
    <div className="bg-cream min-h-screen pt-32 pb-24">
      {/* SECTION 1: HEADER */}
      <section className="max-w-4xl mx-auto px-4 mb-24 md:mb-32">
        <p className="uppercase tracking-widest text-[10px] text-gray-500 font-medium mb-6">Triết lý sống</p>
        <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight text-olive font-[family-name:var(--font-serif)] mb-8">
          Sống và làm việc với <br className="hidden md:block"/><span className="italic text-sage">sự tỉnh thức.</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
          Harry Share là nơi ghi chép lại hành trình làm sản phẩm. Không ồn ào, tập trung vào giá trị thực cốt lõi thay vì chạy đua theo số lượng hay những chiêu trò hào nhoáng.
        </p>
      </section>

      {/* SECTION 2: STORY (Image Left, Text Right) */}
      <section className="max-w-6xl mx-auto px-4 mb-32">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 md:order-1 relative aspect-[3/4] md:aspect-[4/5] rounded-xl overflow-hidden shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800" 
              alt="Chân dung Quang Hiếu" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl text-olive font-[family-name:var(--font-serif)] mb-6">
              Câu chuyện bắt đầu từ sự tĩnh lặng.
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Mình là Harry (Quang Hiếu). Hành trình của mình bắt đầu từ những xô bồ của việc chạy theo số đông. Sau 3 năm làm marketing và xây dựng sản phẩm số, mình nhận ra điều quan trọng nhất thường bị bỏ quên khi ta cố gắng xuất hiện ở mọi nơi cùng một lúc.
              </p>
              <p>
                Mình quyết định chậm lại, rời xa những ồn ào để tập trung vào những điều thiết yếu. Mình viết trang blog này không phải để dạy ai, mà để ghi lại những gì mình học được khi tự tay làm sản phẩm.
              </p>
              <p>
                Đây không phải là câu chuyện về việc làm ít đi, mà là làm những điều thực sự có ý nghĩa với một sự tập trung tuyệt đối.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: QUOTE BLOCK */}
      <section className="max-w-5xl mx-auto px-4 mb-32">
        <div className="bg-cream-alt rounded-3xl p-12 md:p-24 text-center border border-gray-200/50">
          <div className="text-sage mb-6 flex justify-center">
            {/* Minimalist Leaf Icon */}
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-4xl leading-relaxed text-olive font-[family-name:var(--font-serif)] italic mb-8">
            "Chất lượng của sự chú tâm quyết định <br className="hidden md:block"/>chất lượng của cuộc sống."
          </h2>
          <p className="uppercase tracking-widest text-[10px] text-gray-500 font-medium">Harry Share</p>
        </div>
      </section>

      {/* SECTION 4: CRAFTSMANSHIP (Text Left, Image Right) */}
      <section className="max-w-6xl mx-auto px-4 mb-32">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="uppercase tracking-widest text-[10px] text-gray-500 font-medium mb-4">Góc nhìn</p>
            <h2 className="text-3xl md:text-4xl text-olive font-[family-name:var(--font-serif)] mb-6">
              Sự chọn lọc khắt khe.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Mình là người thích lưu giữ và chọn lọc. Mỗi công cụ được giới thiệu, mỗi khóa học được chia sẻ, và mỗi bài viết đều phải trả lời được câu hỏi: Nó có mang lại giá trị thực, và có tôn trọng thời gian của người đọc không?
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-gray-200/50 text-gray-600 text-[10px] uppercase tracking-widest px-4 py-2 rounded-full font-medium">Tối giản</span>
              <span className="bg-gray-200/50 text-gray-600 text-[10px] uppercase tracking-widest px-4 py-2 rounded-full font-medium">Thực chiến</span>
              <span className="bg-gray-200/50 text-gray-600 text-[10px] uppercase tracking-widest px-4 py-2 rounded-full font-medium">Chậm rãi</span>
            </div>
          </div>
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200" 
              alt="Góc làm việc tối giản" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SECTION 5: VALUES (3 Columns) */}
      <section className="max-w-6xl mx-auto px-4 mb-32">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-10 md:p-12 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
            <h3 className="text-2xl text-olive font-[family-name:var(--font-serif)] mb-4">Chia sẻ</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Những cách làm, sai lầm, và bài học đắt giá mình rút ra sau nhiều lần thất bại. Mình tin rằng những chia sẻ chân thật nhất luôn có sức lan tỏa mạnh mẽ.
            </p>
          </div>
          <div className="bg-white p-10 md:p-12 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
            <h3 className="text-2xl text-olive font-[family-name:var(--font-serif)] mb-4">Đã dùng</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Review trung thực về những công cụ (tools), sách, và khóa học mà mình đã trực tiếp bỏ tiền ra trải nghiệm và áp dụng vào công việc.
            </p>
          </div>
          <div className="bg-white p-10 md:p-12 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
            <h3 className="text-2xl text-olive font-[family-name:var(--font-serif)] mb-4">Của tôi</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Nơi giới thiệu những sản phẩm số (digital products) mà chính tay mình đang xây dựng, với sự chăm chút và hoàn thiện không ngừng.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA */}
      <section className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl text-olive font-[family-name:var(--font-serif)] mb-10">
          Tham gia cùng hành trình làm sản phẩm.
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/san-pham-cua-toi" className="bg-sage text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-opacity-90 transition inline-block">
            Khám phá sản phẩm
          </Link>
          <Link href="/chia-se" className="border border-gray-300 text-olive px-8 py-3 rounded-full font-medium text-sm hover:bg-gray-50 transition inline-block">
            Đọc nhật ký
          </Link>
        </div>
      </section>
    </div>
  )
}