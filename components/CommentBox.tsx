"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CommentBox({ slug }: { slug: string }) {
  const [list, setList] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    // Query bằng post_slug (mới) hoặc article_id (cũ) tùy schema thực tế
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_slug", slug)
      .eq("approved", true)
      .order("created_at", { ascending: false });
    setList(data || []);
  };

  useEffect(() => { load() }, [slug]);

  const submit = async (e: any) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setSubmitting(true);

    // Chỉ gửi post_slug, name, content (schema mới)
    const { error } = await supabase.from("comments").insert({ post_slug: slug, name, content });
    if (error) {
      alert("Có lỗi khi gửi bình luận. Vui lòng thử lại!");
    } else {
      setContent("");
      setName("");
      alert("Cảm ơn! Bình luận của bạn sẽ hiển thị sau khi được duyệt.");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-16 pt-10 border-t border-gray-200">
      <h3 className="text-2xl text-olive font-[family-name:var(--font-serif)] mb-8">Bình luận</h3>

      <form onSubmit={submit} className="mb-10 space-y-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Tên của bạn"
          required
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-cream focus:outline-none focus:border-sage transition"
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          required
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-cream focus:outline-none focus:border-sage resize-none transition"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-sage text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-opacity-90 transition disabled:opacity-50"
        >
          {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
        </button>
      </form>

      <div className="space-y-6">
        {list.length === 0 && (
          <p className="text-sm text-gray-400 italic">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        )}
        {list.map(c => (
          <div key={c.id} className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-cream-alt flex items-center justify-center text-xs font-bold text-olive uppercase shrink-0">
              {c.name?.charAt(0) || '?'}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-olive mb-1">{c.name}</div>
              <div className="text-sm text-gray-600 leading-relaxed">{c.content}</div>
              <div className="text-[10px] text-gray-400 mt-1">
                {new Date(c.created_at).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
