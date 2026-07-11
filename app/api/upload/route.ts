import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { rateLimit, clientIp } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

const MAX_SIZE = 8 * 1024 * 1024 // 8MB

// Sniff actual file bytes instead of trusting the client-supplied MIME type
// (trivially spoofable) or the original filename's extension.
function sniffImageType(buf: Buffer): { mime: string; ext: string } | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { mime: 'image/jpeg', ext: 'jpg' }
  }
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { mime: 'image/png', ext: 'png' }
  }
  if (buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    return { mime: 'image/webp', ext: 'webp' }
  }
  return null
}

export async function POST(req: NextRequest) {
  const { allowed } = await rateLimit(`upload:${clientIp(req.headers)}`, 20, 60)
  if (!allowed) {
    return NextResponse.json({ error: 'Слишком много загрузок, попробуйте позже' }, { status: 429 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Файл слишком большой (макс. 8МБ)' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const detected = sniffImageType(buffer)
  if (!detected) {
    return NextResponse.json({ error: 'Only JPG/PNG/WebP allowed' }, { status: 400 })
  }

  // Cloudinary (recommended for Railway — persistent storage)
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET) {
    const cf = new FormData()
    cf.append('file', new Blob([buffer], { type: detected.mime }), `upload.${detected.ext}`)
    cf.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET)
    cf.append('folder', 'hos-menu')

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: cf }
    )
    const data = await res.json()
    if (!res.ok || !data.secure_url) {
      console.error('Cloudinary upload failed:', data)
      const message = data?.error?.message || 'Cloudinary upload failed'
      return NextResponse.json({ error: `Cloudinary: ${message}` }, { status: 500 })
    }
    return NextResponse.json({ url: data.secure_url })
  }

  // Local fallback (works in dev; not persistent on Railway without Volume)
  const fname = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${detected.ext}`
  const dir   = path.join(process.cwd(), 'public', 'uploads')

  try {
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, fname), buffer)
    return NextResponse.json({ url: `/uploads/${fname}` })
  } catch (err) {
    return NextResponse.json({
      error: 'Local save failed. Set CLOUDINARY_CLOUD_NAME + CLOUDINARY_UPLOAD_PRESET env vars for persistent upload on Railway.',
    }, { status: 500 })
  }
}
