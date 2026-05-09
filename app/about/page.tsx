import Link from 'next/link'

export const metadata = {
  title: 'Tôi là ai - Harry Share',
  description: 'Mình là Quang Hiếu (Harry). Ghi lại những gì mình làm, mình sai, mình học.',
}

export default function About() {
  return (
    <div className="bg-cream min-h-screen pt-32 pb-24">
      {/* SECTION 1: HEADER */}
      <section className="max-w-4xl mx-auto px-4 mb-24 md:mb-32">
        <p className="uppercase tracking-widest text-[10px] text-gray-500 font-medium mb-6">Ghi cho mình</p>
        <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight text-olive font-[family-name:var(--font-serif)] mb-8">
          Mình ghi lại để <br/><span className="italic text-sage">sau này mình đọc.</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
          Harry Share không phải chỗ dạy đời. Mình là Quang Hiếu, mọi người hay gọi Harry, dân IT tốt nghiệp 07/2022 ở Đà Nẵng. Mình đã thử qua đủ nghề: phục vụ, bếp chay, code freelance, quản trò sinh hoạt Đoàn Thanh Niên, sale thảo mộc, marketing spa. Ở đây mình chỉ ghi thật những gì mình làm, mình sai, mình học.
        </p>
      </section>

      {/* SECTION 2: STORY (Image Left, Text Right) */}
      <section className="max-w-6xl mx-auto px-4 mb-32">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 md:order-1 relative aspect-[3/4] md:aspect-[4/5] rounded-xl overflow-hidden shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800" 
              alt="Harry đứng ở biển" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl text-olive font-[family-name:var(--font-serif)] mb-6">
              Câu chuyện bắt đầu khi mình chán ngồi code.
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Mình sinh ở Duy Xuyên, Đà Nẵng. Học xong Công nghệ phần mềm, mình làm front-end React 6 tháng rồi đau lưng, chán ngồi một chỗ. Mình nghỉ.
              </p>
              <p>
                Sau đó mình đi thử: 1 năm làm hoạt náo đoàn xã Duy Sơn (làm 3 website, nhận 3 giấy khen), 3 tháng tự làm Thảo Mộc Hương T&T, 2 tháng quản lý quán chay Ưu Đàm, 2 tháng tư vấn phần mềm, 3 tháng sale Vương Ngọc Vegan, 3 tháng phục vụ Rex Hotel, rồi 6 tháng làm trưởng phòng marketing ở Tâm An Spa.
              </p>
              <p>
                Mình quyết định chậm lại. 2025 mình mua iPad để đi, 2026 mình build PC để ngồi. Đi để mở mắt, ngồi để làm sâu. Blog này mình viết không phải để chỉ ai, mà để sau này mình không quên mình đã nghĩ gì.
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
            "Cái gì giải quyết được bằng tiền <br className="hidden md:block"/>thì không phải là vấn đề. Mình ghi ra để nhớ <br className="hidden md:block"/>đừng để tiền làm mình mất bình tĩnh."
          </h2>
          <p className="uppercase tracking-widest text-[10px] text-gray-500 font-medium">Harry</p>
        </div>
      </section>

      {/* SECTION 4: CRAFTSMANSHIP (Text Left, Image Right) */}
      <section className="max-w-6xl mx-auto px-4 mb-32">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="uppercase tracking-widest text-[10px] text-gray-500 font-medium mb-4">Cách mình chọn</p>
            <h2 className="text-3xl md:text-4xl text-olive font-[family-name:var(--font-serif)] mb-6">
              Mình chọn kỹ, vì thời gian có hạn.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Mình từng ôm nhiều việc rồi kiệt sức. Giờ mỗi bài viết, mỗi tool mình chia sẻ đều phải trả lời được: nó có thật không, và nó có giúp mình ngày mai đỡ sai hơn không.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-gray-200/50 text-gray-600 text-[10px] uppercase tracking-widest px-4 py-2 rounded-full font-medium">Thật</span>
              <span className="bg-gray-200/50 text-gray-600 text-[10px] uppercase tracking-widest px-4 py-2 rounded-full font-medium">Thực chiến</span>
              <span className="bg-gray-200/50 text-gray-600 text-[10px] uppercase tracking-widest px-4 py-2 rounded-full font-medium">Chọn lọc</span>
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
              Những lần mình làm sai, làm ẩu, và bài học rút ra sau đó. Mình viết cho mình, ai đọc ké thì đọc.
            </p>
          </div>
          <div className="bg-white p-10 md:p-12 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
            <h3 className="text-2xl text-olive font-[family-name:var(--font-serif)] mb-4">Đã dùng</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Notion, Slack, CapCut, Canva, Photoshop, Trello, AI tools... Mình không review như chuyên gia, mình kể mình dùng thấy sao.
            </p>
          </div>
          <div className="bg-white p-10 md:p-12 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
            <h3 className="text-2xl text-olive font-[family-name:var(--font-serif)] mb-4">Của tôi</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Mấy thứ mình tự tay làm: website đoàn xã, kênh TikTok bán 300 đơn vegan, chiến dịch spa 34k/tin nhắn. Chưa lớn, nhưng thật.
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