import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// When NEXT_PUBLIC_MODE=admin, this deployment serves ONLY /admin routes.
// All other routes redirect to the main site (MAIN_SITE_URL env var).
// When NEXT_PUBLIC_MODE is not set (default), all routes work normally.

export function middleware(request: NextRequest) {
  const mode = process.env.NEXT_PUBLIC_MODE
  const { pathname } = request.nextUrl

  if (mode === 'admin') {
    const mainSiteUrl = process.env.MAIN_SITE_URL || 'https://hoshwebsite.up.railway.app'

    // Allow: /admin/*, /api/orders/*, /api/bookings/*, /api/menu/*, /api/categories/*,
    //        /api/promotions/*, /api/admin/*, /api/auth/*, /_next/*, /images/*, /favicon*
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
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
