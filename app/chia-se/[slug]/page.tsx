import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ShareBar from './share-bar'
import LikeButton from './like-button'
import { marked } from 'marked'
import CommentBox from '@/components/CommentBox'
import FadeIn from '@/components/FadeIn'

export const revalidate = 0

// ✅ FIX: params là Promise trong Next 15
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: post } = await supabase.from('posts').select('title,excerpt,image').eq('slug', slug).single()
  if (!post) return {}
  return {
    title: `${post.title} | Harry Share`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
      type: 'article',
    },
  }
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return notFound()

  const { data: related } = await supabase
    .from('posts')
    .select('id,title,slug,image,published_at')
    .eq('published', true)
    .eq('category', post.category)
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const html = marked.parse(post.content || '', {
    breaks: true,
    gfm: true,
  })

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-[1fr_320px] gap-10">
        
        <FadeIn direction="up">
          <article className="bg-white rounded-2xl border p-6 md:p-8">
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
            {post.category || 'Chia sẻ'}
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-3">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
            <span>{new Date(post.published_at).toLocaleDateString('vi-VN', { timeZone: 'Asia/Bangkok' })}</span>
            {post.read_time && (
              <>
                <span>•</span>
                <span>{post.read_time} phút đọc</span>
              </>
            )}
          </div>

          {post.image && (
            <div className="mb-8 overflow-hidden rounded-xl">
              <img src={post.image} alt={post.title} className="w-full h-auto" />
            </div>
          )}

          {post.excerpt && (
            <p className="text-gray-700 italic border-l-4 pl-4 mb-6">{post.excerpt}</p>
          )}

          <div 
            className="prose prose-neutral max-w-none prose-img:rounded-xl prose-a:text-blue-600 prose-headings:font-semibold prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: html as string }} 
          />

          <div className="mt-10 pt-6 border-t flex items-center justify-between flex-wrap gap-4">
            <LikeButton postId={post.id} initialLikes={post.likes || 0} />
            <ShareBar title={post.title} slug={post.slug} />
          </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-xl font-[family-name:var(--font-serif)] text-olive mb-6">Bình luận</h3>
              <CommentBox slug={post.slug} />
            </div>
          </article>
        </FadeIn>

        <aside className="space-y-6">
          <FadeIn direction="left" delay={200}>
            <div className="bg-white rounded-2xl border p-5">
            <h3 className="font-semibold mb-4">Đọc tiếp</h3>
            <div className="space-y-4">
              {related?.length ? related.map((r) => (
                <Link key={r.id} href={`/chia-se/${r.slug}`} className="flex gap-3 group">
                  <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={r.image || 'https://placehold.co/160x128'} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium leading-snug line-clamp-2 group-hover:underline">{r.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{new Date(r.published_at).toLocaleDateString('vi-VN', { timeZone: 'Asia/Bangkok' })}</p>
                  </div>
                </Link>
              )) : (
                <p className="text-sm text-gray-500">Chưa có bài liên quan</p>
              )}
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={300}>
            <div className="bg-white rounded-2xl border p-5 text-sm text-gray-600">
              <p>Harry Share — ghi chú nhanh khi làm sản phẩm.</p>
              <Link href="/chia-se" className="text-blue-600 hover:underline mt-2 inline-block">Xem tất cả bài →</Link>
            </div>
          </FadeIn>
        </aside>
      </div>
    </div>
  )
}