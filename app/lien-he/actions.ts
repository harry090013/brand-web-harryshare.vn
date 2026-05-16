'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

type ContactState = {
  ok: boolean
  message: string
}

export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const phone = String(formData.get('phone') || '').trim()
  const subject = String(formData.get('subject') || '').trim()
  const message = String(formData.get('message') || '').trim()

  if (!name) {
    return {
      ok: false,
      message: 'Bạn vui lòng nhập tên.',
    }
  }

  if (!message) {
    return {
      ok: false,
      message: 'Bạn vui lòng nhập nội dung cần nhắn.',
    }
  }

  const { error } = await supabase.from('contacts').insert({
    name,
    email: email || null,
    phone: phone || null,
    subject: subject || null,
    message,
    source: 'website',
    status: 'new',
  })

  if (error) {
    console.error('submitContact error:', error)

    return {
      ok: false,
      message: 'Có lỗi khi gửi liên hệ. Bạn thử lại giúp mình nhé.',
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/contacts')

  return {
    ok: true,
    message: 'Mình đã nhận được tin nhắn của bạn. Cảm ơn bạn đã liên hệ HarryShare.',
  }
}
