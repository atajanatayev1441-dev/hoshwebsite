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
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="card overflow-hidden group hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-44 bg-sage-100 dark:bg-sage-800 overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sage-300 dark:text-sage-600 text-5xl font-playfair italic">
              {name.charAt(0)}
            </div>
          </div>
        )}

        {item.featured && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-sage-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            <Star className="w-2.5 h-2.5 fill-white" />
            {tr.featured}
          </div>
        )}

        {!item.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
              {tr.unavailable}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-playfair font-semibold text-sage-800 dark:text-cream-100 mb-1 leading-tight">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-sage-500 dark:text-sage-400 leading-relaxed mb-3 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sage-700 dark:text-sage-200">
            {formatPrice(item.price)}
          </span>
          <button
            onClick={() =>
              addItem({
                id: item.id,
                name_ru: item.name_ru,
                name_tk: item.name_tk,
                price: item.price,
              })
            }
            disabled={!item.available}
            className="w-9 h-9 rounded-full bg-sage-600 hover:bg-sage-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all active:scale-90"
            aria-label={tr.addToCart}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
