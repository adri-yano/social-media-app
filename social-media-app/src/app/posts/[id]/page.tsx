"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AiOutlineHeart, AiFillHeart, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { BASE_URL } from "../../../config";

interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: User;
}

interface Post {
  id: string;
  content: string;
  image?: string;
  author: User;
  comments: Comment[];
  _count: {
    likes: number;
    comments: number;
  };
}

export default function SinglePostPage() {
  const { id } = useParams(); // get post id from URL
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState("");
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState("");

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId"); // store logged-in user id

  // Fetch post
  const fetchPost = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPost(data);
        setContent(data.content);
      } else {
        alert(data.error || "Failed to fetch post");
        router.push("/home"); // redirect if post not found
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while fetching post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  // Handle delete
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Post deleted successfully");
        router.push("/home");
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting");
    }
  };

  // Handle edit
  const handleUpdate = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.ok) {
        setPost(data);
        setEditing(false);
        alert("Post updated successfully");
      } else {
        alert(data.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating post");
    }
  };

  // Handle add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await res.json();
      if (res.ok) {
        setPost((prev) => prev && { ...prev, comments: [...prev.comments, data] });
        setNewComment("");
      } else {
        alert(data.error || "Failed to add comment");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while adding comment");
    }
  };

  // Handle like toggle
  const handleLike = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setLiked((prev) => !prev);
        fetchPost(); // refresh likes count
      } else {
        const data = await res.json();
        alert(data.error || "Failed to like post");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while liking post");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!post) return <p className="text-center mt-10">Post not found</p>;

  const isAuthor = currentUserId === post.author.id;

  return (
    <div className="flex justify-center px-4 py-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md">
        {/* Post Header */}
        <div className="flex items-center p-4">
          <img
            src={post.author.avatar || "/default-avatar.png"}
            alt={post.author.username}
            className="w-12 h-12 rounded-full object-cover mr-3"
          />
          <div className="flex-1">
            <p className="font-bold text-gray-900">{post.author.name}</p>
            <p className="text-sm text-gray-500">@{post.author.username}</p>
          </div>
          {isAuthor && (
            <div className="flex gap-2">
              <button onClick={() => setEditing(!editing)} className="text-gray-600 hover:text-blue-500">
                <AiOutlineEdit size={20} />
              </button>
              <button onClick={handleDelete} className="text-gray-600 hover:text-red-500">
                <AiOutlineDelete size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Post Image */}
        {post.image && (
          <img src={post.image} alt="Post" className="w-full object-cover max-h-[400px]" />
        )}

        {/* Post Content */}
        <div className="p-4">
          {editing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
            />
          ) : (
            <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
          )}

          {/* Hashtags */}
          {post.content.match(/#\w+/g) && (
            <p className="text-blue-500 mt-2">
              {post.content.match(/#\w+/g)?.join(" ")}
            </p>
          )}

          {editing && (
            <button
              onClick={handleUpdate}
              className="mt-2 w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition"
            >
              Save
            </button>
          )}

          {/* Likes */}
          <div className="flex items-center gap-2 mt-3">
            <button onClick={handleLike}>
              {liked ? (
                <AiFillHeart className="text-red-500" size={24} />
              ) : (
                <AiOutlineHeart className="text-gray-600" size={24} />
              )}
            </button>
            <span>{post._count.likes + (liked ? 1 : 0)} likes</span>
          </div>

          {/* Comments */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Comments ({post.comments.length})</h3>

            {/* Add Comment */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleAddComment}
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition"
              >
                Post
              </button>
            </div>

            {/* List Comments */}
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 mb-2">
                <img
                  src={comment.author.avatar || "/default-avatar.png"}
                  alt={comment.author.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-900 font-semibold">{comment.author.username}</p>
                  <p className="text-gray-800">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
