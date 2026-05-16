import type { Post } from '@/lib/types'

export function getPostUrl(post: Pick<Post, 'slug'>) {
  return `/chia-se/${post.slug}`
}

export function getCategoryUrl(slug?: string | null) {
  if (!slug) return '/ghi-chep'
  return `/${slug}`
}
