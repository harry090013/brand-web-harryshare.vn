'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin-auth'
import { estimateReadingTime, getCurrentISODate, slugify } from '@/lib/content-utils'

type CreatePostInput = {
  category_id: string
  title: string
  slug?: string
  excerpt?: string
  content: string
  image?: string
  cover_image?: string
  og_image?: string
  published: boolean
  seo_title?: string
  seo_description?: string
  focus_keyword?: string
  is_featured: boolean
  is_start_here: boolean
  tags?: string[]
  visibility?: 'public' | 'private' | 'unlisted'
  scheduled_at?: string | null
}

export async function createPost(input: CreatePostInput) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const title = input.title.trim()
  const content = input.content?.trim() || ''
  const slug = input.slug?.trim() || slugify(title)

  const isPublishing = input.published

  if (!title) {
    return { ok: false, message: 'Thiếu tiêu đề bài viết.' }
  }

  if (!input.category_id) {
    return { ok: false, message: 'Bạn cần chọn category.' }
  }

  if (isPublishing && !content) {
    return {
      ok: false,
      message: 'Bài viết đang xuất bản nên cần có nội dung.',
    }
  }

  if (isPublishing && !input.excerpt?.trim()) {
    return {
      ok: false,
      message: 'Bài viết đang xuất bản nên cần có tóm tắt.',
    }
  }

  const now = getCurrentISODate()

  const { error } = await supabase.from('posts').insert({
    category_id: input.category_id,
    title,
    slug,
    excerpt: input.excerpt?.trim() || null,
    content: content || '',
    image: input.image?.trim() || input.cover_image?.trim() || null,
    cover_image: input.cover_image?.trim() || input.image?.trim() || null,
    og_image:
      input.og_image?.trim() ||
      input.cover_image?.trim() ||
      input.image?.trim() ||
      null,
    published: input.published,
    published_at: input.published
      ? input.scheduled_at || now
      : null,
    seo_title: input.seo_title?.trim() || `${title} | HarryShare`,
    seo_description: input.seo_description?.trim() || input.excerpt?.trim() || title,
    focus_keyword: input.focus_keyword?.trim() || null,
    canonical_url: null,
    reading_time: estimateReadingTime(content),
    is_featured: input.is_featured,
    is_start_here: input.is_start_here,
    tags: input.tags || [],
    visibility: input.visibility || 'public',
    scheduled_at: input.scheduled_at || null,
  })

  if (error) {
    console.error('createPost error:', error)

    if (error.code === '23505') {
      return {
        ok: false,
        message: 'Slug này đã tồn tại. Hãy đổi slug khác.',
      }
    }

    return {
      ok: false,
      message: error.message,
    }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/posts')
  revalidatePath('/ghi-chep')
  revalidatePath('/chu-de')
  revalidatePath('/tu-duy-san-pham')
  revalidatePath('/thuong-hieu-ca-nhan')
  revalidatePath('/ai-vibe-coding')
  revalidatePath('/hanh-trinh-lam-nghe')
  revalidatePath('/chia-se') // For the listing redirect

  return {
    ok: true,
    message: 'Đã tạo bài viết thành công.',
    slug,
  }
}

type UpdatePostInput = {
  id: string
  category_id: string
  title: string
  slug?: string
  excerpt?: string
  content: string
  image?: string
  cover_image?: string
  og_image?: string
  published: boolean
  seo_title?: string
  seo_description?: string
  focus_keyword?: string
  is_featured: boolean
  is_start_here: boolean
  tags?: string[]
  visibility?: 'public' | 'private' | 'unlisted'
  scheduled_at?: string | null
}

export async function updatePost(input: UpdatePostInput) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const title = input.title.trim()
  const content = input.content?.trim() || ''
  const slug = input.slug?.trim() || slugify(title)

  const isPublishing = input.published

  if (!input.id) {
    return { ok: false, message: 'Thiếu ID bài viết.' }
  }

  if (!title) {
    return { ok: false, message: 'Thiếu tiêu đề bài viết.' }
  }

  if (!input.category_id) {
    return { ok: false, message: 'Bạn cần chọn category.' }
  }

  if (isPublishing && !content) {
    return {
      ok: false,
      message: 'Bài viết đang xuất bản nên cần có nội dung.',
    }
  }

  if (isPublishing && !input.excerpt?.trim()) {
    return {
      ok: false,
      message: 'Bài viết đang xuất bản nên cần có tóm tắt.',
    }
  }

  const now = getCurrentISODate()

  const { data: currentPost } = await supabase
    .from('posts')
    .select('published,published_at')
    .eq('id', input.id)
    .maybeSingle()

  const { error } = await supabase
    .from('posts')
    .update({
      category_id: input.category_id,
      title,
      slug,
      excerpt: input.excerpt?.trim() || null,
      content: content || '',

      image: input.image?.trim() || input.cover_image?.trim() || null,
      cover_image: input.cover_image?.trim() || input.image?.trim() || null,
      og_image:
        input.og_image?.trim() ||
        input.cover_image?.trim() ||
        input.image?.trim() ||
        null,

      published: input.published,
      published_at: input.published
        ? input.scheduled_at || currentPost?.published_at || now
        : null,

      seo_title: input.seo_title?.trim() || `${title} | HarryShare`,
      seo_description:
        input.seo_description?.trim() || input.excerpt?.trim() || title,
      focus_keyword: input.focus_keyword?.trim() || null,
      reading_time: estimateReadingTime(content),

      is_featured: input.is_featured,
      is_start_here: input.is_start_here,
      tags: input.tags || [],
      visibility: input.visibility || 'public',
      scheduled_at: input.scheduled_at || null,
    })
    .eq('id', input.id)

  if (error) {
    console.error('updatePost error:', error)

    if (error.code === '23505') {
      return {
        ok: false,
        message: 'Slug này đã tồn tại. Hãy đổi slug khác.',
      }
    }

    return {
      ok: false,
      message: error.message,
    }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/posts')
  revalidatePath(`/admin/posts/${input.id}/edit`)
  revalidatePath('/ghi-chep')
  revalidatePath('/tu-duy-san-pham')
  revalidatePath('/thuong-hieu-ca-nhan')
  revalidatePath('/ai-vibe-coding')
  revalidatePath('/hanh-trinh-lam-nghe')
  revalidatePath('/chia-se')

  return {
    ok: true,
    message: 'Đã cập nhật bài viết thành công.',
    slug,
  }
}
