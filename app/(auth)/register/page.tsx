// 'use client'
// import { useState } from 'react'

// export default function RegisterPage() {
//   const [username, setUsername] = useState('')
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     setError('')
//     setLoading(true)
//     try {
//       const res = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, name, email, password }),
//       })
//       if (!res.ok) throw new Error('Registration failed')
//       window.location.href = '/feed'
//     } catch (err: any) {
//       setError(err.message || 'Registration failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <main className="min-h-screen flex items-center justify-center p-6">
//       <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
//         <h1 className="text-2xl font-semibold">Create account</h1>
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full border rounded p-2" />
//         <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full border rounded p-2" />
//         <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded p-2" />
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border rounded p-2" />
//         <button disabled={loading} className="w-full bg-black text-white rounded p-2 disabled:opacity-50">{loading ? 'Creating...' : 'Register'}</button>
//       </form>
//     </main>
//   )
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to login page after successful registration
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Create account</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full border rounded p-2"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full border rounded p-2"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border rounded p-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border rounded p-2"
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white rounded p-2 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </main>
  );
}
