'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, ChefHat, Bell, XCircle, Home, UtensilsCrossed } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import Link from 'next/link'

const statusConfig = {
  pending:   { icon: Clock,       color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  confirmed: { icon: CheckCircle, color: '#60a5fa', bg: 'rgba(59,130,246,0.12)' },
  preparing: { icon: ChefHat,     color: '#fb923c', bg: 'rgba(249,115,22,0.12)' },
  ready:     { icon: Bell,        color: '#4ade80', bg: 'rgba(34,197,94,0.12)' },
  cancelled: { icon: XCircle,     color: '#f87171', bg: 'rgba(239,68,68,0.12)' },
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
  const ru = lang === 'ru'
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

  const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ' + tr.currency

  const actions = (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
      <Link href="/" className="btn-outline">
        <Home className="w-4 h-4" />
        {ru ? 'На главную' : 'Baş sahypa'}
      </Link>
      <Link href="/menu" className="btn-gold">
        <UtensilsCrossed className="w-4 h-4" />
        {ru ? 'Смотреть меню' : 'Menýuny gör'}
      </Link>
    </div>
  )

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16">
        <div className="text-center" style={{ maxWidth: '420px' }}>
          <XCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--muted)' }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--muted-hi)' }}>
            {ru ? 'Заказ не найден' : 'Sargyt tapylmady'}
          </p>
          {actions}
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full animate-spin"
          style={{ border: '2px solid var(--gold)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  const cfg = statusConfig[order.status as keyof typeof statusConfig] ?? statusConfig.pending
  const StatusIcon = cfg.icon

  const steps = ['pending', 'confirmed', 'preparing', 'ready']
  const currentStep = steps.indexOf(order.status)

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full" style={{ maxWidth: '460px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-2)',
            padding: 'clamp(28px, 6vw, 44px)',
          }}
        >
          <div className="text-center mb-7">
            <motion.div
              animate={{ scale: order.status === 'ready' ? [1, 1.08, 1] : 1 }}
              transition={{ duration: 0.6, repeat: order.status === 'ready' ? Infinity : 0, repeatDelay: 2 }}
              className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full"
              style={{ background: cfg.bg }}
            >
              <StatusIcon className="w-7 h-7" style={{ color: cfg.color }} />
            </motion.div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 5vw, 30px)', fontWeight: 300, color: 'var(--white)', marginBottom: '4px' }}>
              {tr.orderStatus}
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', letterSpacing: '0.05em' }}>
              {tr.orderNumber}{order.id}
            </p>
          </div>

          {/* Progress steps */}
          {order.status !== 'cancelled' && (
            <div className="flex items-center justify-center mb-7">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center">
                  <div
                    className="w-2.5 h-2.5 rounded-full transition-colors"
                    style={{ background: i <= currentStep ? 'var(--gold)' : 'var(--border-2)' }}
                  />
                  {i < steps.length - 1 && (
                    <div
                      className="h-px w-10 sm:w-12 mx-1 transition-colors"
                      style={{ background: i < currentStep ? 'var(--gold)' : 'var(--border-2)' }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Status label */}
          <div className="text-center mb-6">
            <span
              className="inline-block px-4 py-1.5 rounded-full"
              style={{
                fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}33`,
              }}
            >
              {tr[`order${order.status.charAt(0).toUpperCase() + order.status.slice(1)}` as keyof typeof tr] ?? order.status}
            </span>
          </div>

          {/* Courier notice */}
          {order.status === 'ready' && (
            <p
              className="text-center px-4 py-3 mb-6"
              style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#e0c88a', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)' }}
            >
              {ru ? 'Ваш заказ отправлен, ждите звонка курьера' : 'Sargydyňyz iberildi, kurýeriň jaňyna garaşyň'}
            </p>
          )}

          {/* Items */}
          <div className="space-y-2 mb-4" style={{ borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between" style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                <span style={{ color: 'var(--muted-hi)' }}>
                  {lang === 'ru' ? item.menuItem.name_ru : item.menuItem.name_tk}
                  <span style={{ color: 'var(--muted-lo)' }}> × {item.quantity}</span>
                </span>
                <span style={{ color: 'var(--muted)' }}>
                  {new Intl.NumberFormat('ru-RU').format(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div
              className="flex justify-between pt-3 mt-2"
              style={{ borderTop: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500 }}
            >
              <span style={{ color: 'var(--white)' }}>{tr.total}</span>
              <span style={{ color: 'var(--gold)' }}>{fmt(order.totalAmount)}</span>
            </div>
          </div>

          <p className="text-center mt-6" style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--muted-xlo)' }}>
            {ru ? 'Страница обновляется автоматически' : 'Sahypa awtomatiki täzelenýär'}
          </p>
        </motion.div>

        {actions}
      </div>
    </div>
  )
}
