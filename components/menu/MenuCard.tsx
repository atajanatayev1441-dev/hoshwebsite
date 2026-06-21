'use client'

import { motion } from 'framer-motion'
import { Plus, Star } from 'lucide-react'
import Image from 'next/image'
import Tilt from 'react-parallax-tilt'
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
  const ru = lang === 'ru'

  const name = ru ? item.name_ru : item.name_tk
  const description = ru ? item.description_ru : item.description_tk
  const fmt = (p: number) => new Intl.NumberFormat('ru-RU').format(p) + ' ' + tr.currency

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Tilt
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        glareEnable={true}
        glareMaxOpacity={0.08}
        glareColor="#C9A84C"
        tiltReverse={false}
        transitionSpeed={1200}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="group overflow-hidden flex flex-col"
          style={{
            background: '#161616',
            border: '1px solid rgba(201,168,76,0.1)',
            transition: 'border-color 0.3s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)')}
        >
          {/* Image */}
          <div className="relative h-52 overflow-hidden" style={{ background: '#0d0c09' }}>
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #161616 0%, #0d0c09 100%)' }}
              >
                <span
                  className="font-display text-7xl italic select-none"
                  style={{ color: 'rgba(201,168,76,0.15)' }}
                >
                  {name.charAt(0)}
                </span>
              </div>
            )}

            {/* Featured badge */}
            {item.featured && (
              <div
                className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1"
                style={{ background: '#C9A84C', color: '#080705' }}
              >
                <Star className="w-2.5 h-2.5 fill-current" />
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  {tr.featured}
                </span>
              </div>
            )}

            {/* Unavailable overlay */}
            {!item.available && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(8,7,5,0.75)' }}>
                <span
                  className="px-3 py-1.5 border font-body text-xs tracking-widest uppercase"
                  style={{ color: '#7a7570', borderColor: '#3e3830' }}
                >
                  {tr.unavailable}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <h3
              className="font-display font-light text-[#f0ece3] mb-2 leading-snug"
              style={{ fontSize: '22px' }}
            >
              {name}
            </h3>
            {description && (
              <p
                className="font-body text-xs leading-relaxed mb-4 line-clamp-2 flex-1"
                style={{ color: '#5c5852', fontWeight: 300 }}
              >
                {description}
              </p>
            )}
            <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
              <span className="font-body font-medium text-sm" style={{ color: '#C9A84C' }}>
                {fmt(item.price)}
              </span>
              <button
                onClick={() => item.available && addItem({ id: item.id, name_ru: item.name_ru, name_tk: item.name_tk, price: item.price })}
                disabled={!item.available}
                className="w-9 h-9 flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: '#C9A84C', color: '#080705' }}
                onMouseEnter={e => { if (item.available) (e.currentTarget as HTMLElement).style.background = '#E8C96A' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C' }}
                aria-label={tr.addToCart}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  )
}
