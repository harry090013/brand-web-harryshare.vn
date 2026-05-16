import AdminShell from '@/components/admin/AdminShell'
import { requireAdmin } from '@/lib/admin-auth'

export const metadata = {
  title: 'Admin | HarryShare',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return <AdminShell>{children}</AdminShell>
}
