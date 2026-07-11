import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, clientIp } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

// Not a secret — the cloud name is already visible in every public photo
// URL. Pinning it here (rather than trusting any res.cloudinary.com path)
// stops this proxy from being used to hotlink/relay someone else's
// Cloudinary account's content at our bandwidth's expense.
const CLOUDINARY_PATH_PREFIX = '/dba4qttmx/'

// Cloudinary's own domain (res.cloudinary.com) is unreachable for many
// visitors without a VPN, even though our Railway server has no trouble
// reaching it. Proxying through our own domain means the browser only ever
// talks to the site it's already on — Cloudinary is fetched server-side.
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

  // Generous limit — a single page load fetches many thumbnails at once.
  // This is just to stop scripted abuse, not normal browsing.
  const { allowed } = await rateLimit(`image:${clientIp(req.headers)}`, 300, 60)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
  }
  if (parsed.hostname !== 'res.cloudinary.com' || !parsed.pathname.startsWith(CLOUDINARY_PATH_PREFIX)) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 400 })
  }

  const upstream = await fetch(url)
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: 'Upstream fetch failed' }, { status: upstream.status || 502 })
  }

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
