'use client'

import { motion } from 'framer-motion'
import { Plus, Star } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/components/providers/CartProvider'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'

interface MenuCardProps {
  item: {
    id: number
    name_ru: string
    name_tk: string
    description_ru: string | null
    description_tk: string | null
    price: number
    imageUrl: string | null
    available: boolean
    featured: boolean
  }
  index: number
}

export function MenuCard({ item, index }: MenuCardProps) {
  const { addItem } = useCart()
  const { lang } = useLang()
  const tr = translations[lang]

  const name = lang === 'ru' ? item.name_ru : item.name_tk
  const description = lang === 'ru' ? item.description_ru : item.description_tk

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('ru-RU').format(p) + ' ' + tr.currency

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-carbon-900 border border-carbon-800 hover:border-gold-500/40 transition-all duration-400 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 bg-carbon-800 overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-carbon-800 to-carbon-900">
            <span className="font-playfair text-6xl italic text-carbon-700 select-none">
              {name.charAt(0)}
            </span>
          </div>
        )}

        {item.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-gold-500 text-carbon-950 text-[10px] px-2.5 py-1 font-bold tracking-widest uppercase">
            <Star className="w-2.5 h-2.5 fill-carbon-950" />
            {tr.featured}
          </div>
        )}

        {!item.available && (
          <div className="absolute inset-0 bg-carbon-950/70 flex items-center justify-center">
            <span className="text-concrete-400 text-xs font-semibold tracking-widest uppercase border border-concrete-600 px-3 py-1.5">
              {tr.unavailable}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-playfair font-semibold text-concrete-100 mb-1.5 leading-snug">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-concrete-500 leading-relaxed mb-4 line-clamp-2 font-light">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gold-400 text-sm">
            {formatPrice(item.price)}
          </span>
          <button
            onClick={() =>
              addItem({ id: item.id, name_ru: item.name_ru, name_tk: item.name_tk, price: item.price })
            }
            disabled={!item.available}
            className="w-8 h-8 bg-gold-500 hover:bg-gold-400 disabled:opacity-30 disabled:cursor-not-allowed text-carbon-950 flex items-center justify-center transition-colors active:scale-90"
            aria-label={tr.addToCart}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
