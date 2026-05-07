import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function Page({params}:{params:{slug:string}}){
  const { data:p } = await supabase.from("products_affiliate").select("*").eq("slug",params.slug).single();
  if(!p) return <div className="p-12">Không tìm thấy</div>;
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold">{p.name}</h1>
      <img src={p.image} className="rounded-2xl mt-6"/>
      <div className="prose mt-6" dangerouslySetInnerHTML={{__html:p.content_html||""}}/>
      <Link href={p.affiliate_url} rel="sponsored nofollow" target="_blank" className="mt-8 inline-block px-5 py-3 bg-primary text-white rounded-xl">Mua ngay →</Link>
    </div>
  )
}
