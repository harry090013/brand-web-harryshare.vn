import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function getCurrentAdmin() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id,email,full_name,role')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError || !profile) {
    return null
  }

  if (profile.role !== 'admin' && profile.role !== 'editor') {
    return null
  }

  return {
    user,
    profile,
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/login-admin')
  }

  return admin
}
