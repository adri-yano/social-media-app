"use client";
import { useEffect, useState } from "react";

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data.posts || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreatePost(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      let image;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const up = await fetch("/api/posts/image", {
          method: "POST",
          body: fd,
        });
        if (!up.ok) throw new Error("Image upload failed");
        image = (await up.json()).url;
      }
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, image }),
      });
      if (!res.ok) throw new Error("Create failed");
      setContent("");
      setImageFile(null);
      await load();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <form onSubmit={onCreatePost} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full border rounded p-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
        <button
          disabled={loading || !content.trim()}
          className="bg-black text-white rounded px-3 py-2 disabled:opacity-50"
        >
          Post
        </button>
      </form>
      <div className="space-y-4">
        {posts.map((p) => (
          <article key={p.id} className="border rounded p-3 space-y-2">
            <div className="flex items-center gap-2">
              {p.author?.avatar && (
                <img
                  src={p.author.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="font-medium">
                {p.author?.name || p.author?.username}
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(p.createdAt).toLocaleString()}
              </div>
            </div>
            <p>{p.content}</p>
            {p.image && <img src={p.image} alt="" className="rounded" />}
            <div className="text-sm text-muted-foreground">
              {p._count?.likes || 0} likes · {p._count?.comments || 0} comments
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
