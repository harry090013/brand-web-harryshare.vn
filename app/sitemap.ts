import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://harryshare.vn'

  const [ { data: posts }, { data: owned }, { data: affiliate } ] = await Promise.all([
    supabase.from('posts').select('slug, updated_at').eq('published', true),
    supabase.from('products_owned').select('slug, created_at').eq('published', true),
    supabase.from('products_affiliate').select('slug, created_at').eq('published', true)
  ])

  return [
    { url: `${site}/`, lastModified: new Date() },
    { url: `${site}/about`, lastModified: new Date() },
    { url: `${site}/lien-he`, lastModified: new Date() },
    { url: `${site}/chia-se`, lastModified: new Date() },
    { url: `${site}/san-pham-cua-toi`, lastModified: new Date() },
    { url: `${site}/goc-review`, lastModified: new Date() },
    ...(posts || []).map(p => ({
      url: `${site}/chia-se/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    })),
    ...(owned || []).map(p => ({
      url: `${site}/san-pham-cua-toi/${p.slug}`,
      lastModified: new Date(p.created_at),
    })),
    ...(affiliate || []).map(p => ({
      url: `${site}/goc-review/${p.slug}`,
      lastModified: new Date(p.created_at),
    })),
  ]
}
