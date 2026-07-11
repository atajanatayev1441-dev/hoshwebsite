import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Cloudinary's own domain (res.cloudinary.com) is unreachable for many
// visitors without a VPN, even though our Railway server has no trouble
// reaching it. Proxying through our own domain means the browser only ever
// talks to the site it's already on — Cloudinary is fetched server-side.
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
  }
  if (parsed.hostname !== 'res.cloudinary.com') {
    return NextResponse.json({ error: 'Only Cloudinary URLs are allowed' }, { status: 400 })
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
