export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { triggerPusher, PUSHER_CHANNELS, PUSHER_EVENTS } from '@/lib/pusher'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const bookings = await prisma.booking.findMany({
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })
  return NextResponse.json(bookings)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { zone, date, time, guestCount, name, phone, note, clientLang } = body

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
    },
  })

  await triggerPusher(PUSHER_CHANNELS.ADMIN, PUSHER_EVENTS.NEW_BOOKING, {
    id: booking.id,
    zone: booking.zone,
    date: booking.date,
    time: booking.time,
    guestCount: booking.guestCount,
    name: booking.name,
    createdAt: booking.createdAt,
  })

  return NextResponse.json(booking, { status: 201 })
}
