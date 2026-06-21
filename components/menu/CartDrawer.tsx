'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Phone, Hash, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/components/providers/CartProvider'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'

export function CartDrawer() {
  const { items, updateQty, clearCart, total, cartOpen, setCartOpen } = useCart()
  const { lang } = useLang()
  const tr = translations[lang]
  const ru = lang === 'ru'

  const [tableNumber, setTableNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)

  const fmt = (p: number) => new Intl.NumberFormat('ru-RU').format(p) + ' ' + tr.currency

  const handleOrder = async () => {
    if (!tableNumber.trim()) { toast.error(ru ? 'Введите номер стола' : 'Stol belgisini giriziň'); return }
    if (!phone.trim()) { toast.error(ru ? 'Введите номер телефона' : 'Telefon belgisin giriziň'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber, clientPhone: phone, clientLang: lang,
          items: items.map((i) => ({ menuItemId: i.id, quantity: i.quantity, price: i.price })),
          totalAmount: total,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOrderId(data.id)
      clearCart()
      toast.success(ru ? 'Заказ принят! Ожидайте SMS подтверждения' : 'Sargyt kabul edildi! SMS garaşyň')
    } catch {
      toast.error(ru ? 'Ошибка. Попробуйте снова' : 'Ýalňyşlyk. Gaýtadan synanşyň')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCartOpen(false)
    if (orderId) { setOrderId(null); setTableNumber(''); setPhone('') }
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{ background: '#0d0c09', borderLeft: '1px solid #1e1b16' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid #1e1b16' }}>
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold-500" />
                <h2 className="font-display text-lg font-light text-[#f0ece3]">{tr.cart}</h2>
              </div>
              <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center text-[#5c5852] hover:text-[#f0ece3] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success state */}
            {orderId ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                  <CheckCircle className="w-14 h-14 text-gold-500 mx-auto mb-5" />
                </motion.div>
                <h3 className="font-display text-2xl font-light text-[#f0ece3] mb-2">{tr.orderSuccess}</h3>
                <p className="text-[#5c5852] text-sm mb-1">{tr.orderNumber}{orderId}</p>
                <p className="text-[#3e3830] text-xs mb-8">{tr.orderPending}</p>
                <a href={`/orders/${orderId}`} className="btn-gold" onClick={handleClose}>
                  {ru ? 'Отслеживать заказ' : 'Sargydy yzarla'}
                </a>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-[#3e3830]">
                      <ShoppingBag className="w-10 h-10 mb-3 opacity-30" />
                      <p className="text-sm font-body">{tr.emptyCart}</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <motion.div
                        key={item.id} layout
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3"
                        style={{ background: '#161616', border: '1px solid #1e1b16' }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-body font-medium text-[#f0ece3] truncate">
                            {lang === 'ru' ? item.name_ru : item.name_tk}
                          </p>
                          <p className="text-xs text-gold-500 font-body">{fmt(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-7 h-7 border border-[#2a2720] hover:border-gold-500 flex items-center justify-center text-[#7a7570] hover:text-gold-400 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-sm text-[#f0ece3] font-body">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 border border-[#2a2720] hover:border-gold-500 flex items-center justify-center text-[#7a7570] hover:text-gold-400 transition-colors"
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
                  <div className="p-5 space-y-4" style={{ borderTop: '1px solid #1e1b16' }}>
                    <div className="flex justify-between">
                      <span className="text-[#7a7570] font-body text-sm">{tr.total}</span>
                      <span className="text-gold-400 font-body font-medium">{fmt(total)}</span>
                    </div>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3.5 w-4 h-4 text-[#3e3830]" />
                      <input
                        type="text" value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder={tr.tableNumberPlaceholder}
                        className="w-full pl-9 pr-4 py-3 bg-transparent border-b border-[#2a2720] focus:border-gold-500 focus:outline-none text-[#f0ece3] text-sm font-body placeholder:text-[#3e3830] transition-colors"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-4 h-4 text-[#3e3830]" />
                      <input
                        type="tel" value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={tr.phonePlaceholder}
                        className="w-full pl-9 pr-4 py-3 bg-transparent border-b border-[#2a2720] focus:border-gold-500 focus:outline-none text-[#f0ece3] text-sm font-body placeholder:text-[#3e3830] transition-colors"
                        style={{ colorScheme: 'dark', fontSize: '16px' }}
                      />
                    </div>
                    <button
                      onClick={handleOrder}
                      disabled={loading}
                      className="btn-gold w-full justify-center disabled:opacity-50"
                    >
                      {loading ? (ru ? 'Отправка...' : 'Iberilýär...') : tr.placeOrder}
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
