"use client"
import { useEffect, useState } from 'react'

export default function SettingsPage() {
	const [me, setMe] = useState<any>(null)
	const [name, setName] = useState('')
	const [bio, setBio] = useState('')
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		(async () => {
			const res = await fetch('/api/me', { cache: 'no-store' })
			const data = await res.json()
			setMe(data.user)
			setName(data.user?.name || '')
			setBio(data.user?.bio || '')
		})()
	}, [])

	async function onSave(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		try {
			if (!me?.id) throw new Error('Not signed in')
			if (avatarFile) {
				const fd = new FormData()
				fd.append('file', avatarFile)
				await fetch(`/api/users/${me.id}/avatar`, { method: 'POST', body: fd })
			}
			await fetch(`/api/users/${me.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, bio }) })
			alert('Updated')
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className="max-w-xl mx-auto p-4 space-y-4">
			<h1 className="text-2xl font-semibold">Settings</h1>
			<form onSubmit={onSave} className="space-y-3">
				<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full border rounded p-2" />
				<textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" className="w-full border rounded p-2" />
				<input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
				<button disabled={loading} className="bg-black text-white rounded px-3 py-2 disabled:opacity-50">Save</button>
			</form>
		</main>
	)
}
