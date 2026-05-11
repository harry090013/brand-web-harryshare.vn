import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://harryshare.vn'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/editor/', '/login/'],
    },
    sitemap: `${site}/sitemap.xml`,
  }
}
