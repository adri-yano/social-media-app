// app/profile/[username]/ProfilePage.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage({ username }: { username: string }) {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  async function load() {
    try {
      const [userRes, postsRes, meRes] = await Promise.all([
        fetch(`/api/users/by-username/${username}`),
        fetch(`/api/posts?authorUsername=${username}`),
        fetch("/api/me", { cache: "no-store" }),
      ]);

      const userData = await userRes.json();
      const postsData = await postsRes.json();
      const meData = await meRes.json();

      setUser(userData.user);
      setPosts(postsData.posts || []);
      setMe(meData.user);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadFollowers() {
    if (!user?.id) return;
    const res = await fetch(`/api/users/${user.id}/followers`);
    const data = await res.json();
    setFollowers(data.followers || []);
  }

  async function loadFollowing() {
    if (!user?.id) return;
    const res = await fetch(`/api/users/${user.id}/following`);
    const data = await res.json();
    setFollowing(data.following || []);
  }

  async function toggleFollow() {
    if (!me || !user) return;
    const res = await fetch(`/api/follow/${user.id}`, { method: "POST" });
    if (res.ok) {
      const { following } = await res.json();
      setUser((prev: any) => ({
        ...prev,
        _count: {
          ...prev._count,
          followers: prev._count.followers + (following ? 1 : -1),
        },
        _isFollowing: following,
      }));
    }
  }

  useEffect(() => {
    load();
  }, [username]);
  useEffect(() => {
    if (showFollowers) loadFollowers();
  }, [showFollowers, user?.id]);
  useEffect(() => {
    if (showFollowing) loadFollowing();
  }, [showFollowing, user?.id]);

  if (loading) return <main className="max-w-4xl mx-auto p-4">Loading...</main>;
  if (!user)
    return <main className="max-w-4xl mx-auto p-4">User not found</main>;

  return (
    <main className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to feed
        </Link>
        {me && (
          <div className="flex items-center gap-2">
            <Link href="/settings" className="text-sm border rounded px-2 py-1">
              Settings
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/";
              }}
              className="text-sm border rounded px-2 py-1"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="flex items-center gap-6">
        {user.avatar ? (
          <img
            src={user.avatar}
            className="w-24 h-24 rounded-full"
            alt={`${user.name || user.username}'s avatar`}
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-2xl">
            {user.name?.[0] || user.username[0]}
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          {user.bio && <p className="mt-2">{user.bio}</p>}
        </div>
        {me && me.id !== user.id && (
          <button
            onClick={toggleFollow}
            className="bg-black text-white rounded px-4 py-2"
          >
            {user._isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm">
        <button
          onClick={() => setShowFollowers(true)}
          className="hover:underline"
        >
          <span className="font-semibold">{user._count?.followers || 0}</span>{" "}
          followers
        </button>
        <button
          onClick={() => setShowFollowing(true)}
          className="hover:underline"
        >
          <span className="font-semibold">{user._count?.following || 0}</span>{" "}
          following
        </button>
        <span>
          <span className="font-semibold">{user._count?.posts || 0}</span> posts
        </span>
      </div>

      {/* Posts Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link key={post.id} href={`/post/${post.id}`} className="group">
                <div className="border rounded p-3 space-y-2 hover:shadow-md transition-shadow">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={`Post by ${user.name || user.username}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                      <p className="text-sm text-muted-foreground text-center p-2">
                        {post.content.slice(0, 100)}...
                      </p>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No posts yet.</p>
        )}
      </div>

      {/* Followers Modal */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Followers</h3>
              <button
                onClick={() => setShowFollowers(false)}
                className="text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              {followers.map((follower) => (
                <Link
                  key={follower.id}
                  href={`/profile/${follower.username}`}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                >
                  {follower.avatar ? (
                    <img
                      src={follower.avatar}
                      className="w-8 h-8 rounded-full"
                      alt={`${follower.name || follower.username}'s avatar`}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                      {follower.name?.[0] || follower.username[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">
                      {follower.name || follower.username}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      @{follower.username}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Following</h3>
              <button
                onClick={() => setShowFollowing(false)}
                className="text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              {following.map((followed) => (
                <Link
                  key={followed.id}
                  href={`/profile/${followed.username}`}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                >
                  {followed.avatar ? (
                    <img
                      src={followed.avatar}
                      className="w-8 h-8 rounded-full"
                      alt={`${followed.name || followed.username}'s avatar`}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                      {followed.name?.[0] || followed.username[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">
                      {followed.name || followed.username}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      @{followed.username}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
