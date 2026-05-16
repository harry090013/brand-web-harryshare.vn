import ResourceEditorForm from '@/components/admin/ResourceEditorForm'

export default function NewResourcePage() {
  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-500">
          Dự án & Tài nguyên
        </p>

        <h1 className="mt-3 font-[family-name:var(--font-serif)] text-5xl font-bold tracking-[-0.045em] text-emerald-900">
          Thêm tài nguyên
        </h1>

        <p className="mt-4 max-w-2xl leading-8 text-zinc-500">
          Tạo sản phẩm số, công cụ affiliate, tài nguyên miễn phí hoặc case study.
        </p>
      </div>

      <div className="mt-10">
        <ResourceEditorForm />
      </div>
    </div>
  )
}
