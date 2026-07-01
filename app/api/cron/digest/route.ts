export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTelegram } from '@/lib/telegram'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]
  const bookings = await prisma.booking.findMany({
    where: { date: today, status: { not: 'cancelled' } },
    orderBy: { time: 'asc' },
  })

  if (!bookings.length) {
    await sendTelegram(`🌅 <b>Доброе утро!</b>\n\nНа сегодня (${today}) бронирований нет.`)
    return NextResponse.json({ sent: true })
  }

  const lines = bookings.map(b => {
    const zone  = b.zone === 'vip' ? 'VIP' : 'Осн. зал'
    const venue = b.venue === 'coffee' ? '☕' : '🥃'
    const icon  = b.status === 'confirmed' ? '✅' : '⏳'
    return `${icon} ${b.time} ${venue} ${b.name || '—'} · ${zone} · ${b.guestCount} чел.`
  }).join('\n')

  await sendTelegram(
    `🌅 <b>Доброе утро! Брони на сегодня (${today})</b>\n\n${lines}\n\n` +
    `Всего: ${bookings.length} брон.`
  )

  return NextResponse.json({ sent: true, count: bookings.length })
}
