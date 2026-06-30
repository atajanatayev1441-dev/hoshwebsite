import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signClientToken } from '@/lib/clientAuth'

export const dynamic = 'force-dynamic'

function normalizePhone(raw: string): string {
  // Keep leading + then strip everything that isn't a digit
  const trimmed = raw.trim()
  const prefix = trimmed.startsWith('+') ? '+' : ''
  return prefix + trimmed.replace(/\D/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const phone = normalizePhone(body.phone ?? '')
    const name  = (body.name ?? '').trim()
    const password = body.password ?? ''

    if (!phone || !name) {
      return NextResponse.json({ error: 'Телефон и имя обязательны' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Пароль должен быть минимум 6 символов' }, { status: 400 })
    }

    const existing = await prisma.client.findUnique({ where: { phone } })
    if (existing) {
      return NextResponse.json({ error: 'Номер уже зарегистрирован' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const client = await prisma.client.create({
      data: { phone, name, passwordHash },
    })

    const token = await signClientToken({ id: client.id, phone: client.phone, name: client.name })

    const response = NextResponse.json({ id: client.id, phone: client.phone, name: client.name })
    response.cookies.set('client_token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
    })
    return response
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
