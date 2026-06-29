'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Search, Clock, CheckCircle, XCircle, Package, ChefHat, ArrowLeft } from 'lucide-react'

interface OrderItem {
  id: number
  quantity: number
  price: number
  menuItem: { name_ru: string; name_tk: string }
}

interface Order {
  id: number
  tableNumber: string
  totalAmount: number
  status: string
  venue: string
  createdAt: string
  items: OrderItem[]
}

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending:   { label: 'Ожидает',   icon: Clock,        color: '#b45309', bg: '#fef3c7' },
  confirmed: { label: 'Принят',    icon: CheckCircle,  color: '#166534', bg: '#dcfce7' },
  preparing: { label: 'Готовится', icon: ChefHat,      color: '#1d4ed8', bg: '#dbeafe' },
  ready:     { label: 'Готов',     icon: Package,      color: '#7c3aed', bg: '#ede9fe' },
  cancelled: { label: 'Отменён',   icon: XCircle,      color: '#b91c1c', bg: '#fee2e2' },
}

function fmt(n: number) {
  return new Intl.NumberFormat('ru-RU').format(n) + ' TMT'
}

function timeStr(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function TrackPage() {
  const [phone,   setPhone]   = useState('')
  const [orders,  setOrders]  = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/track?phone=${encodeURIComponent(phone.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOrders(data)
    } catch {
      setError('Ошибка. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: 'var(--font-body)' }}>
      {/* Top bar */}
      <div style={{ background: '#1c1c1c', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontSize: '13px' }}>
          <ArrowLeft size={15} /> На сайт
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', letterSpacing: '0.1em' }}>HOŞ · Статус заказа</span>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: 'clamp(40px,8vw,80px) 20px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '48px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#6b7d68', display: 'block', marginBottom: '16px' }}>
            ОТСЛЕЖИВАНИЕ ЗАКАЗА
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,7vw,64px)', fontWeight: 300, color: '#1c1c1c', lineHeight: 1.1, margin: 0 }}>
            Мой заказ
          </h1>
        </motion.div>

        {/* Search form */}
        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          style={{ display: 'flex', gap: '0', marginBottom: '40px', border: '1px solid rgba(0,0,0,0.12)', background: '#fff', overflow: 'hidden' }}
        >
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Введите номер телефона"
            required
            style={{
              flex: 1, padding: '16px 20px', border: 'none', outline: 'none',
              fontFamily: 'var(--font-body)', fontSize: '15px', background: 'transparent', color: '#1c1c1c',
            }}
          />
          <button type="submit" disabled={loading}
            style={{
              padding: '16px 24px', background: '#6b7d68', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1,
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase',
              transition: 'background 0.2s', flexShrink: 0,
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#5a6b57' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#6b7d68' }}
          >
            <Search size={15} />
            {loading ? 'Поиск...' : 'Найти'}
          </button>
        </motion.form>

        {error && (
          <p style={{ color: '#b91c1c', fontSize: '14px', textAlign: 'center', marginBottom: '24px' }}>{error}</p>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {orders !== null && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#8a857e' }}>
                  <p style={{ fontSize: '15px' }}>Заказы не найдены</p>
                  <p style={{ fontSize: '13px', marginTop: '8px' }}>Проверьте номер телефона</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ fontSize: '13px', color: '#8a857e', marginBottom: '4px' }}>
                    Найдено заказов: {orders.length}
                  </p>
                  {orders.map((order, i) => {
                    const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
                    const Icon = cfg.icon
                    return (
                      <motion.div key={order.id}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: '20px 24px' }}
                      >
                        {/* Order header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: 600, fontSize: '15px', color: '#1c1c1c' }}>
                              Заказ #{order.id}
                            </span>
                            <span style={{
                              fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
                              padding: '3px 8px', borderRadius: '2px',
                              background: order.venue === 'coffee' ? 'rgba(107,125,104,0.12)' : 'rgba(201,168,76,0.12)',
                              color: order.venue === 'coffee' ? '#5a6b57' : '#8a6e2a',
                            }}>
                              {order.venue === 'coffee' ? 'COFFEE' : 'LOUNGE'}
                            </span>
                          </div>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '20px', background: cfg.bg, color: cfg.color }}>
                            <Icon size={12} />
                            {cfg.label}
                          </span>
                        </div>

                        {/* Items */}
                        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '14px', marginBottom: '14px' }}>
                          {order.items.map((item) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#1c1c1c', padding: '4px 0' }}>
                              <span style={{ color: '#4a4a4a' }}>{item.menuItem.name_ru} × {item.quantity}</span>
                              <span style={{ color: '#6b7d68', fontWeight: 500 }}>{fmt(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '12px' }}>
                          <span style={{ fontSize: '12px', color: '#8a857e' }}>{timeStr(order.createdAt)} · Стол {order.tableNumber}</span>
                          <span style={{ fontWeight: 600, fontSize: '15px', color: '#1c1c1c' }}>{fmt(order.totalAmount)}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
