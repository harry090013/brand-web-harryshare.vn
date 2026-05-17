import { notFound } from 'next/navigation'

import DynamicPillarPage from '@/components/DynamicPillarPage'
import { buildMetadata } from '@/lib/seo'
import { getCategoryBySlug, getPostsByCategorySlug } from '@/lib/posts'
import { topicMaps } from '@/lib/topic-map'

const slug = 'hanh-trinh-lam-nghe'
const topic = topicMaps[slug]

export const revalidate = 60

export async function generateMetadata() {
  const category = await getCategoryBySlug(slug)

  return buildMetadata({
    title: category?.seo_title || 'Hành trình làm nghề | HarryShare',
    description:
      category?.seo_description ||
      'Những ghi chép thật về đổi hướng, nghỉ việc, freelance, content, marketing và các bài học nghề nghiệp từ trải nghiệm cá nhân.',
    path: `/${slug}`,
    image: category?.og_image || category?.cover_image,
  })
}

export default async function CareerJourneyPage() {
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
