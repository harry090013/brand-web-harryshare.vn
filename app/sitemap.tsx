import { supabase } from '@/lib/supabase'

export default async function sitemap() {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, published_at, updated_at')
    .eq('published', true)

  const base = 'https://harryshare.vn'

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/chia-se`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    ...(posts || []).map(p => ({
      url: `${base}/chia-se/${p.slug}`,
      lastModified: new Date(p.updated_at || p.published_at),
    }))
  ]
}