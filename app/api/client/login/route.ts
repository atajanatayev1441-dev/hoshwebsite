import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signClientToken } from '@/lib/clientAuth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json()

    if (!phone || !password) {
      return NextResponse.json({ error: 'Телефон и пароль обязательны' }, { status: 400 })
    }

    const client = await prisma.client.findUnique({ where: { phone } })
    if (!client) {
      return NextResponse.json({ error: 'Неверный телефон или пароль' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, client.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Неверный телефон или пароль' }, { status: 401 })
    }

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
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
