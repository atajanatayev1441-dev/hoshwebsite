'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useClientAuth } from '@/components/providers/ClientAuthProvider'
import { Clock, CheckCircle, XCircle, Package, ChefHat, LogOut, ArrowLeft, Phone } from 'lucide-react'

const SAGE = '#6b7d68'

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

export default function ProfilePage() {
  const router = useRouter()
  const { client, loading, logout } = useClientAuth()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    if (!loading && client === null) {
      router.replace('/auth/login')
    }
  }, [loading, client, router])

  useEffect(() => {
    if (!client) return
    setOrdersLoading(true)
    fetch('/api/client/orders', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false))
  }, [client])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (loading || !client) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: `2px solid ${SAGE}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: 'var(--font-body)' }}>
      {/* Top bar */}
      <div style={{ background: '#1c1c1c', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontSize: '13px' }}>
          <ArrowLeft size={15} /> На сайт
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', letterSpacing: '0.1em' }}>HOŞ · Профиль</span>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: 'clamp(40px,8vw,80px) 20px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px' }}>
          <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.45em', textTransform: 'uppercase', color: SAGE, display: 'block', marginBottom: '12px' }}>
            МОЙ ПРОФИЛЬ
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,6vw,48px)', fontWeight: 300, color: '#1c1c1c', margin: '0 0 16px' }}>
            Добро пожаловать, {client.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8a857e', fontSize: '14px' }}>
            <Phone size={14} />
            <span>{client.phone}</span>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ marginBottom: '48px' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid rgba(0,0,0,0.15)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#8a857e', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = '#b91c1c'; el.style.color = '#b91c1c' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(0,0,0,0.15)'; el.style.color = '#8a857e' }}
          >
            <LogOut size={14} />
            Выйти
          </button>
        </motion.div>

        {/* Orders */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 300, color: '#1c1c1c', marginBottom: '20px' }}>
            История заказов
          </h2>

          {ordersLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#8a857e' }}>
              <div style={{ width: '24px', height: '24px', border: `2px solid ${SAGE}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              <p style={{ fontSize: '13px' }}>Загрузка заказов...</p>
            </div>
          ) : orders === null || orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#8a857e', background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
              <p style={{ fontSize: '15px' }}>У вас ещё нет заказов</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>Сделайте первый заказ в меню</p>
            </div>
          ) : (
            <AnimatePresence>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map((order, i) => {
                  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
                  const Icon = cfg.icon
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: '20px 24px' }}
                    >
                      {/* Order header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 600, fontSize: '15px', color: '#1c1c1c' }}>Заказ #{order.id}</span>
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
                        {order.items.map(item => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#1c1c1c', padding: '4px 0' }}>
                            <span style={{ color: '#4a4a4a' }}>{item.menuItem.name_ru} × {item.quantity}</span>
                            <span style={{ color: SAGE, fontWeight: 500 }}>{fmt(item.price * item.quantity)}</span>
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
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  )
}
