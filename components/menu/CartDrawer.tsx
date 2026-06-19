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
  const { items, updateQty, removeItem, clearCart, total } = useCart()
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
    if (!tableNumber.trim()) {
      setError(lang === 'ru' ? 'Введите номер стола' : 'Stol belgisin giriziň')
      return
    }
    if (!phone.trim()) {
      setError(lang === 'ru' ? 'Введите номер телефона' : 'Telefon belgisin giriziň')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/orders', {
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
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setOrderId(data.id)
      clearCart()
    } catch (e) {
      setError(lang === 'ru' ? 'Ошибка при отправке заказа' : 'Sargyt ibermekde ýalňyşlyk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-cream-50 dark:bg-sage-900 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-cream-200 dark:border-sage-700">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-sage-600" />
                <h2 className="font-playfair font-semibold text-lg text-sage-800 dark:text-cream-100">
                  {tr.cart}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-200 dark:hover:bg-sage-700 transition-colors"
              >
                <X className="w-4 h-4 text-sage-600 dark:text-sage-300" />
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
                  <CheckCircle className="w-16 h-16 text-sage-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="font-playfair text-xl font-semibold text-sage-800 dark:text-cream-100 mb-2">
                  {tr.orderSuccess}
                </h3>
                <p className="text-sage-500 dark:text-sage-400 mb-2">
                  {tr.orderNumber}{orderId}
                </p>
                <p className="text-sm text-sage-400 mb-6">
                  {tr.orderPending}
                </p>
                <a
                  href={`/orders/${orderId}`}
                  className="btn-primary"
                  onClick={onClose}
                >
                  {lang === 'ru' ? 'Отслеживать заказ' : 'Sargydy yzarla'}
                </a>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-sage-400">
                      <ShoppingBag className="w-10 h-10 mb-2 opacity-40" />
                      <p className="text-sm">{tr.emptyCart}</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-3 bg-white dark:bg-sage-800 rounded-xl p-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-sage-800 dark:text-cream-100 truncate">
                            {lang === 'ru' ? item.name_ru : item.name_tk}
                          </p>
                          <p className="text-xs text-sage-500">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-sage-100 dark:bg-sage-700 flex items-center justify-center hover:bg-sage-200 dark:hover:bg-sage-600 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-sage-600 dark:text-sage-200" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-sage-800 dark:text-cream-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-sage-100 dark:bg-sage-700 flex items-center justify-center hover:bg-sage-200 dark:hover:bg-sage-600 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-sage-600 dark:text-sage-200" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                  <div className="border-t border-cream-200 dark:border-sage-700 p-4 space-y-3">
                    {/* Total */}
                    <div className="flex items-center justify-between font-semibold text-sage-800 dark:text-cream-100">
                      <span>{tr.total}</span>
                      <span className="text-sage-600 dark:text-sage-300">{formatPrice(total)}</span>
                    </div>

                    {/* Inputs */}
                    <div className="relative">
                      <Hash className="absolute left-3 top-3.5 w-4 h-4 text-sage-400" />
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder={tr.tableNumberPlaceholder}
                        className="input pl-9 text-sm"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-4 h-4 text-sage-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={tr.phonePlaceholder}
                        className="input pl-9 text-sm"
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-xs">{error}</p>
                    )}

                    <button
                      onClick={handleOrder}
                      disabled={loading}
                      className="btn-primary w-full disabled:opacity-60"
                    >
                      {loading
                        ? tr.loading
                        : tr.placeOrder}
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
