import { supabase } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Category, Post } from '@/lib/types'

type RawPost = Omit<Post, 'categories'> & {
  categories?: Category | Category[] | null
}

function normalizePost(post: RawPost): Post {
  const category = Array.isArray(post.categories)
    ? post.categories[0] || null
    : post.categories || null

  return {
    ...post,
    categories: category,
  }
}

function normalizePosts(posts: RawPost[] | null): Post[] {
  return (posts || []).map(normalizePost)
}

export async function getPublishedPosts(limit?: number) {
  let query = supabase
    .from('posts')
    .select(`
      id,
      category_id,
      title,
      slug,
      excerpt,
      content,
      image,
      cover_image,
      og_image,
      published,
      published_at,
      created_at,
      updated_at,
      seo_title,
      seo_description,
      focus_keyword,
      canonical_url,
      reading_time,
      is_featured,
      is_start_here,
      categories (
        id,
        name,
        slug,
        description,
        seo_title,
        seo_description,
        pillar_intro,
        sort_order,
        created_at,
        updated_at
      )
    `)
    .eq('published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('getPublishedPosts error:', error)
    return []
  }

  return normalizePosts(data as RawPost[])
}

export async function getFeaturedPost() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      category_id,
      title,
      slug,
      excerpt,
      content,
      image,
      cover_image,
      og_image,
      published,
      published_at,
      created_at,
      updated_at,
      seo_title,
      seo_description,
      focus_keyword,
      canonical_url,
      reading_time,
      is_featured,
      is_start_here,
      categories (
        id,
        name,
        slug,
        description,
        seo_title,
        seo_description,
        pillar_intro,
        sort_order,
        created_at,
        updated_at
      )
    `)
    .eq('published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('getFeaturedPost error:', error)
    return null
  }

  return data ? normalizePost(data as RawPost) : null
}

export async function getStartHerePosts(limit = 3) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      category_id,
      title,
      slug,
      excerpt,
      content,
      image,
      cover_image,
      og_image,
      published,
      published_at,
      created_at,
      updated_at,
      seo_title,
      seo_description,
      focus_keyword,
      canonical_url,
      reading_time,
      is_featured,
      is_start_here,
      categories (
        id,
        name,
        slug,
        description,
        seo_title,
        seo_description,
        pillar_intro,
        sort_order,
        created_at,
        updated_at
      )
    `)
    .eq('published', true)
    .eq('is_start_here', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getStartHerePosts error:', error)
    return []
  }

  return normalizePosts(data as RawPost[])
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      category_id,
      title,
      slug,
      excerpt,
      content,
      image,
      cover_image,
      og_image,
      published,
      published_at,
      created_at,
      updated_at,
      seo_title,
      seo_description,
      focus_keyword,
      canonical_url,
      reading_time,
      is_featured,
      is_start_here,
      categories (
        id,
        name,
        slug,
        description,
        seo_title,
        seo_description,
        pillar_intro,
        sort_order,
        created_at,
        updated_at
      )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) {
    console.error('getPostBySlug error:', error)
    return null
  }

  return data ? normalizePost(data as RawPost) : null
}

export async function getPostsByCategorySlug(categorySlug: string, limit?: number) {
  let query = supabase
    .from('posts')
    .select(`
      id,
      category_id,
      title,
      slug,
      excerpt,
      content,
      image,
      cover_image,
      og_image,
      published,
      published_at,
      created_at,
      updated_at,
      seo_title,
      seo_description,
      focus_keyword,
      canonical_url,
      reading_time,
      is_featured,
      is_start_here,
      categories!inner (
        id,
        name,
        slug,
        description,
        seo_title,
        seo_description,
        pillar_intro,
        sort_order,
        created_at,
        updated_at
      )
    `)
    .eq('published', true)
    .eq('categories.slug', categorySlug)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('getPostsByCategorySlug error:', error)
    return []
  }

  return normalizePosts(data as RawPost[])
}

export async function getRelatedPosts(post: Post, limit = 3) {
  if (!post.category_id) {
    const posts = await getPublishedPosts(limit + 1)
    return posts.filter((item) => item.id !== post.id).slice(0, limit)
  }

  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      category_id,
      title,
      slug,
      excerpt,
      content,
      image,
      cover_image,
      og_image,
      published,
      published_at,
      created_at,
      updated_at,
      seo_title,
      seo_description,
      focus_keyword,
      canonical_url,
      reading_time,
      is_featured,
      is_start_here,
      categories (
        id,
        name,
        slug,
        description,
        seo_title,
        seo_description,
        pillar_intro,
        sort_order,
        created_at,
        updated_at
      )
    `)
    .eq('published', true)
    .eq('category_id', post.category_id)
    .neq('id', post.id)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getRelatedPosts error:', error)
    return []
  }

  return normalizePosts(data as RawPost[])
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      description,
      seo_title,
      seo_description,
      pillar_intro,
      sort_order,
      created_at,
      updated_at
    `)
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('getCategoryBySlug error:', error)
    return null
  }

  return data as Category | null
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      description,
      seo_title,
      seo_description,
      pillar_intro,
      sort_order,
      created_at,
      updated_at
    `)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('getCategories error:', error)
    return []
  }

  return data as Category[]
}

export async function getAdminStats() {
  const [
    publishedPosts,
    draftPosts,
    categories,
    pendingComments,
    resources,
    newContacts,
  ] = await Promise.all([
    supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('published', true),

    supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('published', false),

    supabase
      .from('categories')
      .select('id', { count: 'exact', head: true }),

    supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('approved', false),

    supabase
      .from('resources')
      .select('id', { count: 'exact', head: true })
      .eq('published', true),

    supabase
      .from('contacts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new'),
  ])

  return {
    publishedPosts: publishedPosts.count || 0,
    draftPosts: draftPosts.count || 0,
    categories: categories.count || 0,
    pendingComments: pendingComments.count || 0,
    resources: resources.count || 0,
    newContacts: newContacts.count || 0,
  }
}

export async function getRecentPostsForAdmin(limit = 8) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      category_id,
      title,
      slug,
      excerpt,
      content,
      image,
      cover_image,
      og_image,
      published,
      published_at,
      created_at,
      updated_at,
      seo_title,
      seo_description,
      focus_keyword,
      canonical_url,
      reading_time,
      is_featured,
      is_start_here,
      categories (
        id,
        name,
        slug,
        description,
        seo_title,
        seo_description,
        pillar_intro,
        sort_order,
        created_at,
        updated_at
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getRecentPostsForAdmin error:', error)
    return []
  }

  return normalizePosts(data as RawPost[])
}

export async function getPostById(id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      category_id,
      title,
      slug,
      excerpt,
      content,
      image,
      cover_image,
      og_image,
      published,
      published_at,
      created_at,
      updated_at,
      seo_title,
      seo_description,
      focus_keyword,
      canonical_url,
      reading_time,
      is_featured,
      is_start_here,
      categories (
        id,
        name,
        slug,
        description,
        seo_title,
        seo_description,
        pillar_intro,
        sort_order,
        created_at,
        updated_at
      )
    `)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('getPostById error:', error)
    return null
  }

  return data ? normalizePost(data as RawPost) : null
}

export type ContactMessage = {
  id: string
  name: string
  email: string | null
  phone: string | null
  subject: string | null
  message: string
  source: string | null
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
  updated_at: string | null
}

export async function getContactsForAdmin() {
  const serverSupabase = await createSupabaseServerClient()

  const { data, error } = await serverSupabase
    .from('contacts')
    .select('id,name,email,phone,subject,message,source,status,created_at,updated_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getContactsForAdmin error:', error)
    return []
  }

  return (data || []) as ContactMessage[]
}

export type CommentItem = {
  id: string
  post_id: string
  name: string
  email: string | null
  content: string
  approved: boolean
  created_at: string
  reply_content: string | null
  replied_at: string | null
  replied_by: string | null
  posts?: {
    id: string
    title: string
    slug: string
  } | null
}

export async function getCommentsForAdmin() {
  const serverSupabase = await createSupabaseServerClient()

  const { data: comments, error } = await serverSupabase
    .from('comments')
    .select('id,post_id,name,email,content,approved,created_at,reply_content,replied_at,replied_by')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getCommentsForAdmin comments error:', error)
    return []
  }

  console.log('ADMIN COMMENTS:', comments)

  if (!comments || comments.length === 0) {
    return []
  }

  const postIds = Array.from(
    new Set(comments.map((comment) => comment.post_id).filter(Boolean))
  )

  const { data: posts, error: postsError } = await serverSupabase
    .from('posts')
    .select('id,title,slug')
    .in('id', postIds)

  if (postsError) {
    console.error('getCommentsForAdmin posts error:', postsError)
  }

  const postsMap = new Map(
    (posts || []).map((post) => [
      post.id,
      {
        id: post.id,
        title: post.title,
        slug: post.slug,
      },
    ])
  )

  return comments.map((comment) => ({
    ...comment,
    posts: postsMap.get(comment.post_id) || null,
  })) as CommentItem[]
}
