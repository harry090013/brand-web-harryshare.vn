import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function Page(){
  const { data } = await supabase.from("products_affiliate").select("*").order("created_at",{ascending:false});
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold">Sản phẩm mình đã dùng</h1>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {(data||[]).map((p:any)=>(
          <div key={p.id} className="border rounded-2xl overflow-hidden">
            <img src={p.image} className="h-48 w-full object-cover"/>
            <div className="p-4">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-zinc-600 mt-1 line-clamp-2">{p.description}</div>
              <Link href={`/san-pham-da-dung/${p.slug}`} className="mt-3 inline-block text-sm underline">Xem review</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
