import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://harryshare.vn'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/login',
          '/login/',
          '/login-admin',
          '/login-admin/',
          '/editor',
          '/editor/',
          '/api',
          '/api/',
        ]
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
