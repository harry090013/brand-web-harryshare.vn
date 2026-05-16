import { notFound } from 'next/navigation'

import DynamicPillarPage from '@/components/DynamicPillarPage'
import { buildMetadata } from '@/lib/seo'
import { getCategoryBySlug, getPostsByCategorySlug } from '@/lib/posts'
import { topicMaps } from '@/lib/topic-map'

const slug = 'thuong-hieu-ca-nhan'
const topic = topicMaps[slug]

export const revalidate = 60

export async function generateMetadata() {
  const category = await getCategoryBySlug(slug)

  return buildMetadata({
    title: category?.seo_title || 'Thương hiệu cá nhân | HarryShare',
    description:
      category?.seo_description ||
      'Ghi chép về xây dựng thương hiệu cá nhân, content pillar, định vị bản thân, kể chuyện cá nhân và tạo niềm tin.',
    path: `/${slug}`,
  })
}

export default async function PersonalBrandingPage() {
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
