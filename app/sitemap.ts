import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { siteConfig } from '@/lib/site'

const baseUrl = siteConfig.url

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/ghi-chep',
    '/chu-de',
    '/tu-duy-san-pham',
    '/thuong-hieu-ca-nhan',
    '/ai-vibe-coding',
    '/hanh-trinh-lam-nghe',
    '/du-an-tai-nguyen',
    '/du-an-tai-nguyen/san-pham',
    '/du-an-tai-nguyen/cong-cu-minh-dung',
    '/du-an-tai-nguyen/tai-nguyen-mien-phi',
    '/du-an-tai-nguyen/case-study',
    '/ve-harry',
    '/lien-he',
  ]

  const staticPages = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'weekly' : 'monthly') as any,
    priority:
      route === ''
        ? 1
        : route === '/ghi-chep' || route === '/chu-de'
          ? 0.9
          : route.includes('du-an-tai-nguyen')
            ? 0.7
            : 0.8,
  }))

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      slug,
      updated_at,
      published_at,
      created_at,
      categories (
        slug
      )
    `)
    .eq('published', true)

  const postPages =
    posts?.map((post) => {
      const categoryData = Array.isArray(post.categories)
        ? post.categories[0]
        : post.categories

      const categorySlug = categoryData?.slug
      const path = categorySlug
        ? `/${categorySlug}/${post.slug}`
        : `/chia-se/${post.slug}`

      return {
        url: `${baseUrl}${path}`,
        lastModified: new Date(
          post.updated_at || post.published_at || post.created_at
        ),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }
    }) || []

  const { data: resources } = await supabase
    .from('resources')
    .select('slug,updated_at,published_at,created_at')
    .eq('published', true)

  const resourcePages =
    resources?.map((resource) => ({
      url: `${baseUrl}/du-an-tai-nguyen/${resource.slug}`,
      lastModified: new Date(
        resource.updated_at || resource.published_at || resource.created_at
      ),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || []

  return [...staticPages, ...postPages, ...resourcePages]
}
