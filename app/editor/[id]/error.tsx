'use client'

export default function EditorError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="fixed inset-0 z-[200] bg-white flex items-center justify-center">
      <div className="text-center max-w-md p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi Editor</h2>
        <p className="text-gray-600 mb-2">Đã xảy ra lỗi khi tải editor:</p>
        <pre className="bg-gray-100 p-4 rounded text-sm text-left overflow-auto mb-6 max-h-40">{error.message}</pre>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Thử lại
          </button>
          <a href="/admin" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Về Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
