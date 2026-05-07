"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OrderForm({productId, productName}:{productId:string, productName:string}){
  const [form,setForm]=useState({name:"",phone:"",address:"",note:""});
  const [done,setDone]=useState(false);
  const submit=async(e:any)=>{e.preventDefault(); await supabase.from("orders").insert({...form, product_id:productId, product_name:productName, status:"new"}); setDone(true)};
  if(done) return <div className="p-4 bg-green-50 border border-green-200 rounded-xl">Đã nhận thông tin! Mình sẽ liên hệ sớm.</div>
  return (
    <form onSubmit={submit} className="grid gap-3 max-w-md">
      <input required placeholder="Họ tên" className="border rounded-xl px-3 py-2" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input required placeholder="Số điện thoại" className="border rounded-xl px-3 py-2" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
      <input placeholder="Địa chỉ (nếu cần)" className="border rounded-xl px-3 py-2" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
      <textarea placeholder="Ghi chú" className="border rounded-xl px-3 py-2" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/>
      <button className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl">Gửi thông tin</button>
    </form>
  )
}
