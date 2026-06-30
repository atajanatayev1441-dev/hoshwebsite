export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { editTelegramMessage, answerCallback } from '@/lib/telegram'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const cq = body.callback_query
  if (!cq) return NextResponse.json({ ok: true })

  const { id: callbackId, data, message } = cq
  const chatId: number = message?.chat?.id
  const messageId: number = message?.message_id

  await answerCallback(callbackId)

  if (data?.startsWith('book_')) {
    const [, action, rawId] = data.split('_')
    const bookingId = parseInt(rawId)
    const newStatus = action === 'ok' ? 'confirmed' : 'cancelled'

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    })

    const icon = newStatus === 'confirmed' ? '✅' : '❌'
    const label = newStatus === 'confirmed' ? 'ПОДТВЕРЖДЕНО' : 'ОТКЛОНЕНО'
    const zoneLabel = booking.zone === 'vip' ? 'VIP зона' : 'Основной зал'

    await editTelegramMessage(
      chatId, messageId,
      `${icon} <b>Бронирование ${label}</b>\n\n` +
      `👤 ${booking.name || '—'}\n` +
      `📞 ${booking.phone}\n` +
      `📅 ${booking.date} в ${booking.time}\n` +
      `🏛 ${zoneLabel} · ${booking.guestCount} гост.` +
      (booking.note ? `\n💬 ${booking.note}` : '')
    )
  }

  if (data?.startsWith('order_')) {
    const [, action, rawId] = data.split('_')
    const orderId = parseInt(rawId)
    const newStatus = action === 'ok' ? 'confirmed' : 'cancelled'

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    })

    const icon = newStatus === 'confirmed' ? '✅' : '❌'
    const label = newStatus === 'confirmed' ? 'ПРИНЯТ' : 'ОТКЛОНЁН'

    await editTelegramMessage(
      chatId, messageId,
      `${icon} <b>Заказ №${order.id} ${label}</b>\n\n` +
      `📞 ${order.clientPhone}\n` +
      `🪑 Стол ${order.tableNumber}\n` +
      `💰 Итого: ${order.totalAmount} м.`
    )
  }

  return NextResponse.json({ ok: true })
}
