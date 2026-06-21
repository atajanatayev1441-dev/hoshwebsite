'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'
import { useCart } from '@/components/providers/CartProvider'
import { MenuCard } from '@/components/menu/MenuCard'
import { translations } from '@/lib/i18n'
import type { CategoryWithItems } from '@/app/(public)/menu/page'

interface Props {
  categories: CategoryWithItems[]
}

export function MenuClient({ categories }: Props) {
  const { lang } = useLang()
  const { count, setCartOpen } = useCart()
  const tr = translations[lang]
  const ru = lang === 'ru'

  const allItems = categories.flatMap((c) => c.items)
  const [activeId, setActiveId] = useState<number | 'all'>('all')

  const visibleItems = activeId === 'all'
    ? allItems
    : (categories.find((c) => c.id === activeId)?.items ?? [])

  return (
    <>
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src="/images/photo_2026-06-19_18-49-22.jpg"
          alt={ru ? 'Наше меню' : 'Biziň menýumyz'}
          fill className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(8,7,5,0.65)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="section-label mb-3">{ru ? 'Наше меню' : 'Biziň menýumyz'}</span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-[#f0ece3]">{tr.menu}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Empty state */}
        {categories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-px bg-gold-500/40 mb-10" />
            <span className="section-label mb-6">{ru ? 'Скоро' : 'Ýakynda'}</span>
            <h2 className="font-display text-[clamp(32px,4vw,52px)] font-light text-[#f0ece3] mb-4">
              {ru ? 'Меню скоро появится' : 'Menýu ýakynda bolar'}
            </h2>
            <p className="text-[#5c5852] text-sm font-body max-w-sm leading-relaxed">
              {ru
                ? 'Мы готовим для вас что-то особенное. Загляните позже или забронируйте столик уже сейчас.'
                : 'Size aýratyn bir zat taýýarlaýarys. Soňrak giriň ýa-da häzir stol zakaz ediň.'}
            </p>
            <div className="w-20 h-px bg-gold-500/40 mt-10" />
          </motion.div>
        ) : (
          <>
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-12 scrollbar-hide">
              <button
                onClick={() => setActiveId('all')}
                className="flex-shrink-0 px-5 py-2 font-body text-xs font-medium tracking-widest uppercase transition-all duration-200"
                style={activeId === 'all'
                  ? { borderBottom: '2px solid #C9A84C', color: '#C9A84C', background: 'transparent' }
                  : { borderBottom: '2px solid transparent', color: '#7a7570', background: 'transparent' }
                }
              >
                {ru ? 'Все' : 'Ählisi'}
              </button>
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveId(cat.id)}
                  className="flex-shrink-0 px-5 py-2 font-body text-xs font-medium tracking-widest uppercase transition-all duration-200 whitespace-nowrap"
                  style={activeId === cat.id
                    ? { borderBottom: '2px solid #C9A84C', color: '#C9A84C', background: 'transparent' }
                    : { borderBottom: '2px solid transparent', color: '#7a7570', background: 'transparent' }
                  }
                >
                  {ru ? cat.name_ru : cat.name_tk}
                </motion.button>
              ))}
            </div>

            {/* No items in selected category */}
            {visibleItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#5c5852] font-body text-sm">
                  {ru ? 'В этой категории пока нет позиций' : 'Bu kategoriýada heniz pozisiýa ýok'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleItems.map((item, i) => (
                  <MenuCard key={item.id} item={item} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Cart FAB */}
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', damping: 14 }}
        onClick={() => setCartOpen(true)}
        className="fixed bottom-8 right-8 z-30 w-14 h-14 flex items-center justify-center shadow-2xl"
        style={{ background: '#C9A84C', color: '#080705' }}
        aria-label="Открыть корзину"
      >
        <ShoppingBag className="w-6 h-6" />
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full"
            style={{ background: '#ff4444', color: '#fff', fontFamily: "'Jost', sans-serif" }}
          >
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </motion.button>
    </>
  )
}
