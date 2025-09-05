import { NextResponse } from 'next/server'
import { supabaseServer, getPublicUrl } from '@/lib/supabase'
import { verifyJwt } from '@/lib/auth'

const BUCKET = 'public-media'

function getUserIdFromReq(req) {
  const token = req.cookies.get('token')?.value
  const payload = token ? verifyJwt(token) : null
  return payload?.sub || null
}

export async function POST(req) {
  try {
    const authUserId = getUserIdFromReq(req)
    if (!authUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const form = await req.formData()
    const file = form.get('file')
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = file.name?.split('.').pop() || 'jpg'
    const path = `public-media/posts/${authUserId}-${Date.now()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const { error } = await supabaseServer.storage
      .from(BUCKET)
      .upload(path.replace('public-media/', ''), Buffer.from(arrayBuffer), {
        upsert: true,
        contentType: file.type || 'image/jpeg',
      })

    if (error) {
      return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 })
    }

    const url = getPublicUrl(path)
    return NextResponse.json({ url }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


