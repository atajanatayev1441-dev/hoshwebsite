'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { CartProvider, useCart } from '@/components/providers/CartProvider'
import { MenuCard } from '@/components/menu/MenuCard'
import { CartDrawer } from '@/components/menu/CartDrawer'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'

interface Category { id: number; name_ru: string; name_tk: string }
interface MenuItem {
  id: number; categoryId: number; name_ru: string; name_tk: string
  description_ru: string | null; description_tk: string | null
  price: number; imageUrl: string | null; available: boolean; featured: boolean
}

function MenuContent() {
  const { lang } = useLang()
  const tr = translations[lang]
  const { count } = useCart()
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetch('/api/categories').then(r => r.json()), fetch('/api/menu').then(r => r.json())])
      .then(([cats, menuItems]) => {
        setCategories(cats); setItems(menuItems)
        if (cats.length > 0) setActiveCategory(cats[0].id)
      }).finally(() => setLoading(false))
  }, [])

  const filteredItems = activeCategory ? items.filter(i => i.categoryId === activeCategory) : items

  return (
    <>
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image src="/images/photo_2026-06-19_18-49-22.jpg" alt="Menu" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-carbon-950/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="section-label mb-3">{lang === 'ru' ? 'Наше меню' : 'Biziň menýumyz'}</p>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-concrete-100">{tr.menu}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Category tabs */}
        {!loading && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-colors ${
                activeCategory === null
                  ? 'bg-gold-500 text-carbon-950'
                  : 'border border-carbon-700 text-concrete-400 hover:border-gold-500 hover:text-gold-400'
              }`}
            >
              {lang === 'ru' ? 'Все' : 'Ählisi'}
            </button>
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-gold-500 text-carbon-950'
                    : 'border border-carbon-700 text-concrete-400 hover:border-gold-500 hover:text-gold-400'
                }`}
              >
                {lang === 'ru' ? cat.name_ru : cat.name_tk}
              </motion.button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-carbon-900 border border-carbon-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Cart FAB */}
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
        onClick={() => setCartOpen(true)}
        className="fixed bottom-8 right-8 z-30 w-14 h-14 bg-gold-500 hover:bg-gold-400 text-carbon-950 flex items-center justify-center shadow-2xl transition-colors"
      >
        <ShoppingBag className="w-6 h-6" />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-badge-pulse">
            {count}
          </span>
        )}
      </motion.button>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

export default function MenuPage() {
  return <CartProvider><MenuContent /></CartProvider>
}
