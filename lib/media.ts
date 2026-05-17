export const MEDIA_BUCKET = 'harryshare-media'

export type MediaFolder = 'posts' | 'pillars' | 'resources' | 'system' | 'author'

export function sanitizeFileName(fileName: string) {
  const parts = fileName.split('.')
  const extension = parts.length > 1 ? parts.pop()?.toLowerCase() : 'png'
  const baseName = parts.join('.')

  const cleanBaseName = baseName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

  return `${cleanBaseName || 'image'}.${extension || 'png'}`
}

export function createMediaPath({
  folder,
  fileName,
}: {
  folder: MediaFolder
  fileName: string
}) {
  const cleanFileName = sanitizeFileName(fileName)
  const timestamp = Date.now()

  return `${folder}/${timestamp}-${cleanFileName}`
}
