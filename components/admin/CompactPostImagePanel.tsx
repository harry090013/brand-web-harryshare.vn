'use client'

import Image from 'next/image'
import { Eye, X } from 'lucide-react'
import { useState } from 'react'
import ImageUploader from '@/components/admin/ImageUploader'

type CompactPostImagePanelProps = {
  image: string
  coverImage: string
  ogImage: string
  onImageChange: (value: string) => void
  onCoverImageChange: (value: string) => void
  onOgImageChange: (value: string) => void
}

export default function CompactPostImagePanel({
  image,
  coverImage,
  ogImage,
  onImageChange,
  onCoverImageChange,
  onOgImageChange,
}: CompactPostImagePanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const mainImage = coverImage || image || ogImage

  function useForAll() {
    if (!mainImage) return
    onImageChange(mainImage)
    onCoverImageChange(mainImage)
    onOgImageChange(mainImage)
  }

  return (
    <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-700">Ảnh bài viết</p>
          <p className="mt-1 text-sm leading-6 text-zinc-400">
            Ảnh tối đa 250KB. Khuyên dùng WebP hoặc ảnh đã nén.
          </p>
        </div>

        <div className="flex gap-2">
          {mainImage && (
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-bold text-zinc-600"
            >
              <Eye size={14} className="mr-1" />
              Preview
            </button>
          )}

          {mainImage && (
            <button
              type="button"
              onClick={() => {
                onImageChange('')
                onCoverImageChange('')
                onOgImageChange('')
              }}
              className="inline-flex items-center rounded-full border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
            >
              <X size={14} className="mr-1" />
              Xóa
            </button>
          )}
        </div>
      </div>

      <div className="mt-5">
        <ImageUploader
          label="Cover image"
          description="Dùng cho card bài viết và đầu bài."
          value={coverImage}
          folder="posts"
          recommendedSize="1600 x 900px"
          onChange={onCoverImageChange}
        />
      </div>

      {showPreview && mainImage && (
        <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-2xl border border-black/10 bg-zinc-100">
          <Image
            src={mainImage}
            alt="Preview ảnh bài viết"
            fill
            className="object-cover"
            unoptimized={mainImage.startsWith('http')}
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={useForAll}
          className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"
        >
          Dùng cover cho image + OG
        </button>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-bold text-zinc-600"
        >
          {showAdvanced ? 'Ẩn nâng cao' : 'Ảnh nâng cao'}
        </button>
      </div>

      {showAdvanced && (
        <div className="mt-5 space-y-4">
          <ImageUploader
            label="OG image"
            description="Ảnh khi share social. Khuyên dùng 1200 x 630px."
            value={ogImage}
            folder="posts"
            recommendedSize="1200 x 630px"
            onChange={onOgImageChange}
          />

          <ImageUploader
            label="Image fallback"
            description="Ảnh fallback cũ. Thường có thể dùng chung với cover."
            value={image}
            folder="posts"
            recommendedSize="1600 x 900px"
            onChange={onImageChange}
          />
        </div>
      )}
    </div>
  )
}
