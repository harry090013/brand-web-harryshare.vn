import ResourceCard from '@/components/ResourceCard'
import { buildMetadata } from '@/lib/seo'
import { getPublishedResources } from '@/lib/resources'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'Dự án & Tài nguyên | HarryShare',
  description:
    'Sản phẩm Harry tự tạo, công cụ đang dùng, tài nguyên miễn phí và các case study nhỏ trong quá trình làm content, AI và sản phẩm.',
  path: '/du-an-tai-nguyen',
})

export default async function ProjectsResourcesPage() {
  const resources = await getPublishedResources()

  const featured = resources.filter((item) => item.is_featured)
  const tools = resources.filter((item) => item.resource_type === 'tool')
  const products = resources.filter((item) => item.resource_type === 'product')
  const freebies = resources.filter((item) => item.resource_type === 'freebie')
  const caseStudies = resources.filter((item) => item.resource_type === 'case_study')

  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sage">
          Projects & Resources
        </p>

        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-olive md:text-7xl">
          Dự án & Tài nguyên
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
          Những sản phẩm mình đang xây, công cụ mình thật sự sử dụng và tài nguyên mình tạo ra trong quá trình học, làm content, xây thương hiệu và thử nghiệm sản phẩm.
        </p>

        <div className="mt-10 rounded-3xl border border-black/10 bg-white/70 p-6 text-sm leading-7 text-zinc-500">
          <strong className="text-zinc-800">Minh bạch affiliate:</strong>{' '}
          Một số liên kết trong trang này có thể là affiliate link. Nếu bạn đăng ký qua link đó, mình có thể nhận một khoản hoa hồng nhỏ. Mình chỉ giới thiệu những công cụ mình đã dùng hoặc thật sự thấy phù hợp.
        </div>
      </section>

      {featured.length > 0 && (
        <ResourceSection title="Nổi bật" resources={featured} />
      )}

      <ResourceSection title="Công cụ mình dùng" resources={tools} />
      <ResourceSection title="Sản phẩm của mình" resources={products} />
      <ResourceSection title="Tài nguyên miễn phí" resources={freebies} />
      <ResourceSection title="Case study / Thử nghiệm" resources={caseStudies} />

      {resources.length === 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="rounded-3xl border border-dashed border-black/15 bg-white/70 p-10 text-center text-zinc-400">
            Chưa có tài nguyên nào. Bạn có thể thêm trong /admin/products.
          </div>
        </section>
      )}
    </main>
  )
}

function ResourceSection({
  title,
  resources,
}: {
  title: string
  resources: Awaited<ReturnType<typeof getPublishedResources>>
}) {
  if (resources.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <h2 className="font-[family-name:var(--font-serif)] text-4xl font-bold tracking-[-0.035em] text-olive">
        {title}
      </h2>

      <div className="mt-7 grid gap-5 md:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </section>
  )
}
