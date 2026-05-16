import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import PostEditorForm from '@/components/PostEditorForm'
import { getCategories, getPostById } from '@/lib/posts'

type PageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function EditPostPage({ params }: PageProps) {
    const { id } = await params

    const [post, categories] = await Promise.all([
        getPostById(id),
        getCategories(),
    ])

    if (!post) {
        notFound()
    }

    return (
        <div>
            <Link
                href="/admin/posts"
                className="mb-8 inline-flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-700"
            >
                <ArrowLeft size={16} className="mr-2" />
                Quay lại danh sách bài
            </Link>

            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-500">
                    Quản lý bài viết
                </p>

                <h1 className="mt-3 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-emerald-900">
                    Sửa bài viết
                </h1>

                <p className="mt-4 max-w-2xl leading-8 text-zinc-500">
                    Cập nhật nội dung, SEO metadata, category, trạng thái xuất bản và các nhãn nổi bật.
                </p>
            </div>

            <div className="mt-10">
                <PostEditorForm
                    categories={categories}
                    post={post}
                    mode="edit"
                />
            </div>
        </div>
    )
}