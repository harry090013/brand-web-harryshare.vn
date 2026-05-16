import ContactAdminCard from '@/components/admin/ContactAdminCard'
import { getContactsForAdmin } from '@/lib/posts'

export default async function AdminContactsPage() {
  const contacts = await getContactsForAdmin()

  const newCount = contacts.filter((item) => item.status === 'new').length

  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-500">
          HarryShare Admin
        </p>

        <h1 className="mt-3 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-emerald-900">
          Liên hệ
        </h1>

        <p className="mt-4 max-w-2xl leading-8 text-zinc-500">
          Tin nhắn người đọc gửi từ form liên hệ trên website. Hiện có{' '}
          <span className="font-bold text-orange-500">{newCount}</span> tin mới.
        </p>
      </div>

      <div className="mt-10 space-y-5">
        {contacts.map((contact) => (
          <ContactAdminCard key={contact.id} contact={contact} />
        ))}

        {contacts.length === 0 && (
          <div className="rounded-3xl border border-dashed border-black/15 bg-white/70 p-10 text-center text-zinc-400">
            Chưa có liên hệ nào.
          </div>
        )}
      </div>
    </div>
  )
}
