'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useLang } from '@/components/providers/LangProvider'
import { useCart } from '@/components/providers/CartProvider'
import { useClientAuth } from '@/components/providers/ClientAuthProvider'
import { translations } from '@/lib/i18n'
import { ShoppingBag, X, Menu, User, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const pathname = usePathname()
  const { lang, setLang } = useLang()
  const { count, setCartOpen } = useCart()
  const { client, loading: authLoading } = useClientAuth()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const tr = translations[lang]
  const ru = lang === 'ru'

  useEffect(() => { setMounted(true) }, [])

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

  const isDark = resolvedTheme === 'dark'

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      style={{
        height: '64px',
        background: scrolled ? 'var(--navbar-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--navbar-border)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-full">

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Image
            src="/images/logo-transparent.png"
            alt="HOŞ Lounge"
            width={52}
            height={52}
            style={{ objectFit: 'contain' }}
            priority
          />
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map(l => (
            <Link
              key={l.href} href={l.href}
              className="relative group/link"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px', fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: isActive(l.href) ? 'var(--gold)' : 'var(--muted-hi)',
                textDecoration: 'none', transition: 'color 0.25s',
              }}
              onMouseEnter={e => { if (!isActive(l.href)) (e.currentTarget as HTMLElement).style.color = 'var(--white)' }}
              onMouseLeave={e => { if (!isActive(l.href)) (e.currentTarget as HTMLElement).style.color = 'var(--muted-hi)' }}
            >
              {l.label}
              <span style={{
                position: 'absolute', bottom: '-3px', left: 0, height: '1px',
                background: 'var(--gold)', width: isActive(l.href) ? '100%' : '0%',
                transition: 'width 0.3s ease',
              }} className="group-hover/link:!w-full" />
            </Link>
          ))}
        </nav>

        {/* ── Right controls ── */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'ru' ? 'tk' : 'ru')}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.25em',
              textTransform: 'uppercase', color: 'var(--muted-lo)',
              background: 'transparent', border: '1px solid var(--border-2)',
              padding: '5px 10px', cursor: 'pointer', transition: 'all 0.25s',
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.color = 'var(--gold)'; el.style.borderColor = 'var(--gold)' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.color = 'var(--muted-lo)'; el.style.borderColor = 'var(--border-2)' }}
          >
            {ru ? 'TK' : 'RU'}
          </button>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="theme-toggle"
              aria-label={isDark ? 'Светлая тема' : 'Тёмная тема'}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--muted-hi)', transition: 'color 0.25s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--gold)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--muted-hi)'}
            aria-label="Корзина"
          >
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{
                  position: 'absolute', top: '-2px', right: '-4px',
                  width: '16px', height: '16px',
                  background: 'var(--gold)', color: 'var(--bg)',
                  borderRadius: '50%', fontSize: '9px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {count > 9 ? '9+' : count}
              </motion.span>
            )}
          </button>

          {/* Auth */}
          {!authLoading && (
            client ? (
              <Link
                href="/profile"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: 'var(--gold)', textDecoration: 'none', transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--gold)')}
              >
                <User size={14} />
                {client.name.split(' ')[0]}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'var(--muted-hi)', textDecoration: 'none', transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-hi)')}
              >
                ВОЙТИ
              </Link>
            )
          )}

          {/* Book — desktop */}
          <Link href="/booking" className="hidden md:flex btn-gold" style={{ padding: '9px 22px', fontSize: '10px', letterSpacing: '0.2em' }}>
            {tr.bookTable}
          </Link>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-hi)' }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'var(--bg)',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', gap: '2.5rem',
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '32px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-lo)' }}
            >
              <X size={24} />
            </button>

            {links.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }} transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(32px, 9vw, 48px)',
                    color: isActive(l.href) ? 'var(--gold)' : 'var(--white)',
                    textDecoration: 'none', letterSpacing: '0.03em',
                  }}
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.32 }}>
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
