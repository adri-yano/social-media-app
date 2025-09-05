import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyJwt } from '@/lib/auth'
import { postCreateSchema } from '@/lib/validators'

function getUserIdFromReq(req) {
  const token = req.cookies.get('token')?.value
  const payload = token ? verifyJwt(token) : null
  return payload?.sub || null
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const authorId = searchParams.get('authorId') || undefined
    const authorUsername = searchParams.get('authorUsername') || undefined
    const q = searchParams.get('q')?.trim() || ''
    const feed = searchParams.get('feed')

    let where = {}
    
    // Filter by author ID or username
    if (authorId) {
      where.authorId = authorId
    } else if (authorUsername) {
      const user = await prisma.user.findUnique({
        where: { username: authorUsername },
        select: { id: true }
      })
      if (user) {
        where.authorId = user.id
      } else {
        // User not found, return empty results
        return NextResponse.json({ posts: [] })
      }
    }

    if (q) {
      // Basic search: match content or hashtag token
      // If q starts with #, search for that hashtag specifically
      if (q.startsWith('#')) {
        where.content = { contains: q, mode: 'insensitive' }
      } else {
        where.content = { contains: q, mode: 'insensitive' }
      }
    }

    // Personalized feed from followed users
    if (feed === 'following') {
      const authUserId = getUserIdFromReq(req)
      if (!authUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      const following = await prisma.follow.findMany({
        where: { followerId: authUserId },
        select: { followingId: true },
      })
      const ids = following.map((f) => f.followingId)
      where.authorId = { in: ids }
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { likes: true, comments: true } },
      },
      take: 50,
    })
    return NextResponse.json({ posts })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const authUserId = getUserIdFromReq(req)
    if (!authUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await req.json()
    const parsed = postCreateSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const { content, image } = parsed.data
    const post = await prisma.post.create({
      data: { content, image: image || null, authorId: authUserId },
      include: { author: { select: { id: true, username: true, name: true, avatar: true } } },
    })
    return NextResponse.json({ post }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


