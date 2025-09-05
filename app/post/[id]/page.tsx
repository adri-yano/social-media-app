'use client'
import { useEffect, useState } from 'react'
import Comment from '@/components/Comment'

export default function PostPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [me, setMe] = useState<any>(null)

  async function load() {
    // Reuse the list API and filter client-side for demo; ideally add GET /api/posts/[id]
    const [postsRes, commentsRes, meRes] = await Promise.all([
      fetch('/api/posts'),
      fetch(`/api/posts/${id}/comments`),
      fetch('/api/me', { cache: 'no-store' })
    ])
    const postsData = await postsRes.json()
    const commentsData = await commentsRes.json()
    const meData = await meRes.json()
    setPost((postsData.posts || []).find((p: any) => p.id === id) || null)
    setComments(commentsData.comments || [])
    setMe(meData.user || null)
  }

  useEffect(() => { load() }, [id])

  async function onComment(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    const res = await fetch(`/api/posts/${id}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) })
    if (res.ok) { setContent(''); load() }
  }

  async function onReply(commentId: string, replyContent: string) {
    if (!replyContent.trim()) return
    const res = await fetch(`/api/posts/${id}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: replyContent, parentCommentId: commentId }) })
    if (res.ok) load()
  }

  async function onEditComment(commentId: string, content: string) {
    const res = await fetch(`/api/comments/${commentId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) })
    if (res.ok) load()
  }

  async function onDeleteComment(commentId: string) {
    const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
    if (res.ok) load()
  }

  if (!post) return <main className="max-w-2xl mx-auto p-4">Loading...</main>

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <article className="border rounded p-3 space-y-2">
        <div className="flex items-center gap-2">
          {post.author?.avatar && <img src={post.author.avatar} alt="" className="w-8 h-8 rounded-full" />}
          <div className="font-medium">{post.author?.name || post.author?.username}</div>
          <div className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</div>
        </div>
        <p>{post.content}</p>
        {post.image && <img src={post.image} alt="" className="rounded" />}
      </article>

      {me ? (
        <form onSubmit={onComment} className="flex gap-2">
          <input value={content} onChange={(e) => setContent(e.target.value)} className="flex-1 border rounded p-2" placeholder="Write a comment" />
          <button className="bg-black text-white rounded px-3">Send</button>
        </form>
      ) : (
        <div className="text-sm text-muted-foreground">
          <a href="/login" className="text-blue-600 hover:underline">Login</a> to comment
        </div>
      )}

      <div className="space-y-3">
        {comments.map((c) => (
          <Comment
            key={c.id}
            comment={c}
            me={me}
            onReply={onReply}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
            postId={id}
          />
        ))}
      </div>
    </main>
  )
}


