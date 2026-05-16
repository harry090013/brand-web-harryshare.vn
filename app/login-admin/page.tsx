import AdminLoginForm from '@/components/admin/AdminLoginForm'

export const metadata = {
  title: 'Admin Login | HarryShare',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#F0FFF5] px-4 py-16 text-[#064E3B]">
      <section className="mx-auto max-w-md rounded-[2rem] border border-black/10 bg-white p-8 shadow-xl shadow-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-500">
          HarryShare Admin
        </p>

        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-emerald-900">
          Đăng nhập
        </h1>

        <p className="mt-4 leading-7 text-zinc-500">
          Khu vực này chỉ dành cho admin/editor của HarryShare.
        </p>

        <AdminLoginForm />
      </section>
    </main>
  )
}
