"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PostsAdmin(){
  const [posts,setPosts]=useState<any[]>([]);
  const [form,setForm]=useState({title:"",slug:"",category:"Công việc",description:"",content_html:"",image:""});
  const load=async()=>{ const {data}=await supabase.from("posts").select("*").order("created_at",{ascending:false}); setPosts(data||[]) };
  useEffect(()=>{load()},[]);
  const save=async()=>{ await supabase.from("posts").insert({...form, published:true, published_at:new Date().toISOString()}); setForm({title:"",slug:"",category:"Công việc",description:"",content_html:"",image:""}); load() };
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Bài viết</h1>
      <div className="mt-6 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-medium mb-3">Tạo mới</h2>
          <div className="grid gap-2">
            <input placeholder="Tiêu đề" className="border rounded px-3 py-2" value={form.title} onChange={e=>setForm({...form,title:e.target.value, slug:e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-')})}/>
            <input placeholder="Slug" className="border rounded px-3 py-2" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})}/>
            <input placeholder="Ảnh cover URL" className="border rounded px-3 py-2" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/>
            <textarea placeholder="Nội dung HTML" className="border rounded px-3 py-2 h-40" value={form.content_html} onChange={e=>setForm({...form,content_html:e.target.value})}/>
            <button onClick={save} className="bg-zinc-900 text-white rounded px-4 py-2 w-fit">Lưu</button>
          </div>
        </div>
        <div>
          <h2 className="font-medium mb-3">Danh sách</h2>
          <div className="space-y2">{posts.map(p=>(<div key={p.id} className="border-b py-2 text-sm">{p.title}</div>))}</div>
        </div>
      </div>
    </div>
  )
}
