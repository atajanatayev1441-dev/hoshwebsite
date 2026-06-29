'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Phone, Hash, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/components/providers/CartProvider'
import { useLang } from '@/components/providers/LangProvider'
import { useClientAuth } from '@/components/providers/ClientAuthProvider'

const SAGE = '#6b7d68'
const BORDER_COLOR = 'rgba(107,125,104,0.2)'

export function CoffeeCartDrawer() {
  const { items, updateQty, clearCart, total, cartOpen, setCartOpen } = useCart()
  const { lang } = useLang()
  const { client } = useClientAuth()
  const ru = lang === 'ru'

  const [tableNumber, setTableNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)

  useEffect(() => {
    if (client?.phone) {
      setPhone(client.phone)
    }
  }, [client?.phone])

  const fmt = (p: number) => new Intl.NumberFormat('ru-RU').format(p) + ' TMT'

  const handleOrder = async () => {
    if (!tableNumber.trim()) {
      toast.error(ru ? 'Введите номер стола' : 'Stol belgisini giriziň')
      return
    }
    if (!phone.trim()) {
      toast.error(ru ? 'Введите номер телефона' : 'Telefon belgisin giriziň')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/coffee/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber,
          clientPhone: phone,
          clientLang: lang,
          items: items.map((i) => ({ menuItemId: i.id, quantity: i.quantity, price: i.price })),
          totalAmount: total,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOrderId(data.id)
      clearCart()
      toast.success(ru ? 'Заказ принят! Ожидайте подтверждения' : 'Sargyt kabul edildi! Garaşyň')
    } catch {
      toast.error(ru ? 'Ошибка. Попробуйте снова' : 'Ýalňyşlyk. Gaýtadan synanşyň')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCartOpen(false)
    if (orderId) {
      setOrderId(null)
      setTableNumber('')
      setPhone('')
    }
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{ background: '#faf9f6', borderLeft: `1px solid ${BORDER_COLOR}` }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-6"
              style={{ borderBottom: `1px solid ${BORDER_COLOR}` }}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" style={{ color: SAGE }} />
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '18px',
                    fontWeight: 300,
                    color: '#1c1c1c',
                  }}
                >
                  {ru ? 'Корзина' : 'Sebediňiz'}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center transition-colors"
                style={{ color: 'rgba(107,125,104,0.5)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#1c1c1c')}
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = 'rgba(107,125,104,0.5)')
                }
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success state */}
            {orderId ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  <CheckCircle className="w-14 h-14 mx-auto mb-5" style={{ color: SAGE }} />
                </motion.div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '24px',
                    fontWeight: 300,
                    color: '#1c1c1c',
                    marginBottom: '8px',
                  }}
                >
                  {ru ? 'Заказ принят!' : 'Sargyt kabul edildi!'}
                </h3>
                <p style={{ color: SAGE, fontSize: '14px', marginBottom: '4px' }}>
                  {ru ? 'Заказ №' : 'Sargyt №'}{orderId}
                </p>
                <p style={{ color: 'rgba(138,133,126,0.6)', fontSize: '12px', marginBottom: '32px' }}>
                  {ru ? 'Ожидайте подтверждения' : 'Tassyklanmagyna garaşyň'}
                </p>
                <button
                  onClick={handleClose}
                  style={{
                    background: SAGE,
                    color: '#fff',
                    padding: '12px 28px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {ru ? 'ЗАКРЫТЬ' : 'ÝAP'}
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {items.length === 0 ? (
                    <div
                      className="flex flex-col items-center justify-center h-48"
                      style={{ color: 'rgba(107,125,104,0.4)' }}
                    >
                      <ShoppingBag className="w-10 h-10 mb-3 opacity-30" />
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                        {ru ? 'Корзина пуста' : 'Sebet boş'}
                      </p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3"
                        style={{
                          background: '#f0ede6',
                          border: `1px solid ${BORDER_COLOR}`,
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '14px',
                              fontWeight: 400,
                              color: '#1c1c1c',
                            }}
                            className="truncate"
                          >
                            {lang === 'ru' ? item.name_ru : item.name_tk}
                          </p>
                          <p
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '12px',
                              color: SAGE,
                            }}
                          >
                            {fmt(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center transition-colors"
                            style={{
                              border: `1px solid ${BORDER_COLOR}`,
                              color: 'rgba(107,125,104,0.6)',
                              background: 'transparent',
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement
                              el.style.borderColor = SAGE
                              el.style.color = SAGE
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement
                              el.style.borderColor = BORDER_COLOR
                              el.style.color = 'rgba(107,125,104,0.6)'
                            }}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span
                            style={{
                              width: '20px',
                              textAlign: 'center',
                              fontSize: '14px',
                              color: '#1c1c1c',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center transition-colors"
                            style={{
                              border: `1px solid ${BORDER_COLOR}`,
                              color: 'rgba(107,125,104,0.6)',
                              background: 'transparent',
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement
                              el.style.borderColor = SAGE
                              el.style.color = SAGE
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement
                              el.style.borderColor = BORDER_COLOR
                              el.style.color = 'rgba(107,125,104,0.6)'
                            }}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                  <div
                    className="p-5 space-y-4"
                    style={{ borderTop: `1px solid ${BORDER_COLOR}` }}
                  >
                    <div className="flex justify-between">
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          color: 'rgba(138,133,126,0.8)',
                        }}
                      >
                        {ru ? 'Итого' : 'Jemi'}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: SAGE,
                        }}
                      >
                        {fmt(total)}
                      </span>
                    </div>

                    <div className="relative">
                      <Hash
                        className="absolute left-3 top-3.5 w-4 h-4"
                        style={{ color: 'rgba(107,125,104,0.4)' }}
                      />
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder={ru ? 'Номер стола' : 'Stol belgisi'}
                        className="w-full pl-9 pr-4 py-3 focus:outline-none text-sm transition-colors"
                        style={{
                          background: 'transparent',
                          borderBottom: `1px solid ${BORDER_COLOR}`,
                          fontFamily: 'var(--font-body)',
                          color: '#1c1c1c',
                        }}
                        onFocus={(e) =>
                          ((e.currentTarget as HTMLElement).style.borderColor = SAGE)
                        }
                        onBlur={(e) =>
                          ((e.currentTarget as HTMLElement).style.borderColor = BORDER_COLOR)
                        }
                      />
                    </div>

                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-3.5 w-4 h-4"
                        style={{ color: 'rgba(107,125,104,0.4)' }}
                      />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => { if (!client) setPhone(e.target.value) }}
                        readOnly={!!client}
                        placeholder={ru ? 'Номер телефона' : 'Telefon belgisi'}
                        className="w-full pl-9 pr-4 py-3 focus:outline-none text-sm transition-colors"
                        style={{
                          background: client ? 'rgba(107,125,104,0.06)' : 'transparent',
                          borderBottom: `1px solid ${BORDER_COLOR}`,
                          fontFamily: 'var(--font-body)',
                          color: '#1c1c1c',
                          fontSize: '16px',
                          cursor: client ? 'default' : 'text',
                        }}
                        onFocus={(e) => {
                          if (!client) (e.currentTarget as HTMLElement).style.borderColor = SAGE
                        }}
                        onBlur={(e) =>
                          ((e.currentTarget as HTMLElement).style.borderColor = BORDER_COLOR)
                        }
                      />
                    </div>

                    <button
                      onClick={handleOrder}
                      disabled={loading}
                      className="w-full py-3.5 transition-colors disabled:opacity-50"
                      style={{
                        background: SAGE,
                        color: '#fff',
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (!loading)
                          (e.currentTarget as HTMLElement).style.background = '#5a6b57'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLElement).style.background = SAGE
                      }}
                    >
                      {loading
                        ? ru
                          ? 'Отправка...'
                          : 'Iberilýär...'
                        : ru
                        ? 'ОФОРМИТЬ ЗАКАЗ'
                        : 'SARGYT ET'}
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
