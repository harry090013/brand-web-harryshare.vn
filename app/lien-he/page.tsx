import ContactForm from '@/components/ContactForm'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Liên hệ | HarryShare',
  description:
    'Liên hệ với HarryShare để trao đổi về content, sản phẩm, AI, thương hiệu cá nhân, hợp tác hoặc các dự án liên quan.',
  path: '/lien-he',
})

export default function ContactPage() {
  return (
    <main className="bg-cream">
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">
            Contact
          </p>

          <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-olive md:text-7xl">
            Liên hệ với Harry
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Bạn có thể nhắn cho mình nếu muốn trao đổi về content, sản phẩm,
            AI, thương hiệu cá nhân, hợp tác hoặc chỉ đơn giản là muốn nói
            một câu chuyện thật.
          </p>

          <div className="mt-8 rounded-[2rem] border border-black/10 bg-white/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">
              HarryShare
            </p>
            <p className="mt-3 leading-7 text-zinc-600">
              Mình sẽ đọc tin nhắn trong admin dashboard. Nếu phù hợp, mình sẽ phản hồi lại qua email hoặc số điện thoại bạn để lại.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-sm md:p-8">
          <ContactForm />
        </div>
      </section>
    </main>
  )
}
