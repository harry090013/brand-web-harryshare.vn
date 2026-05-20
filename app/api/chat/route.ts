import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

// Simple helper to get category slug from name/id
function getCategorySlug(categoryName: string): string {
  const name = categoryName.toLowerCase()
  if (name.includes('sản phẩm') || name.includes('product')) return 'tu-duy-san-pham'
  if (name.includes('thương hiệu') || name.includes('brand')) return 'thuong-hieu-ca-nhan'
  if (name.includes('ai') || name.includes('vibe')) return 'ai-vibe-coding'
  if (name.includes('nghề') || name.includes('hành trình')) return 'hanh-trinh-lam-nghe'
  return 'ghi-chep'
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const cleanQuery = message.trim().toLowerCase()
    const supabase = await createSupabaseServerClient()

    // 1. Query matching posts from Supabase database
    let matchedPosts: any[] = []
    
    // First attempt: exact match of query term
    const { data: directMatch, error: directError } = await supabase
      .from('posts')
      .select('title, excerpt, content, slug, category:categories(name, slug)')
      .eq('published', true)
      .or(`title.ilike.%${cleanQuery}%,excerpt.ilike.%${cleanQuery}%`)
      .limit(3)

    if (directMatch && directMatch.length > 0) {
      matchedPosts = directMatch
    } else {
      // Fallback: match individual words if direct query term returned nothing
      const words = cleanQuery.split(/\s+/).filter(w => w.length > 2).slice(0, 3)
      if (words.length > 0) {
        const orConditions = words.map(w => `title.ilike.%${w}%,excerpt.ilike.%${w}%`).join(',')
        const { data: wordMatch } = await supabase
          .from('posts')
          .select('title, excerpt, content, slug, category:categories(name, slug)')
          .eq('published', true)
          .or(orConditions)
          .limit(3)
        
        if (wordMatch && wordMatch.length > 0) {
          matchedPosts = wordMatch
        }
      }
    }

    // Default Fallback: fetch 3 recent posts if no keywords matched
    if (matchedPosts.length === 0) {
      const { data: recentPosts } = await supabase
        .from('posts')
        .select('title, excerpt, content, slug, category:categories(name, slug)')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(3)
      matchedPosts = recentPosts || []
    }

    // 2. Format database context for the LLM
    const contextText = matchedPosts.map((p, idx) => {
      const catSlug = p.category?.slug || getCategorySlug(p.category?.name || '')
      const url = `/${catSlug}/${p.slug}`
      return `[Bài viết ${idx + 1}]
Tiêu đề: ${p.title}
Tóm tắt: ${p.excerpt || 'Không có'}
Nội dung: ${p.content ? p.content.substring(0, 1200) + '...' : 'Không có'}
Link bài viết: ${url}
---`
    }).join('\n')

    // 3. Define System Prompt
    const systemPrompt = `Bạn là Trợ lý ảo AI của anh Harry (chủ nhân blog HarryShare.vn).
Nhiệm vụ của bạn là trả lời các thắc mắc của độc giả một cách thân thiện, hữu ích và chân thực dựa trên tinh thần và các nội dung từ bài viết của anh Harry.

Dưới đây là một số bài viết liên quan từ blog HarryShare để làm ngữ cảnh trả lời (dùng thông tin này để dẫn link và trả lời chính xác nhất):
${contextText}

Nguyên tắc trả lời:
1. Xưng hô là "mình" (hoặc tự xưng "Trợ lý AI của anh Harry") và gọi người dùng là "bạn". Giọng điệu chân thành, mộc mạc, thực chiến, không màu mè hoa mỹ hay sáo rỗng.
2. Trả lời bằng tiếng Việt, ngắn gọn, súc tích (khoảng 2-4 đoạn văn ngắn).
3. Luôn ưu tiên dùng thông tin từ các bài viết ở trên. Tuyệt đối không tự bịa ra trải nghiệm cá nhân của Harry nếu không có trong ngữ cảnh.
4. Khi đề cập đến một chủ đề có trong bài viết, hãy khéo léo chèn link bài viết dưới dạng Markdown.
   Ví dụ: "Bạn có thể đọc thêm bài viết [Tiêu đề bài viết](link_bai_viet) để hiểu rõ hơn."
5. Nếu câu hỏi hoàn toàn nằm ngoài nội dung chia sẻ của Harry, hãy nói nhẹ nhàng: "Câu hỏi này nằm ngoài các nội dung mình (và anh Harry) chia sẻ trên blog rồi. Nhưng dưới góc nhìn chung..." rồi trả lời ngắn gọn theo kiến thức của bạn, sau đó mời họ hỏi về Tư duy sản phẩm, Thương hiệu cá nhân, AI/Vibe Coding, hoặc Hành trình làm nghề.`

    const promptText = `${systemPrompt}\n\nCâu hỏi của người dùng: "${message}"`

    // 4. Try calling Gemini API if key is present
    const geminiKey = process.env.GEMINI_API_KEY
    const openAIKey = process.env.OPENAI_API_KEY

    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 4096
              }
            })
          }
        )
                const resJson = await response.json()
        const reply = resJson.candidates?.[0]?.content?.parts?.[0]?.text
        if (reply) {
          return NextResponse.json({ reply })
        }
      } catch (err) {
        console.error('Gemini API call failed, falling back...', err)
      }
    }

    // 5. Try calling OpenAI API if key is present
    if (openAIKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ],
            temperature: 0.6,
            max_tokens: 800
          })
        })
        const resJson = await response.json()
        const reply = resJson.choices?.[0]?.message?.content
        if (reply) {
          return NextResponse.json({ reply })
        }
      } catch (err) {
        console.error('OpenAI API call failed, falling back...', err)
      }
    }

    // 6. Fallback smart mock response generator (if no keys are available or APIs fail)
    // It crafts a response based on matched blog posts
    let fallbackReply = `Chào bạn! Mình là Trợ lý AI của anh Harry. Hiện tại do lỗi kết nối kết nối AI tạm thời, mình xin phép tóm tắt bài viết liên quan nhất để trả lời bạn:\n\n`
    if (matchedPosts.length > 0) {
      const bestPost = matchedPosts[0]
      const catSlug = bestPost.category?.slug || getCategorySlug(bestPost.category?.name || '')
      const url = `/${catSlug}/${bestPost.slug}`
      fallbackReply += `Về câu hỏi của bạn, bài viết **"${bestPost.title}"** có chia sẻ: \n\n> *${bestPost.excerpt || 'Vui lòng đọc chi tiết bài viết dưới đây.'}*\n\nBạn có thể đọc toàn bộ bài viết chia sẻ chi tiết của anh Harry tại đây nhé: [Đọc bài viết: ${bestPost.title}](${url}).`
    } else {
      fallbackReply += `Mình chưa tìm thấy bài viết nào khớp chính xác với câu hỏi của bạn. Bạn có thể tham khảo các bài viết mới nhất tại mục [Ghi chép](/ghi-chep) nhé!`
    }

    return NextResponse.json({ reply: fallbackReply })

  } catch (error: any) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
