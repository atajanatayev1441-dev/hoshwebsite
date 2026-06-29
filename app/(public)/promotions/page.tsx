'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Tag } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'

interface Promotion {
  id: number; title_ru: string; title_tk: string
  description_ru: string; description_tk: string
  badge_ru: string | null; badge_tk: string | null; price: number | null
}

export default function PromotionsPage() {
  const { lang } = useLang()
  const tr = translations[lang]
  const [promos, setPromos] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/promotions').then(r => r.json()).then(setPromos).finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image src="/images/photo_2026-06-19_18-49-24.jpg" alt="Promotions" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-carbon-950/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="section-label mb-3">{lang === 'ru' ? 'Специальные предложения' : 'Ýörite teklipler'}</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-concrete-100">{tr.promotionsTitle}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-52 bg-carbon-900 border border-carbon-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promos.map((promo, i) => {
              const title = lang === 'ru' ? promo.title_ru : promo.title_tk
              const description = lang === 'ru' ? promo.description_ru : promo.description_tk
              const badge = lang === 'ru' ? promo.badge_ru : promo.badge_tk
              return (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-carbon-900 border border-carbon-800 hover:border-gold-500/50 transition-colors group overflow-hidden"
                >
                  <div className="h-1 bg-gold-500" />
                  <div className="p-7">
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="w-10 h-10 border border-gold-500/30 flex items-center justify-center text-gold-500">
                        <Tag className="w-4 h-4" />
                      </div>
                      {badge && (
                        <span className="bg-gold-500 text-carbon-950 text-xs font-bold px-3 py-1 tracking-widest uppercase">
                          {badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-concrete-100 mb-3">{title}</h3>
                    <p className="text-concrete-500 text-sm leading-relaxed font-light">{description}</p>
                    {promo.price && (
                      <div className="mt-5 pt-5 border-t border-carbon-800">
                        <span className="font-semibold text-gold-400">
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
    </>
  )
}
