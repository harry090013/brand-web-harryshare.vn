'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin-auth'
import { slugify, getCurrentISODate } from '@/lib/content-utils'
import type { ResourceType } from '@/lib/types'

type ResourceInput = {
  id?: string
  title: string
  slug?: string
  description?: string
  content?: string
  resource_type: ResourceType
  url?: string
  affiliate_url?: string
  published: boolean
  is_featured: boolean
  seo_title?: string
  seo_description?: string
  focus_keyword?: string
}

function revalidateResourcePaths(slug?: string) {
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/products')
  revalidatePath('/du-an-tai-nguyen')
  revalidatePath('/du-an-tai-nguyen/san-pham')
  revalidatePath('/du-an-tai-nguyen/cong-cu-minh-dung')
  revalidatePath('/du-an-tai-nguyen/tai-nguyen-mien-phi')
  revalidatePath('/du-an-tai-nguyen/case-study')

  if (slug) {
    revalidatePath(`/du-an-tai-nguyen/${slug}`)
  }
}

export async function createResource(input: ResourceInput) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const title = input.title.trim()
  const slug = input.slug?.trim() || slugify(title)

  if (!title) {
    return { ok: false, message: 'Thiếu tiêu đề tài nguyên.' }
  }

  if (!slug) {
    return { ok: false, message: 'Thiếu slug tài nguyên.' }
  }

  const now = getCurrentISODate()

  const { error } = await supabase.from('resources').insert({
    title,
    slug,
    description: input.description?.trim() || null,
    content: input.content?.trim() || null,
    resource_type: input.resource_type,
    url: input.url?.trim() || null,
    affiliate_url: input.affiliate_url?.trim() || null,

    // ảnh xử lý phase sau
    image: null,

    published: input.published,
    published_at: input.published ? now : null,
    is_featured: input.is_featured,

    seo_title: input.seo_title?.trim() || `${title} | HarryShare`,
    seo_description:
      input.seo_description?.trim() || input.description?.trim() || title,
    focus_keyword: input.focus_keyword?.trim() || null,
  })

  if (error) {
    console.error('createResource error:', error)

    if (error.code === '23505') {
      return {
        ok: false,
        message: 'Slug này đã tồn tại. Hãy đổi slug khác.',
      }
    }

    return { ok: false, message: error.message }
  }

  revalidateResourcePaths(slug)

  return {
    ok: true,
    message: 'Đã tạo tài nguyên thành công.',
    slug,
  }
}

export async function updateResource(input: ResourceInput & { id: string }) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const title = input.title.trim()
  const slug = input.slug?.trim() || slugify(title)

  if (!input.id) {
    return { ok: false, message: 'Thiếu ID tài nguyên.' }
  }

  if (!title) {
    return { ok: false, message: 'Thiếu tiêu đề tài nguyên.' }
  }

  if (!slug) {
    return { ok: false, message: 'Thiếu slug tài nguyên.' }
  }

  const { data: currentResource } = await supabase
    .from('resources')
    .select('published_at')
    .eq('id', input.id)
    .maybeSingle()

  const now = getCurrentISODate()

  const { error } = await supabase
    .from('resources')
    .update({
      title,
      slug,
      description: input.description?.trim() || null,
      content: input.content?.trim() || null,
      resource_type: input.resource_type,
      url: input.url?.trim() || null,
      affiliate_url: input.affiliate_url?.trim() || null,

      published: input.published,
      published_at: input.published
        ? currentResource?.published_at || now
        : null,
      is_featured: input.is_featured,

      seo_title: input.seo_title?.trim() || `${title} | HarryShare`,
      seo_description:
        input.seo_description?.trim() || input.description?.trim() || title,
      focus_keyword: input.focus_keyword?.trim() || null,
    })
    .eq('id', input.id)

  if (error) {
    console.error('updateResource error:', error)

    if (error.code === '23505') {
      return {
        ok: false,
        message: 'Slug này đã tồn tại. Hãy đổi slug khác.',
      }
    }

    return { ok: false, message: error.message }
  }

  revalidateResourcePaths(slug)

  return {
    ok: true,
    message: 'Đã cập nhật tài nguyên thành công.',
    slug,
  }
}

export async function deleteResource(id: string) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('deleteResource error:', error)
    return { ok: false, message: error.message }
  }

  revalidateResourcePaths()

  return {
    ok: true,
    message: 'Đã xóa tài nguyên.',
  }
}
