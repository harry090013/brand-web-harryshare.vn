export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  seo_title: string | null
  seo_description: string | null
  pillar_intro: string | null
  sort_order: number | null
  cover_image: string | null
  og_image: string | null
  created_at: string
  updated_at: string | null
}

export type Post = {
  id: string
  category_id: string | null
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  image: string | null
  cover_image: string | null
  og_image: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string | null
  seo_title: string | null
  seo_description: string | null
  focus_keyword: string | null
  canonical_url: string | null
  reading_time: number | null
  is_featured: boolean
  is_start_here: boolean
  categories?: Category | null
}

export type ResourceType = 'tool' | 'product' | 'freebie' | 'case_study'

export type Resource = {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  resource_type: ResourceType
  url: string | null
  affiliate_url: string | null
  image: string | null
  is_featured: boolean
  published: boolean
  published_at: string | null
  seo_title: string | null
  seo_description: string | null
  focus_keyword: string | null
  created_at: string
  updated_at: string | null
}
