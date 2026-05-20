'use client'
import { useEffect, useState } from 'react'

interface HeadingItem {
  text: string
  id: string
  level: number
}

// Helper to sanitize heading strings for IDs, preserving Vietnamese characters nicely
function sanitizeId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/g, '')
    .replace(/\s+/g, '-')
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<HeadingItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (!content) return

    // Extract headings from markdown content (only H2 and H3 for cleaner TOC)
    const lines = content.split('\n')
    const items: HeadingItem[] = []

    lines.forEach(line => {
      const trimmed = line.trim()
      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace('## ', '').trim()
        items.push({ text, id: sanitizeId(text), level: 2 })
      } else if (trimmed.startsWith('### ')) {
        const text = trimmed.replace('### ', '').trim()
        items.push({ text, id: sanitizeId(text), level: 3 })
      }
    })

    setHeadings(items)
  }, [content])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    )

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    })

    return () => {
      headings.forEach((heading) => {
        const el = document.getElementById(heading.id)
        if (el) observer.unobserve(el)
      })
    }
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="hidden lg:block sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto w-64 shrink-0 p-6 rounded-2xl bg-white/40 border border-black/5 backdrop-blur-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-sage mb-4">Mục lục bài viết</p>
      <ul className="space-y-3 text-sm">
        {headings.map((heading, index) => (
          <li 
            key={`${heading.id}-${index}`}
            style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-0.5 leading-snug transition-colors duration-300 ${
                activeId === heading.id
                  ? 'text-sage font-semibold border-l-2 border-sage pl-2 -ml-[2px]'
                  : 'text-zinc-500 hover:text-olive hover:pl-1'
              }`}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById(heading.id)
                if (el) {
                  const offset = 80 // Offset for sticky navbar
                  const bodyRect = document.body.getBoundingClientRect().top
                  const elementRect = el.getBoundingClientRect().top
                  const elementPosition = elementRect - bodyRect
                  const offsetPosition = elementPosition - offset

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  })
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
