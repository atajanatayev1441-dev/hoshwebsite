'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/providers/LangProvider'
import { useCart } from '@/components/providers/CartProvider'
import { translations } from '@/lib/i18n'
import { ShoppingBag, X, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { VenueSwitcher } from '@/components/shared/VenueSwitcher'

export function Navbar() {
  const pathname = usePathname()
  const { lang, setLang } = useLang()
  const { count, setCartOpen } = useCart()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const tr = translations[lang]
  const ru = lang === 'ru'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { href: '/',           label: tr.home },
    { href: '/menu',       label: tr.menu },
    { href: '/booking',    label: tr.booking },
    { href: '/promotions', label: tr.promotions },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      style={{
        height: '64px',
        background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.12)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-full">

        {/* ── Venue switcher ── */}
        <VenueSwitcher />

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map(l => (
            <Link
              key={l.href} href={l.href}
              className="relative group/link"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: isActive(l.href) ? '#C9A84C' : '#9e9890',
                textDecoration: 'none',
                transition: 'color 0.25s',
              }}
              onMouseEnter={e => { if (!isActive(l.href)) (e.currentTarget as HTMLElement).style.color = '#f0ece3' }}
              onMouseLeave={e => { if (!isActive(l.href)) (e.currentTarget as HTMLElement).style.color = '#9e9890' }}
            >
              {l.label}
              {/* Gold underline slides from left */}
              <span style={{
                position: 'absolute',
                bottom: '-3px',
                left: 0,
                height: '1px',
                background: '#C9A84C',
                width: isActive(l.href) ? '100%' : '0%',
                transition: 'width 0.3s ease',
              }} className="group-hover/link:!w-full" />
            </Link>
          ))}
        </nav>

        {/* ── Right controls ── */}
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'ru' ? 'tk' : 'ru')}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.25em',
              textTransform: 'uppercase', color: '#5c5852',
              background: 'transparent', border: '1px solid #2a2720',
              padding: '5px 10px', cursor: 'pointer', transition: 'all 0.25s',
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.color = '#C9A84C'; el.style.borderColor = '#C9A84C' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.color = '#5c5852'; el.style.borderColor = '#2a2720' }}
          >
            {ru ? 'TK' : 'RU'}
          </button>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9e9890', transition: 'color 0.25s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#C9A84C'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#9e9890'}
            aria-label="Корзина"
          >
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{
                  position: 'absolute', top: '-2px', right: '-4px',
                  width: '16px', height: '16px',
                  background: '#C9A84C', color: '#0a0a0a',
                  borderRadius: '50%', fontSize: '9px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                }}
              >
                {count > 9 ? '9+' : count}
              </motion.span>
            )}
          </button>

          {/* Book — desktop */}
          <Link href="/booking" className="hidden md:flex btn-gold" style={{ padding: '9px 22px', fontSize: '10px', letterSpacing: '0.2em' }}>
            {tr.bookTable}
          </Link>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e9890' }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu — fullscreen overlay with stagger ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: '#0a0a0a',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', gap: '2.5rem',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '32px', background: 'none', border: 'none', cursor: 'pointer', color: '#5c5852' }}
            >
              <X size={24} />
            </button>

            {links.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(32px, 9vw, 48px)',
                    color: isActive(l.href) ? '#C9A84C' : '#f0ece3',
                    textDecoration: 'none', letterSpacing: '0.03em',
                  }}
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ delay: 0.32 }}
            >
              <Link href="/booking" onClick={() => setOpen(false)} className="btn-gold" style={{ marginTop: '1rem' }}>
                {tr.bookTable}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
