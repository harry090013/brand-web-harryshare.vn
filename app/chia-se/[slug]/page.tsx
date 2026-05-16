import { notFound, redirect } from 'next/navigation'

import { getPostBySlug } from '@/lib/posts'
import { getPostUrl } from '@/lib/urls'

export const revalidate = 60

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function LegacyPostRedirectPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  redirect(getPostUrl(post))
}