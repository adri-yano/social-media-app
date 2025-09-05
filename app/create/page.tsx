'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePostPage() {
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) {
      setError('Please write some content')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      let image
      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        const uploadRes = await fetch('/api/posts/image', { method: 'POST', body: formData })
        if (!uploadRes.ok) throw new Error('Image upload failed')
        image = (await uploadRes.json()).url
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, image }),
      })
      
      if (!res.ok) throw new Error('Failed to create post')
      
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Post</h1>
        <button onClick={() => router.back()} className="text-sm border rounded px-3 py-1">Cancel</button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full border rounded p-3 min-h-[120px] resize-none"
            maxLength={5000}
          />
          <div className="text-sm text-muted-foreground mt-1">{content.length}/5000</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Add an image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full border rounded p-2"
          />
          {imageFile && (
            <div className="mt-2">
              <img src={URL.createObjectURL(imageFile)} alt="Preview" className="max-w-xs rounded" />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border rounded px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  )
}
