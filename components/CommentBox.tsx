"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CommentBox({ slug }:{slug:string}) {
  const [list,setList]=useState<any[]>([]);
  const [name,setName]=useState(""); const [content,setContent]=useState("");
  const load=async()=>{ const {data}=await supabase.from("comments").select("*").eq("post_slug",slug).eq("approved",true).order("created_at",{ascending:false}); setList(data||[]) };
  useEffect(()=>{load()},[slug]);
  const submit=async(e:any)=>{ e.preventDefault(); if(!name||!content) return; await supabase.from("comments").insert({post_slug:slug,name,content}); setContent(""); alert("Cảm ơn! Bình luận sẽ hiển thị sau khi duyệt."); };
  return (
    <div>
      <h3 className="font-medium mb-3">Bình luận</h3>
      <form onSubmit={submit} className="grid gap-2 mb-6">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tên của bạn" className="border rounded-xl px-3 py-2" />
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Viết bình luận..." className="border rounded-xl px-3 py-2 h-24" />
        <button className="px-4 py-2 bg-zinc-900 text-white rounded-xl w-fit">Gửi</button>
      </form>
      <div className="space-y-4">{list.map(c=>(<div key={c.id} className="border rounded-xl p-3"><div className="text-sm font-medium">{c.name}</div><div className="text-sm text-zinc-700 mt-1">{c.content}</div></div>))}</div>
    </div>
  )
}
