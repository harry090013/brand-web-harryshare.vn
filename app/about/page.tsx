export default function About() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w- mx-auto px-4">
        <div className="bg-white border rounded-2xl p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-6">Về Harry Share</h1>
          <div className="prose prose-neutral max-w-none">
            <p className="text-lg leading-relaxed">
              Mình là Harry. Mình viết không phải để dạy ai, mà để ghi lại những gì mình học được khi làm sản phẩm.
            </p>
            <h2>Vì sao có blog này?</h2>
            <p>Sau 3 năm làm marketing và xây sản phẩm, mình nhận ra mình quên rất nhanh. Viết lại giúp mình nhớ lâu hơn, và biết đâu giúp được ai đó đang bắt đầu.</p>
            <h2>Mình viết về gì?</h2>
            <ul>
              <li><strong>Chia sẻ</strong> — cách làm, sai lầm, bài học</li>
              <li><strong>Đã dùng</strong> — review tool, sách, khóa học mình bỏ tiền ra</li>
              <li><strong>Của tôi</strong> — sản phẩm mình đang xây</li>
            </ul>
            <p className="mt-8 italic text-gray-600">Nếu thấy hữu ích, bạn có thể theo dõi. Không thì cũng không sao.</p>
          </div>
        </div>
      </div>
    </div>
  )
}