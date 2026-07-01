export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTelegram, sendWithKeyboard, editTelegramMessage, answerCallback } from '@/lib/telegram'

type Booking = {
  id: number; name: string; phone: string; date: string; time: string
  zone: string; guestCount: number; status: string; note: string | null
  venue: string; arrived: boolean | null
}

function fmtBooking(b: Booking) {
  const zone    = b.zone === 'vip' ? 'VIP' : 'Осн. зал'
  const venue   = b.venue === 'coffee' ? '☕ Coffee' : '🥃 Lounge'
  const status  = b.status === 'confirmed' ? '✅' : b.status === 'cancelled' ? '❌' : '⏳'
  const arrived = b.arrived === true ? ' · 🟢 пришли' : b.arrived === false ? ' · 🔴 не пришли' : ''
  return `${status} <b>#${b.id}</b> ${venue}\n` +
    `👤 ${b.name || '—'}  📞 ${b.phone}\n` +
    `📅 ${b.date} ${b.time} · ${zone} · ${b.guestCount} чел.${arrived}`
}

async function handleUpcoming() {
  const today = new Date().toISOString().split('T')[0]
  const bookings = await prisma.booking.findMany({
    where: { date: { gte: today }, status: { not: 'cancelled' } },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
    take: 15,
  })
  if (!bookings.length) {
    await sendTelegram('📅 Нет предстоящих бронирований')
    return
  }
  await sendTelegram(`📅 <b>Ближайшие брони (${bookings.length})</b>`)
  for (const b of bookings) {
    const booking = b as Booking
    // confirmed + arrival not yet marked → show arrived buttons
    const buttons = booking.status === 'confirmed' && booking.arrived === null
      ? [[
          { text: '🟢 Пришли',    callback_data: `vis_yes_${booking.id}` },
          { text: '🔴 Не пришли', callback_data: `vis_no_${booking.id}`  },
        ]]
      : undefined
    await sendTelegram(fmtBooking(booking), buttons)
  }
}

async function handleHistory() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
  if (!bookings.length) {
    await sendTelegram('📋 История пуста')
    return
  }
  const lines = bookings.map(b => fmtBooking(b as Booking)).join('\n\n')
  await sendTelegram(`📋 <b>Последние 10 броней</b>\n\n${lines}`)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  /* ── Callback query (button press) ── */
  const cq = body.callback_query
  if (cq) {
    const { id: callbackId, data, message } = cq
    const chatId: number    = message?.chat?.id
    const messageId: number = message?.message_id

    await answerCallback(callbackId)

    /* Подтвердить / Отклонить бронь */
    if (data?.startsWith('book_')) {
      const [, action, rawId] = data.split('_')
      const bookingId  = parseInt(rawId)
      const newStatus  = action === 'ok' ? 'confirmed' : 'cancelled'
      const booking    = await prisma.booking.update({ where: { id: bookingId }, data: { status: newStatus } })
      const icon       = newStatus === 'confirmed' ? '✅' : '❌'
      const label      = newStatus === 'confirmed' ? 'ПОДТВЕРЖДЕНО' : 'ОТКЛОНЕНО'
      const zoneLabel  = booking.zone === 'vip' ? 'VIP зона' : 'Основной зал'
      const venueLabel = booking.venue === 'coffee' ? 'HOŞ Coffee' : 'HOŞ Lounge'
      const text =
        `${icon} <b>Бронирование ${label}</b> — ${venueLabel}\n\n` +
        `👤 ${booking.name || '—'}\n` +
        `📞 ${booking.phone}\n` +
        `📅 ${booking.date} в ${booking.time}\n` +
        `🏛 ${zoneLabel} · ${booking.guestCount} гост.` +
        (booking.note ? `\n💬 ${booking.note}` : '')
      await editTelegramMessage(chatId, messageId, text)
    }

    /* Принять / Отклонить заказ */
    if (data?.startsWith('order_')) {
      const [, action, rawId] = data.split('_')
      const orderId   = parseInt(rawId)
      const newStatus = action === 'ok' ? 'confirmed' : 'cancelled'
      const order     = await prisma.order.update({ where: { id: orderId }, data: { status: newStatus } })
      const icon  = newStatus === 'confirmed' ? '✅' : '❌'
      const label = newStatus === 'confirmed' ? 'ПРИНЯТ' : 'ОТКЛОНЁН'
      await editTelegramMessage(chatId, messageId,
        `${icon} <b>Заказ №${order.id} ${label}</b>\n\n` +
        `📞 ${order.clientPhone}\n🪑 Стол ${order.tableNumber}\n💰 ${order.totalAmount} м.`
      )
    }

    /* Пришли / Не пришли */
    if (data?.startsWith('vis_')) {
      const [, result, rawId] = data.split('_')
      const bookingId = parseInt(rawId)
      const arrived   = result === 'yes'
      const booking   = await prisma.booking.update({ where: { id: bookingId }, data: { arrived } })
      const zoneLabel  = booking.zone === 'vip' ? 'VIP зона' : 'Основной зал'
      const venueLabel = booking.venue === 'coffee' ? 'HOŞ Coffee' : 'HOŞ Lounge'
      const arrivedLabel = arrived ? '🟢 ГОСТИ ПРИШЛИ' : '🔴 ГОСТИ НЕ ПРИШЛИ'
      await editTelegramMessage(chatId, messageId,
        `✅ <b>Бронирование ПОДТВЕРЖДЕНО</b> — ${venueLabel}\n\n` +
        `👤 ${booking.name || '—'}\n` +
        `📞 ${booking.phone}\n` +
        `📅 ${booking.date} в ${booking.time}\n` +
        `🏛 ${zoneLabel} · ${booking.guestCount} гост.\n\n` +
        `${arrivedLabel}`
      )
    }

    /* Команды через кнопки */
    if (data === 'cmd_upcoming') await handleUpcoming()
    if (data === 'cmd_history')  await handleHistory()

    return NextResponse.json({ ok: true })
  }

  /* ── Текстовые команды ── */
  const msg = body.message
  if (msg) {
    const text: string = msg.text || ''

    if (text === '/start' || text === '/menu') {
      await sendWithKeyboard('👋 <b>HOŞ Admin Bot</b>\n\nКнопки появились внизу 👇')
    }
    if (text === '📅 Ближайшие брони' || text === '/upcoming') await handleUpcoming()
    if (text === '📋 История'         || text === '/history')  await handleHistory()
  }

  return NextResponse.json({ ok: true })
}
