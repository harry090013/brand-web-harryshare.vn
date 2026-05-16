'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin-auth'

export async function updateCommentApproval(id: string, approved: boolean) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('comments')
    .update({ approved })
    .eq('id', id)

  if (error) {
    console.error('updateCommentApproval error:', error)

    return {
      ok: false,
      message: error.message,
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/comments')
  revalidatePath('/ghi-chep')

  return {
    ok: true,
    message: 'Đã cập nhật bình luận.',
  }
}

export async function deleteComment(id: string) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('deleteComment error:', error)

    return {
      ok: false,
      message: error.message,
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/comments')

  return {
    ok: true,
    message: 'Đã xóa bình luận.',
  }
}

export async function replyToComment(id: string, replyContent: string) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const cleanReply = replyContent.trim()

  if (!cleanReply) {
    return {
      ok: false,
      message: 'Nội dung trả lời không được để trống.',
    }
  }

  const { error } = await supabase
    .from('comments')
    .update({
      reply_content: cleanReply,
      replied_at: new Date().toISOString(),
      replied_by: 'Harry',
      approved: true,
    })
    .eq('id', id)

  if (error) {
    console.error('replyToComment error:', error)

    return {
      ok: false,
      message: error.message,
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/comments')
  revalidatePath('/ghi-chep')

  return {
    ok: true,
    message: 'Đã trả lời bình luận.',
  }
}
