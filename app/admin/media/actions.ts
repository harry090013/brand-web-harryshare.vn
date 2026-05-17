'use server'

import { requireAdmin } from '@/lib/admin-auth'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createMediaPath, MEDIA_BUCKET, type MediaFolder } from '@/lib/media'

type UploadMediaResult = {
  ok: boolean
  message: string
  url?: string
  path?: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

export async function uploadMedia(formData: FormData): Promise<UploadMediaResult> {
  await requireAdmin()

  const supabase = await createSupabaseServerClient()

  const file = formData.get('file')
  const folder = String(formData.get('folder') || 'posts') as MediaFolder

  if (!(file instanceof File)) {
    return {
      ok: false,
      message: 'Không tìm thấy file ảnh.',
    }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      ok: false,
      message: 'File không hợp lệ. Chỉ hỗ trợ JPG, PNG, WEBP hoặc GIF.',
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      ok: false,
      message: 'Ảnh quá lớn. Vui lòng dùng ảnh dưới 5MB.',
    }
  }

  const filePath = createMediaPath({
    folder,
    fileName: file.name,
  })

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(filePath, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type,
    })

  if (error) {
    console.error('uploadMedia error:', error)

    return {
      ok: false,
      message: error.message,
    }
  }

  const { data } = supabase.storage
    .from(MEDIA_BUCKET)
    .getPublicUrl(filePath)

  return {
    ok: true,
    message: 'Upload ảnh thành công.',
    url: data.publicUrl,
    path: filePath,
  }
}
