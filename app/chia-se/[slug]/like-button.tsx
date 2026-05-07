'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes || 0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]')
    setLiked(likedPosts.includes(postId))
  }, [postId])

  const toggle = async () => {
    const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]')

    if (liked) {
      await supabase.rpc('decrement_post_likes', { post_id: postId })
      setLikes(l => l - 1)
      setLiked(false)
      localStorage.setItem('liked_posts', JSON.stringify(likedPosts.filter((id: string) => id!== postId)))
    } else {
      await supabase.rpc('increment_post_likes', { post_id: postId })
      setLikes(l => l + 1)
      setLiked(true)
      localStorage.setItem('liked_posts', JSON.stringify([...likedPosts, postId]))
    }
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm transition ${
        liked
         ? 'bg-red-50 border-red-200 text-red-600'
          : 'hover:bg-gray-50'
      }`}
    >
      <span className="text-base leading-none">{liked? '♥' : '♡'}</span>
      <span>{likes}</span>
    </button>
  )
}