'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

const SUGGESTIONS = [
  'Tư duy sản phẩm là gì?',
  'Vibe Coding là gì?',
  'Hành trình làm nghề của Harry'
]

// Simple helper to parse [link text](url) into actual interactive tags
function renderMessageText(text: string) {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g
  const elements = []
  let lastIndex = 0
  let match
  let keyIdx = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(<span key={`text-${keyIdx++}`}>{text.substring(lastIndex, match.index)}</span>)
    }
    elements.push(
      <a
        key={`link-${keyIdx++}`}
        href={match[2]}
        className="font-bold underline text-sage hover:text-olive transition-colors duration-200"
      >
        {match[1]}
      </a>
    )
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    elements.push(<span key={`text-${keyIdx++}`}>{text.substring(lastIndex)}</span>)
  }

  return elements.length > 0 ? elements : text
}

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Chào bạn! Mình là Trợ lý AI của anh Harry. Bạn muốn hỏi điều gì về các chủ đề mà Harry chia sẻ trên blog (Tư duy sản phẩm, Thương hiệu cá nhân, AI & Vibe Coding, Hành trình làm nghề...)?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return

    const userText = textToSend.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      })

      const data = await response.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: 'Có lỗi xảy ra khi kết nối máy chủ AI. Bạn thử lại nhé!' }])
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'assistant', text: 'Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra lại mạng.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen 
            ? 'bg-zinc-800 text-white' 
            : 'bg-sage text-white hover:bg-olive hover:shadow-emerald-950/10'
        }`}
        aria-label="Trợ lý AI Harry"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} className="animate-pulse" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex h-[520px] w-[350px] sm:w-[400px] flex-col overflow-hidden rounded-[2rem] border border-black/5 bg-[#FCFBF9]/95 shadow-2xl backdrop-blur-md animate-page-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 bg-cream-alt p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage text-white shadow-sm">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-serif)] text-base font-bold text-olive">Trợ lý AI Harry</h3>
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Hỏi về sản phẩm & AI</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-1 text-zinc-400 hover:bg-black/5 hover:text-zinc-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-sage text-white rounded-br-sm'
                      : 'bg-white border border-black/5 text-zinc-800 rounded-bl-sm'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {msg.role === 'user' ? msg.text : renderMessageText(msg.text)}
                  </div>
                </div>
              </div>
            ))}

            {/* Bouncing Loader */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm rounded-bl-sm">
                  <span className="text-xs text-zinc-400 mr-1">Đang nghĩ</span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-2 border-t border-black/5 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-sage">Gợi ý câu hỏi:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug)}
                    className="rounded-full border border-black/5 bg-white px-3 py-1.5 text-xs text-zinc-600 transition-all duration-300 hover:border-sage hover:bg-cream-alt hover:text-sage"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleSend(input)
            }}
            className="flex items-center gap-2 border-t border-black/5 p-3 bg-white"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi trợ lý ảo..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-black/5 bg-[#FCFBF9] px-4 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-sage/40"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-white shadow-sm transition hover:bg-olive disabled:opacity-50 active:scale-95"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
