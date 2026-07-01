const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID

type InlineButton = { text: string; callback_data: string }

export async function sendTelegram(
  text: string,
  buttons?: InlineButton[][]
): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) return
  try {
    const body: Record<string, unknown> = { chat_id: CHAT_ID, text, parse_mode: 'HTML' }
    if (buttons) body.reply_markup = { inline_keyboard: buttons }
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
