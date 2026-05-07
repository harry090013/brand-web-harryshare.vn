import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function Page(){
  const { data } = await supabase.from("products_owned").select("*");
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold">Sản phẩm của tôi</h1>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {(data||[]).map((p:any)=>(
          <Link key={p.id} href={`/san-pham-cua-toi/${p.slug}`} className="border rounded-2xl p-6 hover:shadow-sm">
            <div className="font-medium text-lg">{p.name}</div>
            <div className="text-zinc-600 mt-1">{p.short_desc}</div>
            <div className="mt-4 font-semibold">{(p.price||0).toLocaleString('vi-VN')}₫</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
