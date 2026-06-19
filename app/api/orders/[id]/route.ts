import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { triggerPusher, PUSHER_CHANNELS, PUSHER_EVENTS } from '@/lib/pusher'
import { sendSMS, getOrderConfirmedSMS } from '@/lib/sms'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const order = await prisma.order.findUnique({
    where: { id: Number(params.id) },
    include: { items: { include: { menuItem: true } } },
  })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { status } = await req.json()
  const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'cancelled']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const order = await prisma.order.update({
    where: { id: Number(params.id) },
    data: { status },
  })

  // Send SMS on confirm
  if (status === 'confirmed') {
    const smsText = getOrderConfirmedSMS(order)
    await sendSMS(order.clientPhone, smsText)
  }

  // Real-time update
  await triggerPusher(PUSHER_CHANNELS.ADMIN, PUSHER_EVENTS.ORDER_UPDATED, {
    id: order.id,
    status: order.status,
  })

  return NextResponse.json(order)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.order.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ ok: true })
}
