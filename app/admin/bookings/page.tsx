'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Clock, Users, MapPin, StickyNote, RefreshCw } from 'lucide-react'

interface Booking {
  id: number
  zone: string
  date: string
  time: string
  guestCount: number
  name: string
  phone: string
  clientLang: string
  note: string | null
  status: string
  createdAt: string
}

const TABS = [
  { key: 'upcoming', label: 'Предстоящие' },
  { key: 'pending', label: 'Ожидают' },
  { key: 'all', label: 'Все' },
]

const STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждено',
  cancelled: 'Отменено',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
}

const ZONE_LABELS: Record<string, string> = {
  main: 'Основной зал',
  vip: 'VIP Зона',
  terrace: 'Терраса',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('upcoming')
  const [updating, setUpdating] = useState<number | null>(null)

  const fetchBookings = useCallback(() =>
    fetch('/api/bookings')
      .then((r) => r.json())
      .then(setBookings)
      .finally(() => setLoading(false)), [])

  useEffect(() => {
    fetchBookings()
    const interval = setInterval(fetchBookings, 10000)
    return () => clearInterval(interval)
  }, [fetchBookings])

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id)
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      )
    } finally {
      setUpdating(null)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  const filtered = bookings.filter((b) => {
    if (tab === 'pending') return b.status === 'pending'
    if (tab === 'upcoming') return b.date >= today && b.status !== 'cancelled'
    return true
  })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-semibold text-sage-800 dark:text-cream-100">
            Бронирования
          </h1>
          <p className="text-sm text-sage-500 dark:text-sage-400 mt-0.5">
            {bookings.filter((b) => b.status === 'pending').length} ожидают подтверждения
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchBookings() }}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-cream-300 dark:border-sage-700 text-sage-500 hover:bg-cream-100 dark:hover:bg-sage-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-cream-200 dark:bg-sage-800 p-1 rounded-xl mb-6 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-carbon-700 text-cream-100 shadow-sm'
                : 'text-sage-500 dark:text-sage-400 hover:text-sage-700'
            }`}
          >
            {t.label}
            {t.key === 'pending' && bookings.filter((b) => b.status === 'pending').length > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {bookings.filter((b) => b.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card h-28 animate-pulse bg-cream-200 dark:bg-sage-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sage-400 text-sm">
          Бронирований нет
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((booking) => (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="card p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sage-800 dark:text-cream-100 text-sm">
                        {booking.name || 'Гость'} · #{booking.id}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[booking.status]}`}>
                        {STATUS_LABELS[booking.status]}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-sage-500 dark:text-sage-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {ZONE_LABELS[booking.zone] ?? booking.zone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.date} · {booking.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {booking.guestCount} гостей
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {booking.phone}
                      </span>
                      {booking.note && (
                        <span className="flex items-center gap-1 col-span-2">
                          <StickyNote className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{booking.note}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status === 'pending' && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        disabled={updating === booking.id}
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        Подтвердить + SMS
                      </button>
                      <button
                        disabled={updating === booking.id}
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 text-red-600 dark:text-red-400 text-xs rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        Отменить + SMS
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
