import Pusher from 'pusher'

let pusherServer: Pusher | null = null

export function getPusherServer(): Pusher | null {
  if (!process.env.PUSHER_APP_ID) return null
  if (!pusherServer) {
    pusherServer = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    })
  }
  return pusherServer
}

export async function triggerPusher(
  channel: string,
  event: string,
  data: unknown
): Promise<void> {
  const server = getPusherServer()
  if (!server) {
    console.log('Pusher not configured, skipping trigger:', channel, event)
    return
  }
  try {
    await server.trigger(channel, event, data)
  } catch (err) {
    console.error('Pusher trigger failed:', err)
  }
}

export const PUSHER_CHANNELS = {
  ADMIN: 'admin-notifications',
}

export const PUSHER_EVENTS = {
  NEW_ORDER: 'new-order',
  ORDER_UPDATED: 'order-updated',
  NEW_BOOKING: 'new-booking',
  BOOKING_UPDATED: 'booking-updated',
}
