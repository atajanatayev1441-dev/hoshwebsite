import type { Booking, Order } from '@prisma/client'

// SMS Templates
export const SMS_TEMPLATES = {
  orderConfirmed: {
    ru: (id: number) =>
      `HOŞ Coffee Lounge: Ваш заказ №${id} принят! Будет готов в течение 20–30 минут. Спасибо, что выбрали нас!`,
    tk: (id: number) =>
      `HOŞ Coffee Lounge: Siziň ${id}-nji siparişiňiz kabul edildi! 20–30 minutda taýýar bolar. Bizi saýlanyňyz üçin sag boluň!`,
  },
  bookingConfirmed: {
    ru: (b: Pick<Booking, 'zone' | 'date' | 'time' | 'guestCount'>) => {
      const zoneNames: Record<string, string> = {
        main: 'Основной зал',
        vip: 'VIP зона',
        terrace: 'Терраса',
      }
      return `HOŞ Coffee Lounge: Ваш столик забронирован! ${zoneNames[b.zone] ?? b.zone}, ${b.date} в ${b.time}, на ${b.guestCount} гостей. Ждём вас!`
    },
    tk: (b: Pick<Booking, 'zone' | 'date' | 'time' | 'guestCount'>) => {
      const zoneNames: Record<string, string> = {
        main: 'Esasy zal',
        vip: 'VIP zona',
        terrace: 'Taras',
      }
      return `HOŞ Coffee Lounge: Siziň stolyňyz bronlandi! ${zoneNames[b.zone] ?? b.zone}, ${b.date} sagat ${b.time}-da, ${b.guestCount} myhmana. Sizi garaşýarys!`
    },
  },
  bookingCancelled: {
    ru: () =>
      `HOŞ Coffee Lounge: К сожалению, на выбранное время столик недоступен. Пожалуйста, позвоните нам: +99361XXXXXX`,
    tk: () =>
      `HOŞ Coffee Lounge: Gynansak-da, saýlanan wagt üçin stol ýok. Bize jaň ediň: +99361XXXXXX`,
  },
}

async function sendViaTwilio(to: string, body: string): Promise<void> {
  const twilio = await import('twilio')
  const client = twilio.default(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )
  await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
  })
}

async function sendViaEskiz(to: string, body: string): Promise<void> {
  // Eskiz.uz authentication and message sending
  const tokenRes = await fetch('https://notify.eskiz.uz/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.ESKIZ_EMAIL,
      password: process.env.ESKIZ_PASSWORD,
    }),
  })
  const tokenData = await tokenRes.json()
  const token = tokenData?.data?.token
  if (!token) throw new Error('Eskiz auth failed')

  await fetch('https://notify.eskiz.uz/api/message/sms/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mobile_phone: to.replace('+', ''),
      message: body,
      from: '4546',
    }),
  })
}

export async function sendSMS(to: string, body: string): Promise<void> {
  const provider = process.env.SMS_PROVIDER ?? 'twilio'
  try {
    if (provider === 'eskiz') {
      await sendViaEskiz(to, body)
    } else {
      await sendViaTwilio(to, body)
    }
    console.log(`SMS sent to ${to} via ${provider}`)
  } catch (err) {
    console.error(`SMS send failed (${provider}):`, err)
    // Don't throw — SMS failure should not break the order/booking flow
  }
}

export function getOrderConfirmedSMS(order: Pick<Order, 'id' | 'clientLang'>): string {
  const lang = (order.clientLang as 'ru' | 'tk') ?? 'ru'
  return SMS_TEMPLATES.orderConfirmed[lang](order.id)
}

export function getBookingConfirmedSMS(
  booking: Pick<Booking, 'id' | 'zone' | 'date' | 'time' | 'guestCount' | 'clientLang'>
): string {
  const lang = (booking.clientLang as 'ru' | 'tk') ?? 'ru'
  return SMS_TEMPLATES.bookingConfirmed[lang](booking)
}

export function getBookingCancelledSMS(
  booking: Pick<Booking, 'clientLang'>
): string {
  const lang = (booking.clientLang as 'ru' | 'tk') ?? 'ru'
  return SMS_TEMPLATES.bookingCancelled[lang]()
}
