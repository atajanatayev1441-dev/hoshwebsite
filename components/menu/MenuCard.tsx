'use client'

import Image from 'next/image'
import { useCart } from '@/components/providers/CartProvider'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'

interface Props {
  item: {
    id: number
    name_ru: string; name_tk: string
    description_ru: string | null; description_tk: string | null
    price: number; imageUrl: string | null
    available: boolean; featured: boolean
  }
  index: number
}

export function MenuCard({ item }: Props) {
  const { addItem, setCartOpen } = useCart()
  const { lang } = useLang()
  const tr = translations[lang]
  const ru = lang === 'ru'

  const name = ru ? item.name_ru : item.name_tk
  const desc = ru ? item.description_ru : item.description_tk
  const fmt  = (p: number) => new Intl.NumberFormat('ru-RU').format(p) + ' ' + tr.currency

  function handleAdd() {
    if (!item.available) return
    addItem({ id: item.id, name_ru: item.name_ru, name_tk: item.name_tk, price: item.price })
    setCartOpen(true)
  }

  return (
    <div
      className="menu-card group relative overflow-hidden flex flex-col"
      style={{
        background: 'var(--surface)',
        border: '1px solid rgba(255,255,255,0.12)',
        transition: 'border-color 0.3s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
    >
      {/* Featured: gold top bar */}
      {item.featured && (
        <div style={{ height: '2px', background: 'var(--gold)', flexShrink: 0 }} />
      )}

      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/2', flexShrink: 0 }}>
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={name}
            fill
            className="menu-img object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#1a1a1a' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '64px', fontWeight: 300, color: 'rgba(201,168,76,0.15)' }}>
              {name.charAt(0)}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {item.featured && (
          <div className="absolute top-3 left-3" style={{ background: 'var(--gold)', padding: '3px 10px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--bg)' }}>
              {ru ? 'ХИТ' : 'HIT'}
            </span>
          </div>
        )}

        {/* Unavailable */}
        {!item.available && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(10,10,10,0.75)' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 14px' }}>
              {tr.unavailable}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 pb-5">
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 300, color: 'var(--white)', marginBottom: '8px', lineHeight: 1.2 }}>
          {name}
        </h3>
        {desc && (
          <p className="line-clamp-2 flex-1" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 300, color: 'var(--muted)', lineHeight: 1.6, marginBottom: '16px' }}>
            {desc}
          </p>
        )}
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 400, color: 'var(--gold)', display: 'block', marginTop: 'auto' }}>
          {fmt(item.price)}
        </span>
      </div>

      {/* В корзину — slides up from bottom on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out p-4"
        style={{ background: 'var(--surface)' }}
      >
        <button
          onClick={handleAdd}
          disabled={!item.available}
          className="w-full py-3 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
          style={{
            fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            border: '1px solid var(--gold)', color: 'var(--gold)',
            background: 'transparent',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--bg)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
        >
          {ru ? 'В КОРЗИНУ' : 'SEBEDE'}
        </button>
      </div>
    </div>
  )
}
