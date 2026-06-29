export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { triggerPusher, PUSHER_CHANNELS, PUSHER_EVENTS } from '@/lib/pusher'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: Number(params.id) },
    include: {
      items: {
        include: { menuItem: { select: { name_ru: true, name_tk: true } } },
      },
    },
  })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    id: order.id,
    status: order.status,
    tableNumber: order.tableNumber,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    items: order.items,
  })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { status } = await req.json()
  const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'cancelled']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const order = await prisma.order.update({
    where: { id: Number(params.id) },
    data: { status },
  })

  await triggerPusher(PUSHER_CHANNELS.ADMIN, PUSHER_EVENTS.ORDER_UPDATED, {
    id: order.id,
    status: order.status,
  })

  return NextResponse.json(order)
}
