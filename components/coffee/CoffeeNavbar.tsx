'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/providers/LangProvider'
import { useCart } from '@/components/providers/CartProvider'
import { useClientAuth } from '@/components/providers/ClientAuthProvider'
import { X, Menu, ShoppingBag, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SAGE     = '#6b7d68'
const TEXT     = '#1c1c1c'
const MUTED    = 'rgba(28,28,28,0.42)'
const BG       = '#f0ede6'

export function CoffeeNavbar() {
  const { lang, setLang } = useLang()
  const { count, setCartOpen } = useCart()
  const { client, loading: authLoading } = useClientAuth()
  const ru = lang === 'ru'
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { href: '#about',   labelRu: 'О нас',          labelTk: 'Biz hakda' },
    { href: '#menu',    labelRu: 'Меню',            labelTk: 'Menýu' },
    { href: '#booking', labelRu: 'Бронирование',    labelTk: 'Zakaz' },
  ]

  const navLinkStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    color: MUTED,
    textDecoration: 'none',
    transition: 'color 0.22s',
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-400"
      style={{
        height: '64px',
        background: scrolled ? 'rgba(240,237,230,0.97)' : 'rgba(240,237,230,0.82)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(107,125,104,0.18)' : 'rgba(107,125,104,0.08)'}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-full">

        {/* Logo */}
        <Link href="/coffee" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1, gap: '1px' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 300, color: TEXT, letterSpacing: '0.04em', lineHeight: 1 }}>
            HOŞ
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '7.5px', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: SAGE, lineHeight: 1 }}>
            COFFEE
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              style={navLinkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = SAGE)}
              onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
            >
              {ru ? l.labelRu : l.labelTk}
            </a>
          ))}
          <Link
            href="/"
            style={{ ...navLinkStyle, color: 'rgba(28,28,28,0.28)', borderLeft: '1px solid rgba(28,28,28,0.1)', paddingLeft: '20px' }}
            onMouseEnter={e => (e.currentTarget.style.color = MUTED)}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(28,28,28,0.28)')}
          >
            Lounge ↗
          </Link>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Lang toggle */}
          <button
            onClick={() => setLang(lang === 'ru' ? 'tk' : 'ru')}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: MUTED, background: 'transparent',
              border: '1px solid rgba(28,28,28,0.13)',
              padding: '5px 9px', cursor: 'pointer', transition: 'all 0.22s',
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.color = SAGE; el.style.borderColor = SAGE }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.color = MUTED; el.style.borderColor = 'rgba(28,28,28,0.13)' }}
          >
            {ru ? 'TK' : 'RU'}
          </button>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px' }}
            aria-label="Корзина"
          >
            <ShoppingBag size={17} style={{ color: count > 0 ? SAGE : MUTED, transition: 'color 0.22s' }} />
            {count > 0 && (
              <span style={{
                position: 'absolute', top: '2px', right: '2px',
                width: '14px', height: '14px',
                background: SAGE, color: '#fff', borderRadius: '50%',
                fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>

          {/* Auth */}
          {!authLoading && (
            client ? (
              <Link
                href="/profile"
                style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: SAGE, textDecoration: 'none', transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <User size={13} />
                <span className="hidden sm:inline">{client.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED, textDecoration: 'none', transition: 'color 0.22s' }}
                onMouseEnter={e => (e.currentTarget.style.color = SAGE)}
                onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
              >
                Войти
              </Link>
            )
          )}

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT, display: 'flex', alignItems: 'center', marginLeft: '2px' }}
            aria-label="Меню"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: BG,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', gap: '2rem',
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: MUTED }}
            >
              <X size={22} />
            </button>

            {/* Brand in mobile menu */}
            <div style={{ position: 'absolute', top: '18px', left: '24px', display: 'flex', flexDirection: 'column', lineHeight: 1, gap: '2px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 300, color: TEXT }}>HOŞ</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '7px', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: SAGE }}>COFFEE</span>
            </div>

            {links.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(28px, 8vw, 44px)',
                    fontWeight: 300,
                    color: TEXT,
                    textDecoration: 'none',
                    letterSpacing: '0.02em',
                  }}
                >
                  {ru ? l.labelRu : l.labelTk}
                </a>
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED, textDecoration: 'none' }}
              >
                ← HOŞ Lounge
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
