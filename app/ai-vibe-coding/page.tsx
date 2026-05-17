import { notFound } from 'next/navigation'

import DynamicPillarPage from '@/components/DynamicPillarPage'
import { buildMetadata } from '@/lib/seo'
import { getCategoryBySlug, getPostsByCategorySlug } from '@/lib/posts'
import { topicMaps } from '@/lib/topic-map'

const slug = 'ai-vibe-coding'
const topic = topicMaps[slug]

export const revalidate = 60

export async function generateMetadata() {
  const category = await getCategoryBySlug(slug)

  return buildMetadata({
    title: category?.seo_title || 'AI & Vibe Coding | HarryShare',
    description:
      category?.seo_description ||
      'Ghi chép thực chiến về AI, vibe coding, Lovable, prompt tạo landing page và cách dùng AI để prototype sản phẩm.',
    path: `/${slug}`,
    image: category?.og_image || category?.cover_image,
  })
}

export default async function AIVibeCodingPage() {
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const posts = await getPostsByCategorySlug(slug)

  return (
    <DynamicPillarPage
      category={category}
      posts={posts}
      primaryKeyword={topic.primaryKeyword}
      relatedKeywords={[...topic.relatedKeywords]}
      startHereTitle={topic.startHereTitle}
      startHereDescription={topic.startHereDescription}
      suggestedPosts={[...topic.suggestedPosts]}
    />
  )
}
