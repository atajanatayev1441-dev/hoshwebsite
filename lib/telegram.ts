import { prisma } from './prisma'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

// Fixed super-admin identity — always has bot access and can never be
// removed via /resetworkers or "🗑 Сбросить всех", unlike everyone in the
// TelegramWorker table. Override via env var only if this ID ever needs to
// change; the value the owner gave us is the default.
export const SUPER_ADMIN_ID = process.env.TELEGRAM_SUPER_ADMIN_ID || '1824836551'
const SUPER_ADMIN_LABEL = 'Супер Админ'

type InlineButton = { text: string; callback_data: string }
export type SentMessage = { chatId: number; messageId: number }

// Every chat that should receive order/booking broadcasts: all registered
// workers plus the super admin. Source of truth moved from the old static
// TELEGRAM_CHAT_ID/_2/_3 env vars to this DB-backed registry so it can be
// managed live from inside the bot.
async function getChatIds(): Promise<string[]> {
  const workers = await prisma.telegramWorker.findMany({ select: { telegramId: true } })
  const ids = new Set(workers.map((w) => w.telegramId))
  ids.add(SUPER_ADMIN_ID)
  return Array.from(ids)
}

export async function getWorkerLabel(telegramId: string | number): Promise<string> {
  const id = String(telegramId)
  if (id === SUPER_ADMIN_ID) return SUPER_ADMIN_LABEL
  const worker = await prisma.telegramWorker.findUnique({ where: { telegramId: id } })
  return worker?.label ?? `Неизвестный (${id})`
}

/* ── Broadcast to every registered chat ── */

export async function sendTelegram(
  text: string,
  inlineButtons?: InlineButton[][]
): Promise<void> {
  if (!BOT_TOKEN) return
  const chatIds = await getChatIds()
  await Promise.all(chatIds.map(async (chatId) => {
    try {
      const body: Record<string, unknown> = { chat_id: chatId, text, parse_mode: 'HTML' }
      if (inlineButtons) body.reply_markup = { inline_keyboard: inlineButtons }
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch {}
  }))
}

// Same as sendTelegram, but returns the {chatId, messageId} of every copy
// sent — save this on the Order/Booking row so a later callback (accept,
// reject, mark sent) can update every worker's copy at once.
export async function broadcastActionable(
  text: string,
  inlineButtons?: InlineButton[][]
): Promise<SentMessage[]> {
  if (!BOT_TOKEN) return []
  const chatIds = await getChatIds()
  const results = await Promise.all(chatIds.map(async (chatId): Promise<SentMessage | null> => {
    try {
      const body: Record<string, unknown> = { chat_id: chatId, text, parse_mode: 'HTML' }
      if (inlineButtons) body.reply_markup = { inline_keyboard: inlineButtons }
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.ok) return { chatId: Number(chatId), messageId: data.result.message_id }
    } catch {}
    return null
  }))
  return results.filter((r): r is SentMessage => r !== null)
}

// Edits every previously-broadcast copy of a message (e.g. all workers'
// "new order" notification) so accepting/rejecting/marking-sent in one chat
// is reflected everywhere instead of leaving stale buttons elsewhere.
export async function editAllMessages(
  messages: SentMessage[] | null | undefined,
  text: string,
  buttons?: InlineButton[][]
): Promise<void> {
  if (!messages?.length) return
  await Promise.all(messages.map((m) => editTelegramMessage(m.chatId, m.messageId, text, buttons)))
}

/* ── Single-chat sends (used for role-specific replies / admin flows) ── */

export async function sendTelegramTo(
  chatId: string | number,
  text: string,
  inlineButtons?: InlineButton[][]
): Promise<void> {
  if (!BOT_TOKEN) return
  try {
    const body: Record<string, unknown> = { chat_id: chatId, text, parse_mode: 'HTML' }
    if (inlineButtons) body.reply_markup = { inline_keyboard: inlineButtons }
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {}
}

const BASE_KEYBOARD = [
  [{ text: '📅 Ближайшие брони' }, { text: '🛒 Заказы сегодня' }],
  [{ text: '📦 Активные заказы' }, { text: '📊 Статистика' }],
  [{ text: '📋 История' }, { text: '🔍 Поиск' }],
]
const ADMIN_KEYBOARD_ROWS = [
  [{ text: '➕ Добавить работника' }, { text: '👥 Работники' }],
  [{ text: '🗑 Сбросить всех' }],
]

export async function sendWithKeyboard(text: string): Promise<void> {
  if (!BOT_TOKEN) return
  const chatIds = await getChatIds()
  await Promise.all(chatIds.map((chatId) => sendKeyboardTo(chatId, text, chatId === SUPER_ADMIN_ID)))
}

// Sends the persistent reply keyboard to exactly one chat, with the admin
// rows (add worker / list / reset) included only for the super admin.
export async function sendKeyboardTo(
  chatId: string | number,
  text: string,
  isSuperAdmin: boolean
): Promise<void> {
  if (!BOT_TOKEN) return
  const keyboard = isSuperAdmin ? [...BASE_KEYBOARD, ...ADMIN_KEYBOARD_ROWS] : BASE_KEYBOARD
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: { keyboard, resize_keyboard: true, persistent: true },
      }),
    })
  } catch {}
}

export async function editTelegramMessage(
  chatId: number,
  messageId: number,
  text: string,
  buttons?: InlineButton[][]
): Promise<void> {
  if (!BOT_TOKEN) return
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: buttons ?? [] },
      }),
    })
  } catch {}
}

export async function answerCallback(callbackQueryId: string, text?: string): Promise<void> {
  if (!BOT_TOKEN) return
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text, show_alert: !!text }),
    })
  } catch {}
}
