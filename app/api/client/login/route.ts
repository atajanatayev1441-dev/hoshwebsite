import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signClientToken } from '@/lib/clientAuth'

export const dynamic = 'force-dynamic'

function normalizePhone(raw: string): string {
  const trimmed = raw.trim()
  const prefix = trimmed.startsWith('+') ? '+' : ''
  return prefix + trimmed.replace(/\D/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const phone = normalizePhone(body.phone ?? '')
    const password = body.password ?? ''

    if (!phone || !password) {
      return NextResponse.json({ error: 'Телефон и пароль обязательны' }, { status: 400 })
    }

    // Try exact normalized match first, then fall back to digit-only comparison
    // (handles legacy records stored with spaces)
    let client = await prisma.client.findUnique({ where: { phone } })
    if (!client) {
      const digits = phone.replace(/\D/g, '')
      const all = await prisma.client.findMany()
      client = all.find(c => c.phone.replace(/\D/g, '') === digits) ?? null
      // Normalize the legacy phone in DB so future logins work without fallback
      if (client) {
        await prisma.client.update({ where: { id: client.id }, data: { phone } })
      }
    }
    if (!client) {
      return NextResponse.json({ error: 'Неверный телефон или пароль' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, client.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Неверный телефон или пароль' }, { status: 401 })
    }

    const token = await signClientToken({ id: client.id, phone, name: client.name })

    const response = NextResponse.json({ id: client.id, phone, name: client.name })
    response.cookies.set('client_token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
    })
    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
