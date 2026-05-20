'use client'

import Image from 'next/image'
import { useRef, useState, useTransition } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  ImagePlus,
  Loader2,
  Upload,
  X,
} from 'lucide-react'

import { uploadMedia } from '@/app/admin/media/actions'
import type { MediaFolder } from '@/lib/media'

type ImageUploaderProps = {
  label: string
  description?: string
  value: string
  folder?: MediaFolder
  recommendedSize?: string
  onChange: (url: string) => void
}

const MAX_FILE_SIZE = 250 * 1024

function formatKb(size: number) {
  return `${Math.round(size / 1024)}KB`
}

function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      })
      URL.revokeObjectURL(objectUrl)
    }

    img.onerror = () => {
      reject(new Error('Không đọc được kích thước ảnh.'))
      URL.revokeObjectURL(objectUrl)
    }

    img.src = objectUrl
  })
}

export default function ImageUploader({
  label,
  description,
  value,
  folder = 'posts',
  recommendedSize,
  onChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [message, setMessage] = useState('')
  const [warning, setWarning] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleUpload(file: File) {
    setMessage('')
    setWarning('')

    if (!file.type.startsWith('image/')) {
      setMessage('File không hợp lệ. Vui lòng chọn file ảnh.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage(
        `Ảnh đang nặng ${formatKb(file.size)}, vượt giới hạn 250KB. Hãy nén ảnh rồi upload lại.`
      )
      return
    }

    try {
      const dimensions = await getImageDimensions(file)

      if (recommendedSize) {
        setWarning(
          `Ảnh bạn chọn có kích thước ${dimensions.width} x ${dimensions.height}px. Khuyến nghị: ${recommendedSize}.`
        )
      }
    } catch {
      setWarning('Không đọc được kích thước ảnh, nhưng vẫn có thể thử upload.')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    startTransition(async () => {
      const result = await uploadMedia(formData)

      setMessage(result.message)

      if (result.ok && result.url) {
        onChange(result.url)
      }
    })
  }

  const isSuccess = message && message.includes('thành công')

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-bold text-zinc-800">{label}</p>

          {description && (
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              {description}
            </p>
          )}

          <p className="mt-1 text-xs text-zinc-400">
            Tối đa 250KB. Hỗ trợ JPG, PNG, WebP.
            {recommendedSize ? ` Khuyến nghị ${recommendedSize}.` : ''}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          {value && (
            <button
              type="button"
              onClick={() => setPreviewOpen(!previewOpen)}
              className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50"
            >
              <Eye size={14} className="mr-1" />
              Preview
            </button>
          )}

          <button
            type="button"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 size={14} className="mr-1 animate-spin" />
            ) : (
              <Upload size={14} className="mr-1" />
            )}
            Upload
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (!file) return
          handleUpload(file)
          event.target.value = ''
        }}
      />

      <div className="mt-4 flex gap-2">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="/posts/example.png hoặc Supabase Storage URL"
          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-zinc-600 outline-none transition focus:border-emerald-500"
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('')
              setMessage('')
              setWarning('')
              setPreviewOpen(false)
            }}
            className="inline-flex items-center rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {previewOpen && value && (
        <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-xl border border-black/10 bg-zinc-100">
          <Image
            src={value}
            alt={label}
            fill
            className="object-cover"
            unoptimized={value.startsWith('http')}
          />
        </div>
      )}

      {!value && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-black/10 bg-emerald-50 px-4 py-3 text-sm text-zinc-400">
          <ImagePlus size={16} />
          Chưa có ảnh.
        </div>
      )}

      {warning && (
        <div className="mt-3 flex gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{warning}</span>
        </div>
      )}

      {message && (
        <div
          className={`mt-3 flex gap-2 rounded-xl border px-4 py-3 text-sm leading-6 ${
            isSuccess
              ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
              : 'border-red-100 bg-red-50 text-red-600'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  )
}
