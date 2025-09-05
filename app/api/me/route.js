import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyJwt } from '@/lib/auth'

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value
    const payload = token ? verifyJwt(token) : null
    if (!payload?.sub) return NextResponse.json({ user: null }, { status: 200 })
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, username: true, name: true, email: true, bio: true, avatar: true, createdAt: true },
    })
    return NextResponse.json({ user })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


