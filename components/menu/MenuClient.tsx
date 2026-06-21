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

export function MenuClient({ categories }: { categories: CategoryWithItems[] }) {
  const { lang } = useLang()
  const { count, setCartOpen } = useCart()
  const tr = translations[lang]
  const ru = lang === 'ru'

  const [activeId, setActiveId] = useState<number | 'all'>('all')

  const allItems = categories.flatMap(c => c.items)
  const visibleItems = activeId === 'all'
    ? allItems
    : (categories.find(c => c.id === activeId)?.items ?? [])

  return (
    <>
      {/* Hero 35vh */}
      <div className="relative overflow-hidden" style={{ height: '35vh', minHeight: '240px' }}>
        <Image src="/images/photo_2026-06-19_18-49-22.jpg" alt="Menu" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.72)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px', display: 'block' }}>
            {ru ? 'HOS LOUNGE' : 'HOS LOUNGE'}
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: 300, color: 'var(--white)', margin: 0 }}>
            {ru ? 'Меню' : 'Menýu'}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">

        {/* Empty state */}
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '0 auto 32px' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '42px', fontWeight: 300, color: 'var(--white)', marginBottom: '12px' }}>
              {ru ? 'Меню обновляется' : 'Menýu täzelenýär'}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 300, color: 'var(--muted)' }}>
              {ru ? 'Загляните позже' : 'Soňrak giriň'}
            </p>
            <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '32px auto 0' }} />
          </div>
        ) : (
          <>
            {/* Category tabs */}
            <div className="flex overflow-x-auto scrollbar-hide gap-0 mb-10" style={{ borderBottom: '1px solid var(--border)' }}>
              {[{ id: 'all' as const, name_ru: ru ? 'Все' : 'Ählisi', name_tk: 'Ählisi' }, ...categories].map((cat) => {
                const isActive = activeId === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveId(cat.id)}
                    className="flex-shrink-0 px-5 py-4 relative whitespace-nowrap"
                    style={{
                      fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: isActive ? 'var(--gold)' : 'var(--muted)',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      transition: 'color 0.2s',
                    }}
                  >
                    {ru ? cat.name_ru : (cat as any).name_tk || cat.name_ru}
                    {isActive && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0"
                        style={{ height: '2px', background: 'var(--gold)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Grid */}
            {visibleItems.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--muted)', textAlign: 'center', padding: '60px 0' }}>
                {ru ? 'В этой категории нет позиций' : 'Bu kategoriýada pozisiýa ýok'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--border)' }}>
                {visibleItems.map((item, i) => (
                  <div key={item.id} style={{ background: 'var(--bg)' }}>
                    <MenuCard item={item} index={i} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Cart FAB */}
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', damping: 14 }}
        onClick={() => setCartOpen(true)}
        className="fixed bottom-8 right-8 z-30 flex items-center justify-center"
        style={{ width: 56, height: 56, background: 'var(--gold)', color: 'var(--bg)' }}
      >
        <ShoppingBag size={22} />
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 flex items-center justify-center"
            style={{ width: 20, height: 20, background: '#ef4444', borderRadius: '50%', fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, color: '#fff' }}
          >
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </motion.button>
    </>
  )
}
