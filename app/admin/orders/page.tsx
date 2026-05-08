'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Order = {
  id: string; product_name: string; name: string; phone: string;
  address: string; note: string; status: string; created_at: string;
  customer_email: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: 'Mới', color: 'bg-blue-50 text-blue-600' },
  processing: { label: 'Đang xử lý', color: 'bg-amber-50 text-amber-600' },
  done: { label: 'Hoàn thành', color: 'bg-[#E8F0E4] text-sage' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-50 text-red-500' },
}

export default function OrdersAdmin() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/login')
      else load()
    })
  }, [router])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    await load()
  }

  const deleteOrder = async (id: string) => {
    if (!confirm('Xóa đơn hàng này?')) return
    await supabase.from('orders').delete().eq('id', id)
    await load()
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const newCount = orders.filter(o => o.status === 'new').length

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto pb-24">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">Kinh doanh</p>
        <h1 className="text-4xl text-olive font-[family-name:var(--font-serif)]">Đơn hàng</h1>
        {newCount > 0 && (
          <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {newCount} đơn hàng mới cần xử lý
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(filter === key ? 'all' : key)}
            className={`p-4 rounded-xl border text-left transition ${filter === key ? 'border-sage bg-white shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
            <div className="text-2xl font-[family-name:var(--font-serif)] text-olive mb-1">
              {orders.filter(o => o.status === key).length}
            </div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">{cfg.label}</div>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          Không có đơn hàng nào.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_6px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50/30 transition"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-medium text-olive text-sm">{order.name}</span>
                    <span className="text-gray-400 text-xs">→</span>
                    <span className="text-xs text-gray-600">{order.product_name}</span>
                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-medium ml-auto ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-500'}`}>
                      {statusConfig[order.status]?.label || order.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {order.phone && <> · {order.phone}</>}
                  </div>
                </div>
                <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${expandedId === order.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>

              {/* Expanded Detail */}
              {expandedId === order.id && (
                <div className="px-5 pb-5 border-t border-gray-100/50 pt-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div><span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Tên khách</span>{order.name}</div>
                    <div><span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Email</span>{order.customer_email || '—'}</div>
                    <div><span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Số điện thoại</span>{order.phone || '—'}</div>
                    <div><span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Địa chỉ</span>{order.address || '—'}</div>
                    <div className="md:col-span-2"><span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Ghi chú</span>{order.note || '—'}</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider self-center mr-2">Cập nhật trạng thái:</span>
                    {Object.entries(statusConfig).map(([key, cfg]) => (
                      <button key={key} onClick={() => updateStatus(order.id, key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${order.status === key ? 'border-sage bg-[#E8F0E4] text-sage' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                        {cfg.label}
                      </button>
                    ))}
                    <button onClick={() => deleteOrder(order.id)}
                      className="ml-auto px-3 py-1.5 border border-red-200 text-red-500 rounded-lg text-xs hover:bg-red-50 transition">
                      Xóa đơn
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
