export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { sendTelegram } from '@/lib/telegram'
import { rateLimit, clientIp } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const { allowed } = await rateLimit(`reviews:${clientIp(req.headers)}`, 5, 600)
  if (!allowed) {
    return NextResponse.json({ error: 'Слишком много отзывов, попробуйте позже' }, { status: 429 })
  }

  const body = await req.json()
  const { name, rating, message } = body

  if (!message || typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 })
  }

  const stars = Number.isInteger(rating) && rating >= 1 && rating <= 5
    ? '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
    : ''

  await sendTelegram(
    `💬 <b>Новый отзыв</b>\n\n` +
    (stars ? `${stars}\n\n` : '') +
    `👤 ${name?.trim() || 'Аноним'}\n\n` +
    `${message.trim()}`
  )

  return NextResponse.json({ ok: true })
}
