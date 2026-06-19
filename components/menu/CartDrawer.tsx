'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Phone, Hash, CheckCircle } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQty, clearCart, total } = useCart()
  const { lang } = useLang()
  const tr = translations[lang]

  const [tableNumber, setTableNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('ru-RU').format(p) + ' ' + tr.currency

  const handleOrder = async () => {
    if (!tableNumber.trim()) { setError(lang === 'ru' ? 'Введите номер стола' : 'Stol belgisini giriziň'); return }
    if (!phone.trim()) { setError(lang === 'ru' ? 'Введите номер телефона' : 'Telefon belgisin giriziň'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber, clientPhone: phone, clientLang: lang, items: items.map((i) => ({ menuItemId: i.id, quantity: i.quantity, price: i.price })), totalAmount: total }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOrderId(data.id)
      clearCart()
    } catch { setError(lang === 'ru' ? 'Ошибка при отправке заказа' : 'Sargyt ibermekde ýalňyşlyk') }
    finally { setLoading(false) }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-carbon-950 border-l border-carbon-800 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-carbon-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold-500" />
                <h2 className="font-playfair font-semibold text-lg text-concrete-100">{tr.cart}</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-concrete-500 hover:text-concrete-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success */}
            {orderId ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                  <CheckCircle className="w-16 h-16 text-gold-500 mx-auto mb-5" />
                </motion.div>
                <h3 className="font-playfair text-xl text-concrete-100 mb-2">{tr.orderSuccess}</h3>
                <p className="text-concrete-500 text-sm mb-1">{tr.orderNumber}{orderId}</p>
                <p className="text-concrete-600 text-xs mb-8">{tr.orderPending}</p>
                <a href={`/orders/${orderId}`} className="btn-gold" onClick={onClose}>
                  {lang === 'ru' ? 'Отслеживать заказ' : 'Sargydy yzarla'}
                </a>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-concrete-600">
                      <ShoppingBag className="w-10 h-10 mb-3 opacity-30" />
                      <p className="text-sm">{tr.emptyCart}</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <motion.div
                        key={item.id} layout
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 bg-carbon-900 border border-carbon-800 p-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-concrete-100 truncate">
                            {lang === 'ru' ? item.name_ru : item.name_tk}
                          </p>
                          <p className="text-xs text-concrete-500">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 border border-carbon-700 hover:border-gold-500 flex items-center justify-center text-concrete-400 hover:text-gold-400 transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-sm text-concrete-100">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 border border-carbon-700 hover:border-gold-500 flex items-center justify-center text-concrete-400 hover:text-gold-400 transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                  <div className="border-t border-carbon-800 p-5 space-y-4">
                    <div className="flex justify-between font-semibold">
                      <span className="text-concrete-400">{tr.total}</span>
                      <span className="text-gold-400">{formatPrice(total)}</span>
                    </div>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3.5 w-4 h-4 text-concrete-600" />
                      <input type="text" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder={tr.tableNumberPlaceholder} className="input pl-9 text-sm" />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-4 h-4 text-concrete-600" />
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={tr.phonePlaceholder} className="input pl-9 text-sm" />
                    </div>
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                    <button onClick={handleOrder} disabled={loading} className="btn-gold w-full justify-center disabled:opacity-50">
                      {loading ? tr.loading : tr.placeOrder}
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
