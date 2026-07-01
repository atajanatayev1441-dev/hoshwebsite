const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID
const CHAT_ID_2 = process.env.TELEGRAM_CHAT_ID_2

type InlineButton = { text: string; callback_data: string }

function getChatIds(): string[] {
  const ids: string[] = []
  if (CHAT_ID)   ids.push(CHAT_ID)
  if (CHAT_ID_2) ids.push(CHAT_ID_2)
  return ids
}

export async function sendTelegram(
  text: string,
  inlineButtons?: InlineButton[][]
): Promise<void> {
  if (!BOT_TOKEN) return
  await Promise.all(getChatIds().map(async (chatId) => {
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

export async function sendWithKeyboard(text: string): Promise<void> {
  if (!BOT_TOKEN) return
  await Promise.all(getChatIds().map(async (chatId) => {
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          reply_markup: {
            keyboard: [
              [{ text: '📅 Ближайшие брони' }, { text: '🛒 Заказы сегодня' }],
              [{ text: '📊 Статистика' },       { text: '📋 История' }],
              [{ text: '🔍 Поиск' }],
            ],
            resize_keyboard: true,
            persistent: true,
          },
        }),
      })
    } catch {}
  }))
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

export async function answerCallback(callbackQueryId: string): Promise<void> {
  if (!BOT_TOKEN) return
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId }),
    })
  } catch {}
}
