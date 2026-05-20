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

const MAX_FILE_SIZE = 250 * 1024

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

function getExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

export async function uploadMedia(
  formData: FormData
): Promise<UploadMediaResult> {
  try {
    await requireAdmin()

    const supabase = await createSupabaseServerClient()

    const file = formData.get('file')
    const folder = String(formData.get('folder') || 'posts') as MediaFolder

    if (!(file instanceof File)) {
      return {
        ok: false,
        message: 'Không tìm thấy file ảnh. Vui lòng chọn lại ảnh.',
      }
    }

    const extension = getExtension(file.name)

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        ok: false,
        message: 'Định dạng file không hợp lệ. Chỉ hỗ trợ JPG, PNG hoặc WebP.',
      }
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        ok: false,
        message: 'File bạn chọn không phải định dạng ảnh hợp lệ.',
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeKb = Math.round(file.size / 1024)

      return {
        ok: false,
        message: `Ảnh đang nặng ${sizeKb}KB, vượt giới hạn 250KB. Vui lòng nén ảnh trước khi tải lên.`,
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

      if (error.message.toLowerCase().includes('row-level security')) {
        return {
          ok: false,
          message:
            'Upload bị chặn bởi quyền Storage. Kiểm tra lại policy Supabase Storage.',
        }
      }

      if (error.message.toLowerCase().includes('bucket')) {
        return {
          ok: false,
          message:
            'Không tìm thấy bucket upload. Kiểm tra bucket harryshare-media trong Supabase.',
        }
      }

      return {
        ok: false,
        message: `Upload thất bại: ${error.message}`,
      }
    }

    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(filePath)

    return {
      ok: true,
      message: 'Upload ảnh thành công.',
      url: data.publicUrl,
      path: filePath,
    }
  } catch (error) {
    console.error('uploadMedia fatal error:', error)

    return {
      ok: false,
      message:
        'Có lỗi không xác định khi upload ảnh. Vui lòng đăng nhập lại admin và thử lại.',
    }
  }
}
