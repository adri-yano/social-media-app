import { NextResponse } from 'next/server'

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/create',
  '/favicon.ico',
]

const PUBLIC_API = new Set([
  '/api/auth/login',
  '/api/auth/register',
  // Public posts listing for homepage
  '/api/posts',
])

function isPublicPath(req) {
  const { pathname } = req.nextUrl
  const method = req.method
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith('/_next'))) return true
  if (!pathname.startsWith('/api')) return false

  // Fully public endpoints
  if (PUBLIC_API.has(pathname)) return true

  // Allow GET to these patterns
  if (method === 'GET') {
    if (pathname === '/api/posts') return true
    if (pathname.startsWith('/api/posts/') && pathname.endsWith('/comments')) return true
    if (pathname.startsWith('/api/users/by-username/')) return true
    if (pathname.startsWith('/api/users/') && (pathname.endsWith('/followers') || pathname.endsWith('/following'))) return true
    if (pathname.startsWith('/api/users/') && !pathname.includes('/avatar')) return true
  }
  return false
}

export function middleware(req) {
  const { pathname } = req.nextUrl
  if (isPublicPath(req)) {
    return NextResponse.next()
  }

  const token = req.cookies.get('token')?.value
  const isApi = pathname.startsWith('/api')

  if (!token) {
    if (isApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = new URL('/login', req.url)
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico).*)'],
}


