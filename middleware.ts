import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Every mutating/listing admin operation lives behind a NextAuth session.
// Public storefront reads (GET menu/categories/promotions/events) and
// customer-initiated writes (placing an order/booking, polling status by id)
// stay open — those are the endpoints real visitors need with no login.
function needsAdminSession(pathname: string, method: string): boolean {
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') return true
  if (pathname.startsWith('/api/admin/')) return true

  if (pathname === '/api/upload' && method === 'POST') return true

  if (pathname === '/api/menu' && method !== 'GET') return true
  if (/^\/api\/menu\/\d+$/.test(pathname)) return true

  if (pathname === '/api/categories' && method !== 'GET') return true
  if (/^\/api\/categories\/\d+$/.test(pathname)) return true

  if (pathname === '/api/promotions' && method !== 'GET') return true
  if (/^\/api\/promotions\/\d+$/.test(pathname)) return true

  if (pathname === '/api/events' && method !== 'GET') return true

  if (pathname === '/api/bookings' && method === 'GET') return true
  if (/^\/api\/bookings\/\d+$/.test(pathname)) return true

  if (pathname === '/api/orders' && method === 'GET') return true
  if (/^\/api\/orders\/\d+$/.test(pathname)) return true

  if (pathname === '/api/coffee/categories' && method !== 'GET') return true
  if (pathname === '/api/coffee/menu' && method !== 'GET') return true
  if (pathname === '/api/coffee/orders' && method === 'GET') return true
  if (/^\/api\/coffee\/orders\/\d+\/status$/.test(pathname) && method === 'PUT') return true

  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (needsAdminSession(pathname, request.method)) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

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
