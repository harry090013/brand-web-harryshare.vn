'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin-auth'
import { slugify } from '@/lib/content-utils'

type UpdateCategoryInput = {
  id: string
  name: string
  slug: string
  description?: string
  seo_title?: string
  seo_description?: string
  pillar_intro?: string
  sort_order?: number
}

export async function updateCategory(input: UpdateCategoryInput) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const name = input.name.trim()
  const slug = input.slug.trim() || slugify(name)

  if (!input.id) {
    return {
      ok: false,
      message: 'Thiếu ID danh mục.',
    }
  }

  if (!name) {
    return {
      ok: false,
      message: 'Thiếu tên danh mục.',
    }
  }

  if (!slug) {
    return {
      ok: false,
      message: 'Thiếu slug danh mục.',
    }
  }

  const { error } = await supabase
    .from('categories')
    .update({
      name,
      slug,
      description: input.description?.trim() || null,
      seo_title: input.seo_title?.trim() || `${name} | HarryShare`,
      seo_description: input.seo_description?.trim() || input.description?.trim() || name,
      pillar_intro: input.pillar_intro?.trim() || input.description?.trim() || null,
      sort_order: input.sort_order || 0,
    })
    .eq('id', input.id)

  if (error) {
    console.error('updateCategory error:', error)

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

  revalidatePath('/admin/categories')
  revalidatePath('/chu-de')
  revalidatePath('/tu-duy-san-pham')
  revalidatePath('/thuong-hieu-ca-nhan')
  revalidatePath('/ai-vibe-coding')
  revalidatePath('/hanh-trinh-lam-nghe')
  revalidatePath('/')

  return {
    ok: true,
    message: 'Đã cập nhật danh mục thành công.',
  }
}
