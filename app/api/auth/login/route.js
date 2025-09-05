import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { loginSchema } from '@/lib/validators'
import { comparePassword, signJwt, getCookieName } from '@/lib/auth'

export async function POST(request) {
  try {
    const data = await request.json()
    const parsed = loginSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const { identifier, password } = parsed.data

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier },
        ],
      },
      select: { id: true, password: true, username: true, name: true, email: true, createdAt: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const ok = await comparePassword(password, user.password)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signJwt({ sub: user.id })
    const { password: _pw, ...safeUser } = user
    const res = NextResponse.json({ user: safeUser })
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


