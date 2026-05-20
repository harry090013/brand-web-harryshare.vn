'use client'
import { useEffect, useState } from 'react'

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const scrollPosition = window.scrollY
        setProgress((scrollPosition / totalHeight) * 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-16 left-0 right-0 z-30 h-1 w-full bg-transparent">
      <div 
        className="h-full bg-sage transition-all duration-150 ease-out" 
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
