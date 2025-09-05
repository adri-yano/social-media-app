"use client";
import { useEffect, useState } from "react";

function timeAgo(dateString: string) {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const d = new Date(dateString).getTime();
  const diff = d - Date.now();
  const minutes = Math.round(diff / 60000);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return rtf.format(days, "day");
}

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);

  // Editing state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function load() {
    setLoading(true);
    const qs = q ? `?q=${encodeURIComponent(q)}` : "";
    try {
      const [postsRes, meRes] = await Promise.all([
        fetch(`/api/posts${qs}`),
        fetch("/api/me", { cache: "no-store" }),
      ]);
      const postsJson = await postsRes.json();
      const meJson = await meRes.json();
      setPosts(postsJson.posts || []);
      setMe(meJson.user || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [q]);

  // Like toggle
  async function toggleLike(postId: string) {
    if (!me) return (window.location.href = "/login");
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (res.ok) {
      const { liked } = await res.json();
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                _count: {
                  ...p._count,
                  likes: (p._count?.likes || 0) + (liked ? 1 : -1),
                },
              }
            : p
        )
      );
    }
  }

  // Follow toggle
  async function toggleFollow(authorId: string) {
    if (!me) return (window.location.href = "/login");
    const res = await fetch(`/api/follow/${authorId}`, { method: "POST" });
    if (res.ok) {
      const { following } = await res.json();
      setPosts((prev) =>
        prev.map((p) =>
          p.author?.id === authorId ? { ...p, _isFollowing: following } : p
        )
      );
    }
  }

  // Navigate to post comments
  function goComment(postId: string) {
    if (!me) return (window.location.href = "/login");
    window.location.href = `/post/${postId}`;
  }

  // Handle edit image input
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setEditImage(file);
    setEditImagePreview(file ? URL.createObjectURL(file) : null);
  }

  // Save edited post
  async function saveEdit(postId: string) {
    const formData = new FormData();
    formData.append("content", editContent);
    // Include image only if a new one is selected
    if (editImage) formData.append("image", editImage);
    // If user wants to remove image
    if (!editImage && editImagePreview === null)
      formData.append("image", "null");

    const res = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      body: formData,
    });
    if (res.ok) {
      setEditingPostId(null);
      setEditContent("");
      setEditImage(null);
      setEditImagePreview(null);
      load();
    }
  }

  // Delete post
  async function deletePost(postId: string) {
    if (confirm("Are you sure you want to delete this post?")) {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) load();
    }
  }

  if (!mounted) return <div className="text-center p-4">Loading feed…</div>;

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">HEKA MEDIA</h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search posts or #hashtags"
            className="border rounded p-2 text-sm"
          />
          {me ? (
            <>
              <a href="/create" className="text-sm border rounded px-2 py-1">
                Create Post
              </a>
              <a href="/settings" className="text-sm border rounded px-2 py-1">
                Settings
              </a>
              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  window.location.href = "/";
                }}
                className="text-sm border rounded px-2 py-1"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="text-sm border rounded px-2 py-1">
                Login
              </a>
              <a href="/register" className="text-sm border rounded px-2 py-1">
                Register
              </a>
            </>
          )}
        </div>
      </div>

      {/* Posts */}
      {loading && (
        <div className="text-sm text-muted-foreground">Loading posts…</div>
      )}
      <div className="space-y-4">
        {posts.map((p) => (
          <article key={p.id} className="border rounded p-3 space-y-2">
            {/* Post header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {p.author?.avatar && (
                  <img
                    src={p.author.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <a
                  href={`/profile/${p.author?.username}`}
                  className="font-medium hover:underline"
                >
                  {p.author?.username}
                </a>
                <div className="text-sm text-muted-foreground">
                  {timeAgo(p.createdAt)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {me && me.id !== p.author?.id && (
                  <button
                    onClick={() => toggleFollow(p.author?.id)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    {p._isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
                {me && me.id === p.author?.id && (
                  <>
                    {editingPostId === p.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(p.id)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingPostId(null);
                            setEditContent("");
                            setEditImage(null);
                            setEditImagePreview(null);
                          }}
                          className="text-xs border rounded px-2 py-1"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingPostId(p.id);
                            setEditContent(p.content);
                            setEditImagePreview(p.image || null);
                          }}
                          className="text-xs border rounded px-2 py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePost(p.id)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Post content */}
            {editingPostId === p.id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                />
                {editImagePreview && (
                  <img src={editImagePreview} alt="" className="rounded" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <button
                  onClick={() => {
                    setEditImage(null);
                    setEditImagePreview(null);
                  }}
                  className="text-xs border rounded px-2 py-1"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <>
                <p>{p.content}</p>
                {p.image && <img src={p.image} alt="" className="rounded" />}
              </>
            )}

            {/* Post actions */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <button
                onClick={() => toggleLike(p.id)}
                className="text-sm border rounded px-2 py-1"
              >
                Like ({p._count?.likes || 0})
              </button>
              <button
                onClick={() => goComment(p.id)}
                className="text-sm border rounded px-2 py-1"
              >
                Comment ({p._count?.comments || 0})
              </button>
            </div>
          </article>
        ))}
        {!loading && posts.length === 0 && (
          <div className="text-sm text-muted-foreground">No posts yet.</div>
        )}
      </div>
    </main>
  );
}
