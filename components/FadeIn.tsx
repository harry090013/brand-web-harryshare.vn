'use client'
import { useEffect, useRef, useState, ReactNode } from 'react'

export default function FadeIn({ children, delay = 0, direction = 'up' }: { children: ReactNode, delay?: number, direction?: 'up' | 'down' | 'left' | 'right' | 'none' }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  let transformClass = ''
  if (!isVisible) {
    if (direction === 'up') transformClass = 'translate-y-12'
    if (direction === 'down') transformClass = '-translate-y-12'
    if (direction === 'left') transformClass = 'translate-x-12'
    if (direction === 'right') transformClass = '-translate-x-12'
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${transformClass}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
