'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Clock, Table as TableIcon, ChevronDown, RefreshCw } from 'lucide-react'

interface OrderItem {
  id: number
  quantity: number
  price: number
  menuItem: { name_ru: string; name_tk: string }
}

interface Order {
  id: number
  tableNumber: string
  clientPhone: string
  clientLang: string
  status: string
  totalAmount: number
  createdAt: string
  items: OrderItem[]
}

const TABS = [
  { key: 'all', label: 'Все' },
  { key: 'pending', label: 'Ожидают' },
  { key: 'active', label: 'Активные' },
  { key: 'done', label: 'Завершённые' },
]

const STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждён',
  preparing: 'Готовится',
  ready: 'Готов',
  cancelled: 'Отменён',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  preparing: 'badge-preparing',
  ready: 'badge-ready',
  cancelled: 'badge-cancelled',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'только что'
  if (mins < 60) return `${mins} мин`
  return `${Math.floor(mins / 60)} ч ${mins % 60} мин`
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [updating, setUpdating] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const fetchOrders = useCallback(() =>
    fetch('/api/orders')
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false)), [])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 8000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id)
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      )
    } finally {
      setUpdating(null)
    }
  }

  const filtered = orders.filter((o) => {
    if (tab === 'pending') return o.status === 'pending'
    if (tab === 'active') return ['confirmed', 'preparing'].includes(o.status)
    if (tab === 'done') return ['ready', 'cancelled'].includes(o.status)
    return true
  })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-semibold text-sage-800 dark:text-cream-100">
            Заказы
          </h1>
          <p className="text-sm text-sage-500 dark:text-sage-400 mt-0.5">
            {orders.filter((o) => o.status === 'pending').length} ожидают подтверждения
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchOrders() }}
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
                : 'text-sage-500 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-200'
            }`}
          >
            {t.label}
            {t.key === 'pending' && orders.filter((o) => o.status === 'pending').length > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {orders.filter((o) => o.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card h-24 animate-pulse bg-cream-200 dark:bg-sage-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sage-400">
          <p className="text-sm">Заказов нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="card overflow-hidden"
              >
                {/* Order header row */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-cream-50 dark:hover:bg-sage-800/50 transition-colors"
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sage-800 dark:text-cream-100 text-sm">
                        #{order.id}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-sage-500 dark:text-sage-400">
                      <span className="flex items-center gap-1">
                        <TableIcon className="w-3 h-3" />
                        Стол {order.tableNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {order.clientPhone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(order.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sage-700 dark:text-sage-200 text-sm">
                      {new Intl.NumberFormat('ru-RU').format(order.totalAmount)} м.
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-sage-400 transition-transform ${expandedId === order.id ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {expandedId === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-cream-100 dark:border-sage-800 pt-3">
                        {/* Items */}
                        <div className="space-y-1.5 mb-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-sage-700 dark:text-sage-200">
                                {item.menuItem.name_ru}
                                <span className="text-sage-400 ml-1.5">× {item.quantity}</span>
                              </span>
                              <span className="text-sage-500">
                                {new Intl.NumberFormat('ru-RU').format(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Action buttons */}
                        {order.status !== 'ready' && order.status !== 'cancelled' && (
                          <div className="flex flex-wrap gap-2">
                            {order.status === 'pending' && (
                              <>
                                <button
                                  disabled={updating === order.id}
                                  onClick={() => updateStatus(order.id, 'confirmed')}
                                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                  Подтвердить
                                </button>
                                <button
                                  disabled={updating === order.id}
                                  onClick={() => updateStatus(order.id, 'cancelled')}
                                  className="px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 text-red-600 dark:text-red-400 text-sm rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                  Отменить
                                </button>
                              </>
                            )}
                            {order.status === 'confirmed' && (
                              <button
                                disabled={updating === order.id}
                                onClick={() => updateStatus(order.id, 'preparing')}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg font-medium transition-colors disabled:opacity-50"
                              >
                                Готовится
                              </button>
                            )}
                            {order.status === 'preparing' && (
                              <button
                                disabled={updating === order.id}
                                onClick={() => updateStatus(order.id, 'ready')}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg font-medium transition-colors disabled:opacity-50"
                              >
                                Готов
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
