'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, ChefHat, Bell, XCircle } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import Link from 'next/link'

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
  },
  confirmed: {
    icon: CheckCircle,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
  },
  preparing: {
    icon: ChefHat,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800',
  },
  ready: {
    icon: Bell,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
  },
}

interface OrderData {
  id: number
  status: string
  tableNumber: string
  totalAmount: number
  createdAt: string
  items: Array<{
    quantity: number
    price: number
    menuItem: { name_ru: string; name_tk: string }
  }>
}

export default function OrderStatusPage({ params }: { params: { id: string } }) {
  const { lang } = useLang()
  const tr = translations[lang]
  const [order, setOrder] = useState<OrderData | null>(null)
  const [error, setError] = useState(false)

  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}/status`)
      if (!res.ok) { setError(true); return }
      const data = await res.json()
      setOrder(data)
    } catch {
      setError(true)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000)
    return () => clearInterval(interval)
  }, [params.id])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sage-500 mb-4">{lang === 'ru' ? 'Заказ не найден' : 'Sargyt tapylmady'}</p>
          <Link href="/menu" className="btn-primary">{tr.menu}</Link>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sage-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const cfg = statusConfig[order.status as keyof typeof statusConfig] ?? statusConfig.pending
  const StatusIcon = cfg.icon

  const steps = ['pending', 'confirmed', 'preparing', 'ready']
  const currentStep = steps.indexOf(order.status)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cream-100 dark:bg-sage-950">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`card p-8 border-2 ${cfg.border} ${cfg.bg}`}
        >
          <div className="text-center mb-6">
            <motion.div
              animate={{ scale: order.status === 'ready' ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.6, repeat: order.status === 'ready' ? Infinity : 0, repeatDelay: 2 }}
              className="w-16 h-16 mx-auto mb-4 flex items-center justify-center"
            >
              <StatusIcon className={`w-16 h-16 ${cfg.color}`} />
            </motion.div>
            <h1 className="font-playfair text-2xl font-semibold text-sage-800 dark:text-cream-100 mb-1">
              {tr.orderStatus}
            </h1>
            <p className="text-sage-500 dark:text-sage-400">
              {tr.orderNumber}{order.id}
            </p>
          </div>

          {/* Progress steps */}
          {order.status !== 'cancelled' && (
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full transition-colors ${
                    i <= currentStep ? 'bg-sage-500' : 'bg-sage-200 dark:bg-sage-700'
                  }`} />
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 w-8 mx-1 transition-colors ${
                      i < currentStep ? 'bg-sage-500' : 'bg-sage-200 dark:bg-sage-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Status label */}
          <div className="text-center mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              order.status === 'pending' ? 'badge-pending' :
              order.status === 'confirmed' ? 'badge-confirmed' :
              order.status === 'preparing' ? 'badge-preparing' :
              order.status === 'ready' ? 'badge-ready' :
              'badge-cancelled'
            }`}>
              {tr[`order${order.status.charAt(0).toUpperCase() + order.status.slice(1)}` as keyof typeof tr] ?? order.status}
            </span>
          </div>

          {/* Items */}
          <div className="space-y-2 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-sage-700 dark:text-sage-200">
                  {lang === 'ru' ? item.menuItem.name_ru : item.menuItem.name_tk}
                  <span className="text-sage-400 ml-1">× {item.quantity}</span>
                </span>
                <span className="text-sage-500">
                  {new Intl.NumberFormat('ru-RU').format(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-semibold border-t border-cream-200 dark:border-sage-700 pt-2 mt-2">
              <span className="text-sage-800 dark:text-cream-100">{tr.total}</span>
              <span className="text-sage-600 dark:text-sage-300">
                {new Intl.NumberFormat('ru-RU').format(order.totalAmount)} {tr.currency}
              </span>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-sage-400">
              {lang === 'ru' ? 'Страница обновляется автоматически' : 'Sahypa awtomatiki täzelenýär'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
