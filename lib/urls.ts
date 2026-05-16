import type { Post } from '@/lib/types'

export function getPostUrl(
  post: Pick<Post, 'slug' | 'categories'>
) {
  const categorySlug = post.categories?.slug

  if (!categorySlug) {
    return `/chia-se/${post.slug}`
  }

  return `/${categorySlug}/${post.slug}`
}

export function getLegacyPostUrl(post: Pick<Post, 'slug'>) {
  return `/chia-se/${post.slug}`
}

export function getCategoryUrl(slug?: string | null) {
  if (!slug) return '/ghi-chep'
  return `/${slug}`
}
