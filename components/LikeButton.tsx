"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LikeButton({ slug, initial=0 }: { slug:string, initial?:number }) {
  const [likes, setLikes] = useState(initial);
  const [liked, setLiked] = useState(false);

  useEffect(()=>{ setLiked(localStorage.getItem("liked_"+slug)==="1") },[slug]);

  const toggle = async () => {
    if (liked) return;
    setLiked(true); setLikes(l=>l+1);
    localStorage.setItem("liked_"+slug,"1");
    await supabase.rpc("increment_likes", { post_slug: slug });
  }
  return <button onClick={toggle} className={`px-4 py-2 rounded-xl border ${liked?"bg-zinc-900 text-white":"hover:bg-zinc-50"}`}>♥ {likes} lượt thích</button>
}
