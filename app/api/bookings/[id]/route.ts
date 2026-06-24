export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { triggerPusher, PUSHER_CHANNELS, PUSHER_EVENTS } from '@/lib/pusher'
import { sendSMS, getBookingConfirmedSMS, getBookingCancelledSMS } from '@/lib/sms'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {

  const booking = await prisma.booking.findUnique({ where: { id: Number(params.id) } })
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(booking)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

  const { status } = await req.json()
  const validStatuses = ['pending', 'confirmed', 'cancelled']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const booking = await prisma.booking.update({
    where: { id: Number(params.id) },
    data: { status },
  })

  if (status === 'confirmed') {
    const smsText = getBookingConfirmedSMS(booking)
    await sendSMS(booking.phone, smsText)
  } else if (status === 'cancelled') {
    const smsText = getBookingCancelledSMS(booking)
    await sendSMS(booking.phone, smsText)
  }

  await triggerPusher(PUSHER_CHANNELS.ADMIN, PUSHER_EVENTS.BOOKING_UPDATED, {
    id: booking.id,
    status: booking.status,
  })

  return NextResponse.json(booking)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {

  await prisma.booking.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ ok: true })
}
