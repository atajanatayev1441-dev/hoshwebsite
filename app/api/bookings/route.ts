export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { triggerPusher, PUSHER_CHANNELS, PUSHER_EVENTS } from '@/lib/pusher'
import { sendTelegram } from '@/lib/telegram'

export async function GET(req: NextRequest) {
  const venue = req.nextUrl.searchParams.get('venue')
  const bookings = await prisma.booking.findMany({
    where: venue ? { venue } : undefined,
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })
  return NextResponse.json(bookings)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { zone, date, time, guestCount, name, phone, note, clientLang, venue } = body

  if (!zone || !date || !time || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const booking = await prisma.booking.create({
    data: {
      zone,
      date,
      time,
      guestCount: Number(guestCount) || 2,
      name: name || '',
      phone,
      note: note || '',
      clientLang: clientLang ?? 'ru',
      status: 'pending',
      venue: venue ?? 'lounge',
    },
  })

  await triggerPusher(PUSHER_CHANNELS.ADMIN, PUSHER_EVENTS.NEW_BOOKING, {
    id: booking.id,
    zone: booking.zone,
    date: booking.date,
    time: booking.time,
    guestCount: booking.guestCount,
    name: booking.name,
    phone: booking.phone,
    venue: venue ?? 'lounge',
    createdAt: booking.createdAt,
  })

  const venueLabel = (venue ?? 'lounge') === 'coffee' ? 'HOŞ Coffee' : 'HOŞ Lounge'
  const zoneLabel = booking.zone === 'vip' ? 'VIP зона' : 'Основной зал'
  await sendTelegram(
    `🪑 <b>Новое бронирование</b> — ${venueLabel}\n\n` +
    `👤 ${booking.name || '—'}\n` +
    `📞 ${booking.phone}\n` +
    `📅 ${booking.date} в ${booking.time}\n` +
    `🏛 ${zoneLabel} · ${booking.guestCount} гост.\n` +
    (booking.note ? `💬 ${booking.note}` : '')
  )

  return NextResponse.json(booking, { status: 201 })
}
