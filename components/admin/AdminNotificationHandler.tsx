'use client'

import { useEffect, useRef, useState } from 'react'
import PusherClient from 'pusher-js'

interface AdminNotificationHandlerProps {
  onNewOrder: (data: { id: number; tableNumber: string }) => void
  onNewBooking: (data: { id: number; name: string }) => void
  onOrderUpdate: (data: { id: number; status: string }) => void
  onBookingUpdate: (data: { id: number; status: string }) => void
}

export function AdminNotificationHandler({
  onNewOrder,
  onNewBooking,
  onOrderUpdate,
  onBookingUpdate,
}: AdminNotificationHandlerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const pusherRef = useRef<PusherClient | null>(null)

  useEffect(() => {
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Audio ping
    audioRef.current = new Audio('/notification.mp3')

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER

    if (!pusherKey) {
      // Fallback: poll every 5s
      const poll = async () => {
        try {
          const res = await fetch('/api/admin/stats')
          if (res.ok) {
            // Stats refresh is handled by parent via polling
          }
        } catch { /* silent */ }
      }
      const interval = setInterval(poll, 5000)
      return () => clearInterval(interval)
    }

    pusherRef.current = new PusherClient(pusherKey, {
      cluster: pusherCluster ?? 'eu',
    })

    const channel = pusherRef.current.subscribe('admin-notifications')

    channel.bind('new-order', (data: { id: number; tableNumber: string }) => {
      onNewOrder(data)
      audioRef.current?.play().catch(() => {})
      if (Notification.permission === 'granted') {
        new Notification('HOS Coffee — Новый заказ', {
          body: `Стол ${data.tableNumber} · Заказ #${data.id}`,
          icon: '/favicon.ico',
        })
      }
    })

    channel.bind('new-booking', (data: { id: number; name: string }) => {
      onNewBooking(data)
      audioRef.current?.play().catch(() => {})
      if (Notification.permission === 'granted') {
        new Notification('HOS Coffee — Новое бронирование', {
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
