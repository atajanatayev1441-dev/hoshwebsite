export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { triggerPusher, PUSHER_CHANNELS, PUSHER_EVENTS } from '@/lib/pusher'
import { sendTelegram } from '@/lib/telegram'

export async function GET() {

  const orders = await prisma.order.findMany({
    include: { items: { include: { menuItem: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { tableNumber, clientPhone, clientLang, items, totalAmount } = body

  if (!tableNumber || !clientPhone || !items?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const order = await prisma.order.create({
    data: {
      tableNumber,
      clientPhone,
      clientLang: clientLang ?? 'ru',
      totalAmount,
      status: 'pending',
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

  // Real-time notification
  await triggerPusher(PUSHER_CHANNELS.ADMIN, PUSHER_EVENTS.NEW_ORDER, {
    id: order.id,
    tableNumber: order.tableNumber,
    totalAmount: order.totalAmount,
    itemCount: order.items.length,
    venue: 'lounge',
    createdAt: order.createdAt,
  })

  const itemLines = order.items
    .map(i => `  • ${i.menuItem?.name_ru ?? '?'} × ${i.quantity}`)
    .join('\n')
  await sendTelegram(
    `🛒 <b>Новый заказ №${order.id}</b>\n\n` +
    `📞 ${order.clientPhone}\n` +
    `🪑 Стол ${order.tableNumber}\n\n` +
    `${itemLines}\n\n` +
    `💰 Итого: ${order.totalAmount} м.`,
    [[
      { text: '✅ Принять',   callback_data: `order_ok_${order.id}` },
      { text: '❌ Отклонить', callback_data: `order_no_${order.id}` },
    ]]
  )

  return NextResponse.json(order, { status: 201 })
}
