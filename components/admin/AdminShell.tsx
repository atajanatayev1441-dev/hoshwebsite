'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminNotificationHandler } from './AdminNotificationHandler'

interface AdminShellProps {
  children: React.ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const [pendingOrders, setPendingOrders] = useState(0)
  const [pendingBookings, setPendingBookings] = useState(0)

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setPendingOrders(data.pendingOrders)
        setPendingBookings(data.pendingBookings)
      }
    } catch { /* silent */ }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleNewOrder = useCallback(() => {
    setPendingOrders((n) => n + 1)
  }, [])

  const handleNewBooking = useCallback(() => {
    setPendingBookings((n) => n + 1)
  }, [])

  const handleOrderUpdate = useCallback((data: { id: number; status: string }) => {
    if (data.status !== 'pending') {
      setPendingOrders((n) => Math.max(0, n - 1))
    }
    fetchStats()
  }, [])

  const handleBookingUpdate = useCallback((data: { id: number; status: string }) => {
    if (data.status !== 'pending') {
      setPendingBookings((n) => Math.max(0, n - 1))
    }
    fetchStats()
  }, [])

  return (
    <div className="flex min-h-screen bg-sage-950">
      <AdminSidebar pendingOrders={pendingOrders} pendingBookings={pendingBookings} />
      <div className="flex-1 overflow-auto bg-slate-50 dark:bg-sage-900">
        {children}
      </div>
      <AdminNotificationHandler
        onNewOrder={handleNewOrder}
        onNewBooking={handleNewBooking}
        onOrderUpdate={handleOrderUpdate}
        onBookingUpdate={handleBookingUpdate}
      />
    </div>
  )
}
