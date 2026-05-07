import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase' // đường dẫn của bạn

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://harryshare.vn'

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('published', true)

  return [
    {
      url: site,
      lastModified: new Date(),
    },
    {
      url: `${site}/chia-se`,
      lastModified: new Date(),
    },
    ...(posts || []).map(p => ({
      url: `${site}/chia-se/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    })),
  ]
}