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

function todayBounds() {
  const start = new Date(); start.setHours(0, 0, 0, 0)
  const end   = new Date(); end.setHours(23, 59, 59, 999)
  return { start, end }
}

/* ── Handlers ── */

async function handleUpcoming() {
  const today = new Date().toISOString().split('T')[0]
  const bookings = await prisma.booking.findMany({
    where: { date: { gte: today }, status: { not: 'cancelled' } },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
    take: 15,
  })
  if (!bookings.length) { await sendTelegram('📅 Нет предстоящих бронирований'); return }
  await sendTelegram(`📅 <b>Ближайшие брони (${bookings.length})</b>`)
  for (const b of bookings) {
    const booking = b as Booking
    const buttons: { text: string; callback_data: string }[][] = []
    if (booking.status === 'confirmed' && booking.arrived === null) {
      buttons.push([
        { text: '🟢 Пришли',    callback_data: `vis_yes_${booking.id}` },
        { text: '🔴 Не пришли', callback_data: `vis_no_${booking.id}`  },
      ])
    }
    if (booking.status !== 'cancelled') {
      buttons.push([{ text: '❌ Отменить', callback_data: `cancel_${booking.id}` }])
    }
    await sendTelegram(fmtBooking(booking), buttons.length ? buttons : undefined)
  }
}

async function handleHistory() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
  if (!bookings.length) { await sendTelegram('📋 История пуста'); return }
  const lines = bookings.map(b => fmtBooking(b as Booking)).join('\n\n')
  await sendTelegram(`📋 <b>Последние 10 броней</b>\n\n${lines}`)
}

async function handleStats() {
  const today = new Date().toISOString().split('T')[0]
  const { start, end } = todayBounds()

  const [bAll, bConfirmed, bPending, bCancelled, orders, revenue] = await Promise.all([
    prisma.booking.count({ where: { date: today } }),
    prisma.booking.count({ where: { date: today, status: 'confirmed' } }),
    prisma.booking.count({ where: { date: today, status: 'pending' } }),
    prisma.booking.count({ where: { date: today, status: 'cancelled' } }),
    prisma.order.count({ where: { createdAt: { gte: start, lte: end } } }),
    prisma.order.aggregate({ where: { createdAt: { gte: start, lte: end }, status: { not: 'cancelled' } }, _sum: { totalAmount: true } }),
  ])

  await sendTelegram(
    `📊 <b>Статистика на сегодня</b>\n\n` +
    `🪑 <b>Бронирования</b>\n` +
    `  Всего: ${bAll}\n` +
    `  ✅ Подтверждено: ${bConfirmed}\n` +
    `  ⏳ Ожидают: ${bPending}\n` +
    `  ❌ Отменено: ${bCancelled}\n\n` +
    `🛒 <b>Заказы</b>\n` +
    `  Количество: ${orders}\n` +
    `  💰 Выручка: ${revenue._sum.totalAmount?.toFixed(0) ?? 0} м.`
  )
}

async function handleOrdersToday() {
  const { start, end } = todayBounds()
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start, lte: end } },
    include: { items: { include: { menuItem: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  if (!orders.length) { await sendTelegram('🛒 Заказов сегодня нет'); return }
  await sendTelegram(`🛒 <b>Заказы сегодня (${orders.length})</b>`)
  for (const o of orders) {
    const status = o.status === 'confirmed' ? '✅' : o.status === 'cancelled' ? '❌' : o.status === 'ready' ? '🟢' : '⏳'
    const lines  = o.items.map(i => `  • ${i.menuItem?.name_ru ?? '?'} × ${i.quantity}`).join('\n')
    await sendTelegram(
      `${status} <b>Заказ №${o.id}</b>\n` +
      `📞 ${o.clientPhone} · Стол ${o.tableNumber}\n` +
      `${lines}\n💰 ${o.totalAmount} м.`
    )
  }
}

async function handleSearch(query: string) {
  const q = query.trim()
  if (!q) { await sendTelegram('Введите имя или номер телефона после /поиск'); return }
  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { name:  { contains: q, mode: 'insensitive' } },
        { phone: { contains: q } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
  if (!bookings.length) {
    await sendTelegram(`🔍 Ничего не найдено по запросу "<b>${q}</b>"`)
    return
  }
  const lines = bookings.map(b => fmtBooking(b as Booking)).join('\n\n')
  await sendTelegram(`🔍 <b>Результаты (${bookings.length})</b>\n\n${lines}`)
}

/* ── Main handler ── */

export async function POST(req: NextRequest) {
  const body = await req.json()

  /* Callback query */
  const cq = body.callback_query
  if (cq) {
    const { id: callbackId, data, message } = cq
    const chatId: number    = message?.chat?.id
    const messageId: number = message?.message_id
    await answerCallback(callbackId)

    /* Подтвердить / Отклонить бронь */
    if (data?.startsWith('book_')) {
      const [, action, rawId] = data.split('_')
      const newStatus  = action === 'ok' ? 'confirmed' : 'cancelled'
      const booking    = await prisma.booking.update({ where: { id: parseInt(rawId) }, data: { status: newStatus } })
      const icon       = newStatus === 'confirmed' ? '✅' : '❌'
      const label      = newStatus === 'confirmed' ? 'ПОДТВЕРЖДЕНО' : 'ОТКЛОНЕНО'
      const zoneLabel  = booking.zone === 'vip' ? 'VIP зона' : 'Основной зал'
      const venueLabel = booking.venue === 'coffee' ? 'HOŞ Coffee' : 'HOŞ Lounge'
      await editTelegramMessage(chatId, messageId,
        `${icon} <b>Бронирование ${label}</b> — ${venueLabel}\n\n` +
        `👤 ${booking.name || '—'}\n📞 ${booking.phone}\n` +
        `📅 ${booking.date} в ${booking.time}\n` +
        `🏛 ${zoneLabel} · ${booking.guestCount} гост.` +
        (booking.note ? `\n💬 ${booking.note}` : '')
      )
    }

    /* Принять / Отклонить заказ */
    if (data?.startsWith('order_')) {
      const [, action, rawId] = data.split('_')
      const newStatus = action === 'ok' ? 'confirmed' : 'cancelled'
      const order     = await prisma.order.update({ where: { id: parseInt(rawId) }, data: { status: newStatus } })
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
      const arrived  = result === 'yes'
      const booking  = await prisma.booking.update({ where: { id: parseInt(rawId) }, data: { arrived } })
      const venueLabel = booking.venue === 'coffee' ? 'HOŞ Coffee' : 'HOŞ Lounge'
      const zoneLabel  = booking.zone === 'vip' ? 'VIP зона' : 'Основной зал'
      await editTelegramMessage(chatId, messageId,
        `✅ <b>Бронирование ПОДТВЕРЖДЕНО</b> — ${venueLabel}\n\n` +
        `👤 ${booking.name || '—'}\n📞 ${booking.phone}\n` +
        `📅 ${booking.date} в ${booking.time}\n` +
        `🏛 ${zoneLabel} · ${booking.guestCount} гост.\n\n` +
        (arrived ? '🟢 ГОСТИ ПРИШЛИ' : '🔴 ГОСТИ НЕ ПРИШЛИ')
      )
    }

    /* Отменить бронь */
    if (data?.startsWith('cancel_')) {
      const bookingId = parseInt(data.split('_')[1])
      const booking   = await prisma.booking.update({ where: { id: bookingId }, data: { status: 'cancelled' } })
      const venueLabel = booking.venue === 'coffee' ? 'HOŞ Coffee' : 'HOŞ Lounge'
      await editTelegramMessage(chatId, messageId,
        `❌ <b>Бронирование ОТМЕНЕНО</b> — ${venueLabel}\n\n` +
        `👤 ${booking.name || '—'}\n📞 ${booking.phone}\n` +
        `📅 ${booking.date} в ${booking.time}`
      )
    }

    return NextResponse.json({ ok: true })
  }

  /* Текстовые сообщения */
  const msg = body.message
  if (msg) {
    const text: string = (msg.text || '').trim()

    if (text === '/start')              await sendWithKeyboard('👋 <b>HOŞ Admin Bot</b>\n\nКнопки появились внизу 👇')
    else if (text === '📅 Ближайшие брони')  await handleUpcoming()
    else if (text === '📋 История')          await handleHistory()
    else if (text === '📊 Статистика')       await handleStats()
    else if (text === '🛒 Заказы сегодня')   await handleOrdersToday()
    else if (text === '🔍 Поиск')            await sendTelegram('🔍 Введите: <code>/поиск Иван</code> или <code>/поиск +99371...</code>')
    else if (text.startsWith('/поиск '))     await handleSearch(text.slice(7))
    else if (text.startsWith('/search '))    await handleSearch(text.slice(8))
    else if (text.startsWith('/п '))         await handleSearch(text.slice(3))
    else if (!text.startsWith('/'))          await handleSearch(text)
  }

  return NextResponse.json({ ok: true })
}
