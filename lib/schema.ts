import { siteConfig } from '@/lib/site'

const siteUrl = siteConfig.url

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.description,
    inLanguage: 'vi-VN',
    publisher: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: `${siteUrl}${siteConfig.author.url}`,
    },
  }
}

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Harry',
    url: siteUrl,
    sameAs: [],
    jobTitle: 'Marketer / Content Creator',
    description:
      'Harry viết về tư duy sản phẩm, thương hiệu cá nhân, AI, vibe coding và hành trình làm nghề thực chiến.',
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function blogPostingSchema(post: {
  title: string
  excerpt?: string | null
  image?: string | null
  cover_image?: string | null
  og_image?: string | null
  slug: string
  published_at?: string | null
  updated_at?: string | null
  created_at?: string | null
  categories?: {
    slug: string
  } | null
}) {
  const path = post.categories?.slug
    ? `/${post.categories.slug}/${post.slug}`
    : `/chia-se/${post.slug}`

  const url = `${siteUrl}${path}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.og_image || post.cover_image || post.image || `${siteUrl}/og-default.jpg`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: {
      '@type': 'Person',
      name: 'Harry',
      url: `${siteUrl}/ve-harry`,
    },
    publisher: {
      '@type': 'Person',
      name: 'Harry',
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    inLanguage: 'vi-VN',
  }
}