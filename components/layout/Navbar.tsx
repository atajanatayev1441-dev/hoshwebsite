'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/providers/LangProvider'
import { useCart } from '@/components/providers/CartProvider'
import { translations } from '@/lib/i18n'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const pathname = usePathname()
  const { lang, setLang } = useLang()
  const { count, setCartOpen } = useCart()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const tr = translations[lang]
  const ru = lang === 'ru'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
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
        borderBottom: scrolled ? '1px solid #1e1b16' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between" style={{ height: '64px' }}>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div
            style={{
              width: '48px', height: '48px', position: 'relative',
              background: '#000000', isolation: 'isolate',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {logoError ? (
              <div className="text-center leading-none">
                <div style={{ fontFamily: 'var(--font-italiana, "Georgia", serif)', fontSize: '18px', color: '#C9A84C', letterSpacing: '0.05em' }}>
                  HOS
                </div>
                <div style={{ fontFamily: 'var(--font-dm-sans, system-ui, sans-serif)', fontSize: '7px', color: '#C9A84C', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '2px' }}>
                  LOUNGE
                </div>
              </div>
            ) : (
              <Image
                src="/images/logo.png"
                alt="HOS Lounge"
                fill priority
                onError={() => setLogoError(true)}
                style={{ objectFit: 'contain', filter: 'grayscale(1) brightness(0.6) contrast(20)', mixBlendMode: 'screen' }}
              />
            )}
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center" style={{ gap: '40px' }}>
          {links.map(l => (
            <Link
              key={l.href} href={l.href}
              className="relative group"
              style={{
                fontFamily: "'Jost', system-ui, sans-serif",
                fontSize: '13px', fontWeight: 500,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: isActive(l.href) ? '#C9A84C' : '#9e9890',
                transition: 'color 0.25s', textDecoration: 'none',
              }}
            >
              {l.label}
              <span style={{
                position: 'absolute', bottom: '-4px', left: 0,
                height: '1px', background: '#C9A84C',
                width: isActive(l.href) ? '100%' : '0%',
                transition: 'width 0.3s ease',
              }}
                className="group-hover:!w-full"
              />
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center" style={{ gap: '16px' }}>
          {/* Language switcher */}
          <button
            onClick={() => setLang(lang === 'ru' ? 'tk' : 'ru')}
            style={{
              fontFamily: "'Jost', system-ui, sans-serif",
              fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: '#7a7570',
              background: 'transparent', border: '1px solid #3e3830',
              padding: '4px 10px', cursor: 'pointer', transition: 'all 0.25s',
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.color = '#C9A84C'; el.style.borderColor = '#C9A84C' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.color = '#7a7570'; el.style.borderColor = '#3e3830' }}
          >
            {ru ? 'TK' : 'RU'}
          </button>

          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center justify-center"
            style={{ color: '#9e9890', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
            aria-label="Корзина"
          >
            <ShoppingBag className="w-5 h-5" style={{ transition: 'color 0.25s' }} />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full"
                style={{ background: '#C9A84C', color: '#080705', fontFamily: "'Jost', sans-serif" }}
              >
                {count > 9 ? '9+' : count}
              </motion.span>
            )}
          </button>

          {/* Book button desktop */}
          <Link href="/booking" className="hidden md:block btn-gold" style={{ padding: '8px 20px', fontSize: '10px' }}>
            {tr.bookTable}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            style={{ color: '#9e9890', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: '#080705', borderTop: '1px solid #1e1b16' }}
          >
            <nav style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={l.href} onClick={() => setOpen(false)}
                    style={{
                      fontFamily: "'Jost', system-ui, sans-serif",
                      fontSize: '13px', fontWeight: 500,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: isActive(l.href) ? '#C9A84C' : '#9e9890', textDecoration: 'none',
                    }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link href="/booking" onClick={() => setOpen(false)} className="btn-gold" style={{ width: 'fit-content', marginTop: '8px' }}>
                {tr.bookTable}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
