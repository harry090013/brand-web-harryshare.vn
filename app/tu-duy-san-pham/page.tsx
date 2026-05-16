import { notFound } from 'next/navigation'

import DynamicPillarPage from '@/components/DynamicPillarPage'
import { buildMetadata } from '@/lib/seo'
import { getCategoryBySlug, getPostsByCategorySlug } from '@/lib/posts'
import { topicMaps } from '@/lib/topic-map'

const slug = 'tu-duy-san-pham'
const topic = topicMaps[slug]

export const revalidate = 60

export async function generateMetadata() {
  const category = await getCategoryBySlug(slug)

  return buildMetadata({
    title: category?.seo_title || 'Tư duy sản phẩm | HarryShare',
    description:
      category?.seo_description ||
      'Ghi chép thực chiến về tư duy sản phẩm, product thinking, MVP, insight người dùng và cách biến ý tưởng thành sản phẩm nhỏ.',
    path: `/${slug}`,
  })
}

export default async function ProductThinkingPage() {
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
