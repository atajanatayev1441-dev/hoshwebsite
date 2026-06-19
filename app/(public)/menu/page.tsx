'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { CartProvider, useCart } from '@/components/providers/CartProvider'
import { MenuCard } from '@/components/menu/MenuCard'
import { CartDrawer } from '@/components/menu/CartDrawer'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'

interface Category {
  id: number
  name_ru: string
  name_tk: string
}

interface MenuItem {
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
    Promise.all([fetch('/api/categories').then((r) => r.json()), fetch('/api/menu').then((r) => r.json())])
      .then(([cats, menuItems]) => {
        setCategories(cats)
        setItems(menuItems)
        if (cats.length > 0) setActiveCategory(cats[0].id)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredItems = activeCategory
    ? items.filter((i) => i.categoryId === activeCategory)
    : items

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-playfair text-4xl font-semibold text-sage-800 dark:text-cream-100 mb-2">
          {tr.menu}
        </h1>
        <div className="w-12 h-0.5 bg-sage-400" />
      </motion.div>

      {/* Category tabs */}
      {!loading && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setActiveCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-sage-600 text-white'
                : 'bg-cream-200 dark:bg-sage-800 text-sage-600 dark:text-sage-300 hover:bg-cream-300 dark:hover:bg-sage-700'
            }`}
          >
            {lang === 'ru' ? 'Все' : 'Ählisi'}
          </motion.button>
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-sage-600 text-white'
                  : 'bg-cream-200 dark:bg-sage-800 text-sage-600 dark:text-sage-300 hover:bg-cream-300 dark:hover:bg-sage-700'
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
            <div
              key={i}
              className="card h-64 animate-pulse bg-cream-200 dark:bg-sage-800"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item, i) => (
            <MenuCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}

      {/* Floating cart button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-sage-600 hover:bg-sage-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
      >
        <ShoppingBag className="w-6 h-6" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-badge-pulse">
            {count}
          </span>
        )}
      </motion.button>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

export default function MenuPage() {
  return (
    <CartProvider>
      <MenuContent />
    </CartProvider>
  )
}
