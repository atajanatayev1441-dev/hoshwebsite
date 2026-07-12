// Kitchen hours — orders only accepted 9:00–22:00 Turkmenistan time,
// regardless of what timezone the server or the visitor's browser is in.
const TIMEZONE = 'Asia/Ashgabat'
const OPEN_HOUR = 9
const CLOSE_HOUR = 22

export function isOrderingOpen(date: Date = new Date()): boolean {
  // Manual override (e.g. holiday closure, testing) — set FORCE_KITCHEN_STATUS
  // to "closed" or "open" on Railway to bypass the clock entirely.
  if (process.env.FORCE_KITCHEN_STATUS === 'closed') return false
  if (process.env.FORCE_KITCHEN_STATUS === 'open') return true

  const hour = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: TIMEZONE, hourCycle: 'h23', hour: 'numeric' }).format(date)
  )
  return hour >= OPEN_HOUR && hour < CLOSE_HOUR
}

export const orderingClosedMessage = {
  ru: 'Кухня не работает. Заказы принимаются с 9:00 до 22:00.',
  tk: 'Aşhana işlemeýär. Sargytlar 9:00-dan 22:00-a çenli kabul edilýär.',
}
