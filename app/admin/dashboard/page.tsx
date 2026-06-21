'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingBag, CalendarDays, CheckCircle, TrendingUp,
  Clock, Table as TableIcon,
} from 'lucide-react'

interface Stats {
  pendingOrders: number
  pendingBookings: number
  confirmedToday: number
  revenueToday: number
  recentOrders: Array<{
    id: number
    tableNumber: string
    totalAmount: number
    status: string
    createdAt: string
    items: Array<{ quantity: number; menuItem: { name_ru: string } }>
  }>
  recentBookings: Array<{
    id: number
    name: string
    zone: string
    date: string
    time: string
    status: string
    createdAt: string
  }>
}

const statusColors: Record<string, string> = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  preparing: 'badge-preparing',
  ready: 'badge-ready',
  cancelled: 'badge-cancelled',
}

const statusLabels: Record<string, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждён',
  preparing: 'Готовится',
  ready: 'Готов',
  cancelled: 'Отменён',
}

const zoneLabels: Record<string, string> = {
  main: 'Основной зал',
  vip: 'VIP',
  terrace: 'Терраса',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'только что'
  if (mins < 60) return `${mins} мин назад`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} ч назад`
  return `${Math.floor(hrs / 24)} д назад`
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = () =>
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false))

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const cards = stats
    ? [
        {
          label: 'Новых заказов',
          value: stats.pendingOrders,
          icon: ShoppingBag,
          color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-800',
        },
        {
          label: 'Новых бронирований',
          value: stats.pendingBookings,
          icon: CalendarDays,
          color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-800',
        },
        {
          label: 'Выполнено сегодня',
          value: stats.confirmedToday,
          icon: CheckCircle,
          color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
          border: 'border-green-200 dark:border-green-800',
        },
        {
          label: 'Выручка сегодня',
          value: new Intl.NumberFormat('ru-RU').format(stats.revenueToday) + ' м.',
          icon: TrendingUp,
          color: 'bg-sage-50 dark:bg-sage-800/40 text-sage-600 dark:text-sage-300',
          border: 'border-sage-200 dark:border-sage-700',
        },
      ]
    : []

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-playfair text-2xl font-semibold text-sage-800 dark:text-cream-100">
          Дашборд
        </h1>
        <p className="text-sage-500 dark:text-sage-400 text-sm mt-1">
          Обновляется каждые 10 секунд
        </p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card h-28 animate-pulse bg-cream-200 dark:bg-sage-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`card p-5 border ${card.border}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-sage-800 dark:text-cream-100">{card.value}</p>
                <p className="text-xs text-sage-500 dark:text-sage-400 mt-0.5">{card.label}</p>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Recent activity */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent orders */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-4 h-4 text-sage-500" />
              <h2 className="font-semibold text-sage-800 dark:text-cream-100">
                Последние заказы
              </h2>
            </div>
            <div className="space-y-3">
              {stats.recentOrders.length === 0 && (
                <p className="text-sage-400 text-sm">Заказов пока нет</p>
              )}
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-start justify-between gap-3 py-3 border-b border-cream-100 dark:border-sage-800 last:border-0"
                >
                  <div className="flex items-start gap-2">
                    <TableIcon className="w-4 h-4 text-sage-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-sage-800 dark:text-cream-100">
                        Стол {order.tableNumber} · #{order.id}
                      </p>
                      <p className="text-xs text-sage-400">
                        {order.items.map((i) => `${i.menuItem.name_ru} ×${i.quantity}`).join(', ')}
                      </p>
                      <p className="text-xs text-sage-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {timeAgo(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] ?? ''}`}>
                      {statusLabels[order.status] ?? order.status}
                    </span>
                    <span className="text-xs text-sage-500">
                      {new Intl.NumberFormat('ru-RU').format(order.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent bookings */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-4 h-4 text-sage-500" />
              <h2 className="font-semibold text-sage-800 dark:text-cream-100">
                Последние бронирования
              </h2>
            </div>
            <div className="space-y-3">
              {stats.recentBookings.length === 0 && (
                <p className="text-sage-400 text-sm">Бронирований пока нет</p>
              )}
              {stats.recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-start justify-between gap-3 py-3 border-b border-cream-100 dark:border-sage-800 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-sage-800 dark:text-cream-100">
                      {b.name || 'Гость'} · #{b.id}
                    </p>
                    <p className="text-xs text-sage-400">
                      {zoneLabels[b.zone] ?? b.zone} · {b.date} {b.time}
                    </p>
                    <p className="text-xs text-sage-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {timeAgo(b.createdAt)}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium self-start ${statusColors[b.status] ?? ''}`}>
                    {statusLabels[b.status] ?? b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
