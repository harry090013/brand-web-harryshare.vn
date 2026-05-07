'use client'
import { useState, useEffect } from 'react'

export default function ShareBar({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(`${window.location.origin}/chia-se/${slug}`)
  }, [slug])

  const copy = async () => {
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-600 mr-1">Chia sẻ:</span>
      {url && (
        <>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50"
          >
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50"
          >
            X
          </a>
        </>
      )}
      <button
        onClick={copy}
        disabled={!url}
        className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        {copied? 'Đã copy!' : 'Copy link'}
      </button>
    </div>
  )
}