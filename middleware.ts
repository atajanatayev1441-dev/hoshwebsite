import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const mode = process.env.NEXT_PUBLIC_MODE

  // Protect /admin/* via JWT — skip login page and API auth routes
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/api/auth')
  ) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production',
    })
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Admin-only mode: redirect non-admin routes to main site
  if (mode === 'admin') {
    const mainSiteUrl = process.env.MAIN_SITE_URL || 'https://hoshwebsite.up.railway.app'
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
