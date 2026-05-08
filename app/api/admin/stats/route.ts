import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function GET() {
  // Verify user is authenticated via cookies (server-side)
  const cookieStore = await cookies()
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { session } } = await supabaseAuth.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Dùng service role key để bypass RLS — an toàn vì đã verify auth ở trên
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const [
    { data: posts, error: e1 },
    { count: catCount },
    { count: productCount },
    { count: commentCount },
    { count: orderCount },
  ] = await Promise.all([
    admin.from('posts').select('id, title, slug, category, published, published_at').order('created_at', { ascending: false }),
    admin.from('categories').select('*', { count: 'exact', head: true }),
    admin.from('products_owned').select('*', { count: 'exact', head: true }),
    admin.from('comments').select('*', { count: 'exact', head: true }).eq('approved', false),
    admin.from('orders').select('*', { count: 'exact', head: true }),
  ])

  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 })

  return NextResponse.json({
    posts: posts || [],
    stats: {
      totalCategories: catCount || 0,
      totalProducts: productCount || 0,
      pendingComments: commentCount || 0,
      totalOrders: orderCount || 0,
    }
  })
}
