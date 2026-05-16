'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { estimateReadingTime, getCurrentISODate, slugify } from '@/lib/content-utils'

type CreatePostInput = {
  category_id: string
  title: string
  slug?: string
  excerpt?: string
  content: string
  published: boolean
  seo_title?: string
  seo_description?: string
  focus_keyword?: string
  is_featured: boolean
  is_start_here: boolean
}

export async function createPost(input: CreatePostInput) {
  const title = input.title.trim()
  const content = input.content.trim()
  const slug = input.slug?.trim() || slugify(title)

  if (!title) {
    return { ok: false, message: 'Thiếu tiêu đề bài viết.' }
  }

  if (!slug) {
    return { ok: false, message: 'Thiếu slug bài viết.' }
  }

  if (!content) {
    return { ok: false, message: 'Thiếu nội dung bài viết.' }
  }

  if (!input.category_id) {
    return { ok: false, message: 'Bạn cần chọn category.' }
  }

  const now = getCurrentISODate()

  const { error } = await supabase.from('posts').insert({
    category_id: input.category_id,
    title,
    slug,
    excerpt: input.excerpt?.trim() || null,
    content,
    image: null,
    cover_image: null,
    og_image: null,
    published: input.published,
    published_at: input.published ? now : null,
    seo_title: input.seo_title?.trim() || `${title} | HarryShare`,
    seo_description: input.seo_description?.trim() || input.excerpt?.trim() || title,
    focus_keyword: input.focus_keyword?.trim() || null,
    canonical_url: null,
    reading_time: estimateReadingTime(content),
    is_featured: input.is_featured,
    is_start_here: input.is_start_here,
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

  return {
    ok: true,
    message: 'Đã tạo bài viết thành công.',
    slug,
  }
}
