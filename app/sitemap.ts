import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const baseUrl = 'https://harryshare.vn'

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
    changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: route === '' ? 1 : route.includes('du-an-tai-nguyen') ? 0.7 : 0.8,
  })) satisfies MetadataRoute.Sitemap

  const { data: posts } = await supabase
    .from('posts')
    .select('slug,updated_at,published_at,created_at')
    .eq('published', true)

  const postPages =
    posts?.map((post) => ({
      url: `${baseUrl}/chia-se/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at || post.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })) || []

  return [...staticPages, ...postPages]
}
