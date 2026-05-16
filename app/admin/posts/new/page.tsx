import PostEditorForm from '@/components/PostEditorForm'
import { getCategories } from '@/lib/posts'

export default async function NewPostPage() {
  const categories = await getCategories()

  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-500">
          Quản lý bài viết
        </p>

        <h1 className="mt-3 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-emerald-900">
          Tạo bài viết mới
        </h1>

        <p className="mt-4 max-w-2xl leading-8 text-zinc-500">
          Tạo bài viết theo schema mới: category, SEO metadata, featured,
          start here và trạng thái xuất bản.
        </p>
      </div>

      <div className="mt-10">
        {categories.length > 0 ? (
          <PostEditorForm categories={categories} />
        ) : (
          <div className="rounded-3xl border border-dashed border-black/15 bg-white/70 p-10 text-center text-zinc-500">
            Chưa có category nào trong database. Hãy seed 4 category chính trước.
          </div>
        )}
      </div>
    </div>
  )
}
