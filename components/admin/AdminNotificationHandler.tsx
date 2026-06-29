'use client'

import { useEffect, useRef } from 'react'
import PusherClient from 'pusher-js'
import { toast } from 'sonner'

interface OrderPayload {
  id: number
  tableNumber: string
  totalAmount?: number
  itemCount?: number
  venue?: string
  createdAt?: string
}

interface BookingPayload {
  id: number
  name: string
  date?: string
  time?: string
  phone?: string
  venue?: string
  zone?: string
  createdAt?: string
}

interface AdminNotificationHandlerProps {
  onNewOrder: (data: { id: number; tableNumber: string }) => void
  onNewBooking: (data: { id: number; name: string }) => void
  onOrderUpdate: (data: { id: number; status: string }) => void
  onBookingUpdate: (data: { id: number; status: string }) => void
}

function playBeep() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  } catch {
    // AudioContext may be blocked — silently ignore
  }
}

export function AdminNotificationHandler({
  onNewOrder,
  onNewBooking,
  onOrderUpdate,
  onBookingUpdate,
}: AdminNotificationHandlerProps) {
  const pusherRef = useRef<PusherClient | null>(null)

  useEffect(() => {
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER

    if (!pusherKey) {
      // Fallback: polling is handled by parent via intervals
      return
    }

    pusherRef.current = new PusherClient(pusherKey, {
      cluster: pusherCluster ?? 'eu',
    })

    const channel = pusherRef.current.subscribe('admin-notifications')

    channel.bind('new-order', (data: OrderPayload) => {
      onNewOrder({ id: data.id, tableNumber: data.tableNumber })
      playBeep()

      const venue = data.venue === 'coffee' ? 'HOŞ Coffee' : 'HOŞ Lounge'
      toast.success(`Новый заказ #${data.id} · Стол ${data.tableNumber} · ${venue}`, {
        duration: 6000,
      })

      if (Notification.permission === 'granted') {
        new Notification(`${venue} — Новый заказ`, {
          body: `Стол ${data.tableNumber} · Заказ #${data.id}`,
          icon: '/favicon.ico',
        })
      }
    })

    channel.bind('new-booking', (data: BookingPayload) => {
      onNewBooking({ id: data.id, name: data.name })
      playBeep()

      const datePart = data.date ?? ''
      const phonePart = data.phone ? ` · ${data.phone}` : ''
      toast.success(`Новое бронирование · ${datePart}${phonePart}`, {
        duration: 6000,
      })

      if (Notification.permission === 'granted') {
        new Notification('HOŞ — Новое бронирование', {
          body: `${data.name} · #${data.id}`,
          icon: '/favicon.ico',
        })
      }
    })

    channel.bind('order-updated', (data: { id: number; status: string }) => {
      onOrderUpdate(data)
    })

    channel.bind('booking-updated', (data: { id: number; status: string }) => {
      onBookingUpdate(data)
    })

    return () => {
      pusherRef.current?.unsubscribe('admin-notifications')
      pusherRef.current?.disconnect()
    }
  }, [onNewOrder, onNewBooking, onOrderUpdate, onBookingUpdate])

  return null
}
