import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const mode = process.env.NEXT_PUBLIC_MODE

  // Admin-only service: / → /admin, everything else → main site
  if (mode === 'admin') {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    const mainSiteUrl = process.env.MAIN_SITE_URL || 'https://hoshwebsite-production.up.railway.app'
    const isAllowed =
      pathname.startsWith('/admin') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/images') ||
      pathname === '/favicon.ico' ||
      pathname === '/notification.mp3'

    if (!isAllowed) {
      return NextResponse.redirect(mainSiteUrl + pathname)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
