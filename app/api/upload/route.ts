import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPG/PNG/WebP allowed' }, { status: 400 })
  }
  // Cloudinary (recommended for Railway — persistent storage)
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET) {
    const cf = new FormData()
    cf.append('file', file)
    cf.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET)
    cf.append('folder', 'hos-menu')

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: cf }
    )
    const data = await res.json()
    if (!res.ok || !data.secure_url) {
      return NextResponse.json({ error: 'Cloudinary upload failed', detail: data }, { status: 500 })
    }
    return NextResponse.json({ url: data.secure_url })
  }

  // Local fallback (works in dev; not persistent on Railway without Volume)
  const bytes  = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext    = file.name.split('.').pop()
  const fname  = `${Date.now()}.${ext}`
  const dir    = path.join(process.cwd(), 'public', 'uploads')

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
