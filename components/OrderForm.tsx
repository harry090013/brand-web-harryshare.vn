'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function OrderForm({ productId, productName, price }: { productId: string, productName: string, price: number }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', note: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.address) {
      alert('Vui lòng điền đầy đủ thông tin (kể cả địa chỉ)!')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('orders').insert({
      name: form.name,
      customer_email: form.email,
      phone: form.phone,
      address: form.address,
      note: form.note,
      product_id: productId,
      product_name: productName,
      status: 'pending'
    })

    if (error) {
      alert('Có lỗi xảy ra: ' + error.message + '\n\nGợi ý cho Admin: Bạn cần chạy lệnh SQL để thêm cột customer_address và customer_email vào bảng orders trên Supabase.')
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-sage/10 border border-sage rounded-xl p-8 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-sage text-white rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-2xl font-[family-name:var(--font-serif)] text-olive mb-2">Đăng ký thành công!</h3>
        <p className="text-sm text-gray-600 mb-6">
          Cảm ơn bạn đã quan tâm đến <span className="font-medium text-olive">{productName}</span>. Chúng tôi sẽ liên hệ với bạn qua số điện thoại <b>{form.phone}</b> hoặc gửi thông tin qua email <b>{form.email}</b> trong thời gian sớm nhất.
        </p>
        <button onClick={() => setSuccess(false)} className="text-sm font-medium text-sage hover:underline">
          Đăng ký thêm
        </button>
      </div>
    )
  }

  return (
    <div className="bg-cream-alt rounded-2xl p-6 md:p-8 border border-gray-200/50" id="order-form">
      <div className="mb-6">
        <h3 className="text-xl font-[family-name:var(--font-serif)] text-olive mb-1">Đăng ký nhận sản phẩm</h3>
        <p className="text-xs text-gray-500">Vui lòng điền thông tin chính xác để nhận tài liệu/sản phẩm.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium block mb-1.5">Họ và Tên *</label>
          <input 
            type="text" 
            required
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage transition"
            placeholder="VD: Nguyễn Văn A"
          />
        </div>
        
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium block mb-1.5">Email *</label>
          <input 
            type="email" 
            required
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage transition"
            placeholder="VD: email@example.com"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium block mb-1.5">Số điện thoại *</label>
          <input 
            type="tel" 
            required
            value={form.phone} 
            onChange={e => setForm({...form, phone: e.target.value})}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage transition"
            placeholder="VD: 0901234567"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium block mb-1.5">Địa chỉ *</label>
          <input 
            type="text" 
            required
            value={form.address} 
            onChange={e => setForm({...form, address: e.target.value})}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage transition"
            placeholder="VD: Số 123, Đường ABC, Quận XYZ..."
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium block mb-1.5">Ghi chú (Tùy chọn)</label>
          <textarea 
            rows={2}
            value={form.note} 
            onChange={e => setForm({...form, note: e.target.value})}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sage transition resize-none"
            placeholder="VD: Giao nhanh giúp mình nhé..."
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-sage text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Đang xử lý...' : (
              <>
                {price > 0 ? 'Đăng ký Mua ngay' : 'Đăng ký Nhận miễn phí'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </>
            )}
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-4">Thông tin của bạn được bảo mật tuyệt đối.</p>
        </div>
      </form>
    </div>
  )
}
