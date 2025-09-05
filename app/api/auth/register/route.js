import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { registerSchema } from '@/lib/validators'
import { hashPassword, signJwt, getCookieName } from '@/lib/auth'

export async function POST(request) {
  try {
    const data = await request.json()
    const parsed = registerSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const { username, name, email, password } = parsed.data

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { id: true },
    })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: { username, name: name || null, email, password: passwordHash },
      select: { id: true, username: true, name: true, email: true, createdAt: true },
    })

    const token = signJwt({ sub: user.id })
    const res = NextResponse.json({ user })
    res.cookies.set(getCookieName(), token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


