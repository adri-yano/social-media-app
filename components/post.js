'use client';
import { useState } from 'react';

export default function Post({ post }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      if (!post.comments) post.comments = [];
      post.comments.push({
        username: 'you',
        text: newComment
      });
      setNewComment('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border mb-6">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <img 
          src={post.avatar} 
          alt={post.username}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div className="flex-1">
          <p className="font-semibold text-sm">{post.username}</p>
          <p className="text-xs text-gray-500">2 hours ago</p>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Post Image */}
      <div className="relative">
        <img 
          src={post.image} 
          alt="Post"
          className="w-full h-auto"
        />
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center mb-3">
          <button 
            onClick={handleLike}
            className={`mr-4 ${liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
          >
            <svg className="w-6 h-6" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <button className="mr-4 text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
          <button className="ml-auto text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-sm mb-2">{likes} likes</p>

        {/* Caption */}
        <div className="mb-2">
          <span className="font-semibold text-sm mr-2">{post.username}</span>
          <span className="text-sm">{post.caption || 'Amazing photo! 📸'}</span>
        </div>

        {/* Comments */}
        {post.comments && post.comments.length > 0 && (
          <div className="mb-2">
            {post.comments.slice(0, 2).map((comment, index) => (
              <div key={index} className="mb-1">
                <span className="font-semibold text-sm mr-2">{comment.username}</span>
                <span className="text-sm">{comment.text}</span>
              </div>
            ))}
            {post.comments.length > 2 && (
              <button 
                onClick={() => setShowComments(!showComments)}
                className="text-gray-500 text-sm"
              >
                View all {post.comments.length} comments
              </button>
            )}
          </div>
        )}

        {/* All Comments */}
        {showComments && post.comments && (
          <div className="border-t pt-3 mb-3">
            {post.comments.map((comment, index) => (
              <div key={index} className="mb-2">
                <span className="font-semibold text-sm mr-2">{comment.username}</span>
                <span className="text-sm">{comment.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        <form onSubmit={handleComment} className="flex items-center border-t pt-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
          <button 
            type="submit"
            disabled={!newComment.trim()}
            className="text-blue-500 font-semibold text-sm ml-2 disabled:opacity-50"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
