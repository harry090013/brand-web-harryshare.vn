import { supabase } from "@/lib/supabase";
import OrderForm from "@/components/OrderForm";

export default async function Page({params}:{params:{slug:string}}){
  const { data:p } = await supabase.from("products_owned").select("*").eq("slug",params.slug).single();
  if(!p) return null;
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold">{p.name}</h1>
      <p className="text-zinc-600 mt-2">{p.short_desc}</p>
      <div className="prose mt-6" dangerouslySetInnerHTML={{__html:p.content_html||""}}/>
      <div className="mt-10 border-t pt-8">
        <h3 className="font-medium mb-3">Đặt mua</h3>
        <OrderForm productId={p.id} productName={p.name} />
      </div>
    </div>
  )
}
