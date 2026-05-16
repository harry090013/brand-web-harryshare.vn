import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site'

const siteUrl = siteConfig.url
const siteName = siteConfig.name
const defaultImage = '/og-default.jpg'

type BuildMetadataProps = {
  title: string
  description: string
  path?: string
  image?: string | null
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
}

export function buildMetadata({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
}: BuildMetadataProps): Metadata {
  const url = `${siteUrl}${path}`
  const ogImage = image || defaultImage

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article'
        ? {
            publishedTime: publishedTime || undefined,
            modifiedTime: modifiedTime || undefined,
            authors: ['Harry'],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}