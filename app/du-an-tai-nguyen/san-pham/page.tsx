export const metadata = {
  title: 'Sản phẩm của mình | HarryShare',
  description: 'Các sản phẩm số, template, prompt pack, checklist hoặc tài nguyên do Harry tự tạo.',
}

export default function ProductsPage() {
  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">Dự án & Tài nguyên</p>
        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-olive md:text-7xl">
          Sản phẩm của mình
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
          Khu vực này sẽ chứa các sản phẩm số, template, prompt pack, checklist hoặc tài nguyên do Harry tự tạo.
        </p>
      </section>
    </main>
  )
}
