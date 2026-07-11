'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ChevronLeft } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'
import { useCart } from '@/components/providers/CartProvider'
import { MenuCard } from '@/components/menu/MenuCard'
import { translations } from '@/lib/i18n'
import { cldOptimize } from '@/lib/cloudinary'

export type CategoryWithItems = {
  id: number
  name_ru: string
  name_tk: string
  position: number
  visible: boolean
  items: {
    id: number
    categoryId: number
    name_ru: string
    name_tk: string
    description_ru: string | null
    description_tk: string | null
    price: number
    imageUrl: string | null
    available: boolean
    featured: boolean
  }[]
}

function CategoryCard({ cat, name, onSelect }: { cat: CategoryWithItems; name: string; onSelect: () => void }) {
  const thumb = cat.items.find((i) => i.imageUrl)?.imageUrl ?? null
  return (
    <button
      onClick={onSelect}
      className="relative overflow-hidden group text-left"
      style={{ aspectRatio: '4/3', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      {thumb ? (
        <Image
          src={cldOptimize(thumb, 400)}
          alt={name}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: '#171310' }} />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.82) 100%)' }} />
      {/* Fixed light colors here (not theme vars) — this tile is always a dark
          photo scrim regardless of the page's light/dark theme. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(15px, 4.5vw, 24px)', fontWeight: 400, color: '#FAFAF8', lineHeight: 1.15 }}>
          {name}
        </h3>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(9px, 2.4vw, 11px)', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', marginTop: '6px' }}>
          {cat.items.length} {cat.items.length === 1 ? 'позиция' : 'позиций'}
        </span>
      </div>
    </button>
  )
}

export function MenuClient({ categories }: { categories: CategoryWithItems[] }) {
  const { lang } = useLang()
  const { count, setCartOpen } = useCart()
  const tr = translations[lang]
  const ru = lang === 'ru'

  const [activeId, setActiveId] = useState<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  // Switching category (or going back) can shrink the page a lot — without
  // this, a short category left you scrolled past its content into the
  // footer instead of landing on what you just opened. Skip on mount so we
  // don't scroll the hero out of view on first load.
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [activeId])

  const activeCategory = categories.find((c) => c.id === activeId) ?? null
  const activeName = activeCategory ? (ru ? activeCategory.name_ru : activeCategory.name_tk || activeCategory.name_ru) : ''

  return (
    <>
      {/* Hero 35vh */}
      <div className="relative overflow-hidden" style={{ height: '35vh', minHeight: '240px' }}>
        <Image src="/images/photo_2026-06-19_18-49-22.jpg" alt="Menu" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.72)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px', display: 'block' }}>
            {ru ? 'HOŞ LOUNGE' : 'HOŞ LOUNGE'}
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: 300, color: '#FAFAF8', margin: 0 }}>
            {ru ? 'Меню' : 'Menýu'}
          </h1>
        </div>
      </div>

      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12">

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
          <AnimatePresence mode="wait">
            {!activeCategory ? (
              /* Category cards grid */
              <motion.div
                key="categories"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
              >
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    cat={cat}
                    name={ru ? cat.name_ru : cat.name_tk || cat.name_ru}
                    onSelect={() => setActiveId(cat.id)}
                  />
                ))}
              </motion.div>
            ) : (
              /* Items inside the selected category */
              <motion.div
                key="items"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <button
                    onClick={() => setActiveId(null)}
                    className="flex items-center justify-center flex-shrink-0 w-9 h-9"
                    style={{ border: '1px solid var(--border)', color: 'var(--gold)' }}
                    aria-label={ru ? 'Назад к категориям' : 'Kategoriýalara gaýt'}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 5vw, 34px)', fontWeight: 300, color: 'var(--white)' }}>
                    {activeName}
                  </h2>
                </div>

                {activeCategory.items.length === 0 ? (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--muted)', textAlign: 'center', padding: '60px 0' }}>
                    {ru ? 'В этой категории нет позиций' : 'Bu kategoriýada pozisiýa ýok'}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                    {activeCategory.items.map((item, i) => (
                      <MenuCard key={item.id} item={item} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
