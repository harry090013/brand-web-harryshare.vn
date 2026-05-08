'use client'
import { useState, useRef, useEffect } from 'react'

export default function ZenWidget() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        // Set volume to 40% so it's gentle
        audioRef.current.volume = 0.4
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Lắng nghe sự kiện audio kết thúc để đổi trạng thái nút play
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [])

  return (
    <div className="bg-[#F9FAFB] border-b border-gray-100 text-center py-2 px-4 transition-colors duration-500 hover:bg-[#F0FDF4]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 text-xs md:text-sm text-gray-500 font-medium">
        <p className="tracking-wide">
          <span className="hidden md:inline">🌱 </span>
          Hít một hơi thật sâu. Ở đây chỉ có sự bình yên và những câu chuyện thật...
        </p>
        
        <button 
          onClick={togglePlay}
          className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
            isPlaying 
              ? 'bg-sage border-sage text-white shadow-sm' 
              : 'bg-white border-gray-200 hover:border-sage hover:text-sage text-gray-600'
          }`}
          aria-label={isPlaying ? "Dừng nhạc" : "Phát nhạc thư giãn"}
        >
          {isPlaying ? (
            <>
              {/* Nút Pause và sóng nhạc mini */}
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
              <span className="text-[10px] uppercase tracking-widest font-semibold">Đang phát</span>
            </>
          ) : (
            <>
              {/* Nút Play */}
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span className="text-[10px] uppercase tracking-widest font-semibold">Nghe nhạc</span>
            </>
          )}
        </button>

        {/* Thẻ audio ẩn, preload="none" để bảo vệ tốc độ web và SEO */}
        <audio ref={audioRef} src="/amthanhsaotruc.mp3" preload="none" loop />
      </div>
    </div>
  )
}
