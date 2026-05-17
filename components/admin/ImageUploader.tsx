'use client'

import Image from 'next/image'
import { useRef, useState, useTransition } from 'react'
import { ImagePlus, Loader2, Upload } from 'lucide-react'

import { uploadMedia } from '@/app/admin/media/actions'
import type { MediaFolder } from '@/lib/media'

type ImageUploaderProps = {
  label: string
  description?: string
  value: string
  folder?: MediaFolder
  onChange: (url: string) => void
}

export default function ImageUploader({
  label,
  description,
  value,
  folder = 'posts',
  onChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleUpload(file: File) {
    setMessage('')

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

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-zinc-800">{label}</p>
          {description && (
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
          className="inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 size={14} className="mr-1 animate-spin" />
          ) : (
            <Upload size={14} className="mr-1" />
          )}
          Upload
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (!file) return
          handleUpload(file)
          event.target.value = ''
        }}
      />

      {value ? (
        <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-xl border border-black/10 bg-zinc-100">
          <Image
            src={value}
            alt={label}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div className="mt-4 flex aspect-[16/9] items-center justify-center rounded-xl border border-dashed border-black/15 bg-emerald-50 text-zinc-400">
          <div className="text-center">
            <ImagePlus className="mx-auto" size={24} />
            <p className="mt-2 text-sm">Chưa có ảnh</p>
          </div>
        </div>
      )}

      {value && (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-3 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-zinc-500 outline-none transition focus:border-emerald-500"
        />
      )}

      {message && (
        <p
          className={`mt-3 text-sm font-semibold ${
            message.includes('thành công')
              ? 'text-emerald-700'
              : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
