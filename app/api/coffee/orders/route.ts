import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { triggerPusher, PUSHER_CHANNELS, PUSHER_EVENTS } from '@/lib/pusher'

export const dynamic = 'force-dynamic'

export async function GET() {
  const orders = await prisma.order.findMany({
    where: { venue: 'coffee' },
    include: { items: { include: { menuItem: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { tableNumber, clientPhone, clientLang, items, totalAmount } = body

  if (!tableNumber || !clientPhone || !items?.length) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const order = await prisma.order.create({
    data: {
      tableNumber,
      clientPhone,
      clientLang: clientLang ?? 'ru',
      totalAmount,
      status: 'pending',
      venue: 'coffee',
      items: {
        create: items.map((i: { menuItemId: number; quantity: number; price: number }) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    },
    include: { items: { include: { menuItem: true } } },
  })

  await triggerPusher(PUSHER_CHANNELS.ADMIN, PUSHER_EVENTS.NEW_ORDER, {
    id: order.id,
    tableNumber: order.tableNumber,
    totalAmount: order.totalAmount,
    itemCount: order.items.length,
    createdAt: order.createdAt,
    venue: 'coffee',
  })

  return NextResponse.json(order, { status: 201 })
}
