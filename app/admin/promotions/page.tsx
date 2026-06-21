'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, ToggleLeft, ToggleRight } from 'lucide-react'

interface Promotion {
  id: number
  title_ru: string
  title_tk: string
  description_ru: string
  description_tk: string
  badge_ru: string | null
  badge_tk: string | null
  price: number | null
  active: boolean
}

const emptyPromo: Omit<Promotion, 'id'> = {
  title_ru: '',
  title_tk: '',
  description_ru: '',
  description_tk: '',
  badge_ru: '',
  badge_tk: '',
  price: null,
  active: true,
}

function PromoModal({
  promo,
  onSave,
  onClose,
}: {
  promo: Partial<Promotion> | null
  onSave: (data: Partial<Promotion>) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<Omit<Promotion, 'id'>>({ ...emptyPromo, ...(promo ?? {}) })
  const set = (key: keyof typeof form, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-carbon-900 border border-carbon-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-cream-200 dark:border-sage-700">
          <h2 className="font-playfair font-semibold text-sage-800 dark:text-cream-100">
            {promo?.id ? 'Редактировать акцию' : 'Новая акция'}
          </h2>
          <button onClick={onClose} className="text-sage-400 hover:text-sage-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-sage-600 dark:text-sage-300 mb-1">
                Заголовок (RU)
              </label>
              <input
                value={form.title_ru}
                onChange={(e) => set('title_ru', e.target.value)}
                className="input text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-sage-600 dark:text-sage-300 mb-1">
                Заголовок (TK)
              </label>
              <input
                value={form.title_tk}
                onChange={(e) => set('title_tk', e.target.value)}
                className="input text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-sage-600 dark:text-sage-300 mb-1">
                Описание (RU)
              </label>
              <textarea
                value={form.description_ru}
                onChange={(e) => set('description_ru', e.target.value)}
                rows={3}
                className="input text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-sage-600 dark:text-sage-300 mb-1">
                Описание (TK)
              </label>
              <textarea
                value={form.description_tk}
                onChange={(e) => set('description_tk', e.target.value)}
                rows={3}
                className="input text-sm resize-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-sage-600 dark:text-sage-300 mb-1">
                Бейдж (RU)
              </label>
              <input
                value={form.badge_ru ?? ''}
                onChange={(e) => set('badge_ru', e.target.value)}
                placeholder="–20%"
                className="input text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-sage-600 dark:text-sage-300 mb-1">
                Бейдж (TK)
              </label>
              <input
                value={form.badge_tk ?? ''}
                onChange={(e) => set('badge_tk', e.target.value)}
                placeholder="–20%"
                className="input text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-sage-600 dark:text-sage-300 mb-1">
                Цена (опц.)
              </label>
              <input
                type="number"
                value={form.price ?? ''}
                onChange={(e) => set('price', e.target.value ? Number(e.target.value) : null)}
                className="input text-sm"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set('active', e.target.checked)}
              className="w-4 h-4 accent-sage-600"
            />
            <span className="text-sm text-sage-700 dark:text-sage-200">Активна</span>
          </label>
        </div>
        <div className="p-5 border-t border-cream-200 dark:border-sage-700 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary text-sm">Отмена</button>
          <button
            onClick={() => onSave(form)}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Сохранить
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Partial<Promotion> | null | 'new'>(null)

  const fetchPromos = () =>
    fetch('/api/admin/promotions')
      .then((r) => r.json())
      .then(setPromos)
      .finally(() => setLoading(false))

  useEffect(() => { fetchPromos() }, [])

  const savePromo = async (data: Partial<Promotion>) => {
    if (data.id) {
      const res = await fetch(`/api/promotions/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const updated = await res.json()
      setPromos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    } else {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const created = await res.json()
      setPromos((prev) => [...prev, created])
    }
    setModal(null)
  }

  const deletePromo = async (id: number) => {
    if (!confirm('Удалить акцию?')) return
    await fetch(`/api/promotions/${id}`, { method: 'DELETE' })
    setPromos((prev) => prev.filter((p) => p.id !== id))
  }

  const toggleActive = async (promo: Promotion) => {
    const res = await fetch(`/api/promotions/${promo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !promo.active }),
    })
    const updated = await res.json()
    setPromos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-2xl font-semibold text-sage-800 dark:text-cream-100">
          Акции
        </h1>
        <button
          onClick={() => setModal('new')}
          className="btn-primary text-sm flex items-center gap-1.5 py-2"
        >
          <Plus className="w-4 h-4" />
          Добавить акцию
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-20 animate-pulse bg-cream-200 dark:bg-sage-800" />
          ))}
        </div>
      ) : promos.length === 0 ? (
        <div className="text-center py-16 text-sage-400 text-sm">Акций нет</div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {promos.map((promo) => (
              <motion.div
                key={promo.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`card p-4 flex items-center gap-4 ${!promo.active ? 'opacity-60' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sage-800 dark:text-cream-100">
                      {promo.title_ru}
                    </span>
                    {promo.badge_ru && (
                      <span className="text-xs bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-300 px-2 py-0.5 rounded-full">
                        {promo.badge_ru}
                      </span>
                    )}
                    {!promo.active && (
                      <span className="text-xs text-sage-400">(неактивна)</span>
                    )}
                  </div>
                  <p className="text-xs text-sage-500 dark:text-sage-400 truncate mt-0.5">
                    {promo.description_ru}
                  </p>
                  {promo.price && (
                    <p className="text-xs font-semibold text-sage-600 dark:text-sage-300 mt-0.5">
                      {new Intl.NumberFormat('ru-RU').format(promo.price)} м.
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(promo)}
                    className="text-sage-400 hover:text-sage-600 dark:hover:text-sage-200 transition-colors"
                    title={promo.active ? 'Деактивировать' : 'Активировать'}
                  >
                    {promo.active
                      ? <ToggleRight className="w-5 h-5 text-sage-500" />
                      : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setModal(promo)}
                    className="w-8 h-8 flex items-center justify-center text-sage-400 hover:text-sage-600 hover:bg-cream-100 dark:hover:bg-sage-700 rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deletePromo(promo.id)}
                    className="w-8 h-8 flex items-center justify-center text-sage-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {modal !== null && (
        <PromoModal
          promo={modal === 'new' ? null : modal}
          onSave={savePromo}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
