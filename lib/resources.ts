import { supabase } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Resource, ResourceType } from '@/lib/types'

const resourceSelect = `
  id,
  title,
  slug,
  description,
  content,
  resource_type,
  url,
  affiliate_url,
  image,
  is_featured,
  published,
  published_at,
  seo_title,
  seo_description,
  focus_keyword,
  created_at,
  updated_at
`

export async function getPublishedResources(type?: ResourceType) {
  let query = supabase
    .from('resources')
    .select(resourceSelect)
    .eq('published', true)
    .order('is_featured', { ascending: false })
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (type) {
    query = query.eq('resource_type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error('getPublishedResources error:', error)
    return []
  }

  return (data || []) as Resource[]
}

export async function getResourceBySlug(slug: string) {
  const { data, error } = await supabase
    .from('resources')
    .select(resourceSelect)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) {
    console.error('getResourceBySlug error:', error)
    return null
  }

  return data as Resource | null
}

export async function getResourcesForAdmin() {
  const serverSupabase = await createSupabaseServerClient()

  const { data, error } = await serverSupabase
    .from('resources')
    .select(resourceSelect)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getResourcesForAdmin error:', error)
    return []
  }

  return (data || []) as Resource[]
}

export async function getResourceByIdForAdmin(id: string) {
  const serverSupabase = await createSupabaseServerClient()

  const { data, error } = await serverSupabase
    .from('resources')
    .select(resourceSelect)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('getResourceByIdForAdmin error:', error)
    return null
  }

  return data as Resource | null
}
