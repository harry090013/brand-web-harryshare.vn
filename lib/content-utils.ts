export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function estimateReadingTime(content: string) {
  const plainText = content
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*_`~\-]/g, ' ')
    .trim()

  const words = plainText.split(/\s+/).filter(Boolean).length

  return Math.max(3, Math.ceil(words / 220))
}

export function getCurrentISODate() {
  return new Date().toISOString()
}
