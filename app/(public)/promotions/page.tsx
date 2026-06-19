'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Tag } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'

interface Promotion {
  id: number
  title_ru: string
  title_tk: string
  description_ru: string
  description_tk: string
  badge_ru: string | null
  badge_tk: string | null
  price: number | null
}

export default function PromotionsPage() {
  const { lang } = useLang()
  const tr = translations[lang]
  const [promos, setPromos] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/promotions')
      .then((r) => r.json())
      .then(setPromos)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-playfair text-4xl font-semibold text-sage-800 dark:text-cream-100 mb-2">
          {tr.promotionsTitle}
        </h1>
        <p className="text-sage-500 dark:text-sage-400">{tr.promotionsSubtitle}</p>
        <div className="w-12 h-0.5 bg-sage-400 mt-3" />
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-48 animate-pulse bg-cream-200 dark:bg-sage-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((promo, i) => {
            const title = lang === 'ru' ? promo.title_ru : promo.title_tk
            const description = lang === 'ru' ? promo.description_ru : promo.description_tk
            const badge = lang === 'ru' ? promo.badge_ru : promo.badge_tk

            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="card overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                {/* Top accent */}
                <div className="h-2 bg-gradient-to-r from-sage-400 to-sage-600" />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-sage-100 dark:bg-sage-800 flex items-center justify-center text-sage-600 dark:text-sage-300">
                      <Tag className="w-5 h-5" />
                    </div>
                    {badge && (
                      <span className="bg-sage-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-playfair text-xl font-semibold text-sage-800 dark:text-cream-100 mb-2">
                    {title}
                  </h3>
                  <p className="text-sage-500 dark:text-sage-400 text-sm leading-relaxed">
                    {description}
                  </p>

                  {promo.price && (
                    <div className="mt-4 pt-4 border-t border-cream-200 dark:border-sage-700">
                      <span className="font-semibold text-sage-700 dark:text-sage-200">
                        {new Intl.NumberFormat('ru-RU').format(promo.price)} {tr.currency}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
