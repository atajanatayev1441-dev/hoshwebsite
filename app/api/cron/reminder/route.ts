export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTelegram } from '@/lib/telegram'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now      = new Date()
  const today    = now.toISOString().split('T')[0]
  // window: bookings between now+50min and now+70min
  const from     = new Date(now.getTime() + 50 * 60 * 1000)
  const to       = new Date(now.getTime() + 70 * 60 * 1000)
  const fromTime = `${String(from.getHours()).padStart(2,'0')}:${String(from.getMinutes()).padStart(2,'0')}`
  const toTime   = `${String(to.getHours()).padStart(2,'0')}:${String(to.getMinutes()).padStart(2,'0')}`

  const bookings = await prisma.booking.findMany({
    where: {
      date: today,
      time: { gte: fromTime, lte: toTime },
      status: 'confirmed',
    },
  })

  for (const b of bookings) {
    const zone  = b.zone === 'vip' ? 'VIP зона' : 'Основной зал'
    const venue = b.venue === 'coffee' ? 'HOŞ Coffee ☕' : 'HOŞ Lounge 🥃'
    await sendTelegram(
      `⏰ <b>Напоминание — через ~1 час</b>\n\n` +
      `${venue}\n` +
      `👤 ${b.name || '—'}  📞 ${b.phone}\n` +
      `📅 ${b.time} · ${zone} · ${b.guestCount} гост.` +
      (b.note ? `\n💬 ${b.note}` : '')
    )
  }

  return NextResponse.json({ sent: bookings.length })
}
