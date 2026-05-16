'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

type LoginState = {
  ok: boolean
  message: string
}

export async function loginAdmin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')

  if (!email || !password) {
    return {
      ok: false,
      message: 'Vui lòng nhập email và mật khẩu.',
    }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      ok: false,
      message: 'Email hoặc mật khẩu không đúng.',
    }
  }

  redirect('/admin')
}
