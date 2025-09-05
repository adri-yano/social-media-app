'use client'
import { useState } from 'react'

interface CommentProps {
  comment: any
  me: any
  onReply: (commentId: string, content: string) => void
  onEdit: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
  postId: string
}

export default function Comment({ comment, me, onReply, onEdit, onDelete, postId }: CommentProps) {
  const [showReply, setShowReply] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)

  async function handleReply() {
    if (!replyContent.trim()) return
    onReply(comment.id, replyContent)
    setReplyContent('')
    setShowReply(false)
  }

  async function handleEdit() {
    if (!editContent.trim()) return
    onEdit(comment.id, editContent)
    setIsEditing(false)
  }

  async function handleDelete() {
    if (confirm('Delete this comment?')) {
      onDelete(comment.id)
    }
  }

  return (
    <div className="border rounded p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {comment.author?.avatar && <img src={comment.author.avatar} alt="" className="w-6 h-6 rounded-full" />}
          <div className="text-sm font-medium">{comment.author?.name || comment.author?.username}</div>
        </div>
        {me && me.id === comment.author?.id && (
          <div className="flex items-center gap-1">
            <button onClick={() => setIsEditing(!isEditing)} className="text-xs border rounded px-2 py-1">Edit</button>
            <button onClick={handleDelete} className="text-xs border rounded px-2 py-1">Delete</button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full border rounded p-2 text-sm"
            rows={2}
          />
          <div className="flex gap-2">
            <button onClick={handleEdit} className="text-xs bg-black text-white rounded px-2 py-1">Save</button>
            <button onClick={() => setIsEditing(false)} className="text-xs border rounded px-2 py-1">Cancel</button>
          </div>
        </div>
      ) : (
        <p className="text-sm">{comment.content}</p>
      )}
      
      {me && !isEditing && (
        <button 
          onClick={() => setShowReply(!showReply)} 
          className="text-xs text-blue-600 hover:underline"
        >
          Reply
        </button>
      )}
      
      {showReply && me && (
        <div className="space-y-2 pl-4 border-l-2 border-gray-200">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full border rounded p-2 text-sm"
            rows={2}
          />
          <div className="flex gap-2">
            <button onClick={handleReply} className="text-xs bg-black text-white rounded px-2 py-1">Reply</button>
            <button onClick={() => setShowReply(false)} className="text-xs border rounded px-2 py-1">Cancel</button>
          </div>
        </div>
      )}
      
      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-4 space-y-2">
          {comment.replies.map((reply: any) => (
            <Comment
              key={reply.id}
              comment={reply}
              me={me}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              postId={postId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
