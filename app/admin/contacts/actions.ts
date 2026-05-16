'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin-auth'

type ContactStatus = 'new' | 'read' | 'replied' | 'archived'

export async function updateContactStatus(id: string, status: ContactStatus) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('contacts')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('updateContactStatus error:', error)

    return {
      ok: false,
      message: error.message,
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/contacts')

  return {
    ok: true,
    message: 'Đã cập nhật trạng thái liên hệ.',
  }
}

export async function deleteContact(id: string) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('deleteContact error:', error)

    return {
      ok: false,
      message: error.message,
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/contacts')

  return {
    ok: true,
    message: 'Đã xóa liên hệ.',
  }
}
