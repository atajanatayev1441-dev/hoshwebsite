'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const pathname = usePathname()
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const tr = translations[lang]

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
        background: scrolled ? 'rgba(8,7,5,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #1e1b16' : 'none',
      }}
    >
      <div
        className="max-w-7xl mx-auto px-8 flex items-center justify-between"
        style={{ height: '64px' }}
      >

        {/* ── LOGO ──
            Техника: grayscale→brightness→contrast превращает фон в чёрный,
            а белые элементы лого остаются белыми.
            mix-blend-mode:screen на чёрном родителе: чёрное = прозрачное,
            белое — остаётся. Итог: только сам логотип, без фона.         */}
        <Link href="/" className="flex-shrink-0">
          <div
            style={{
              width: '48px',
              height: '48px',
              position: 'relative',
              background: '#000000',   /* обязательно чёрный */
              isolation: 'isolate',
            }}
          >
            <Image
              src="/images/logo.png"
              alt="HOS Lounge"
              fill
              priority
              style={{
                objectFit: 'contain',
                /* шаг 1: grayscale — убираем цвет, фон ~0.51, лого 1.0      */
                /* шаг 2: brightness(0.6) — фон→0.31, лого→0.6               */
                /* шаг 3: contrast(20) — 0.31 < 0.5 → 0 (чёрный);            */
                /*         0.6 > 0.5 → 1.0 (белый)                           */
                /* screen на чёрном фоне: чёрное исчезает, белое светится    */
                filter: 'grayscale(1) brightness(0.6) contrast(20)',
                mixBlendMode: 'screen',
              }}
            />
          </div>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center" style={{ gap: '40px' }}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: "'Jost', system-ui, sans-serif",
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isActive(l.href) ? '#c8922a' : '#9e9890',
                transition: 'color 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { if (!isActive(l.href)) (e.target as HTMLElement).style.color = '#f0ece3' }}
              onMouseLeave={e => { if (!isActive(l.href)) (e.target as HTMLElement).style.color = '#9e9890' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* ── Right controls ── */}
        <div className="flex items-center" style={{ gap: '20px' }}>
          <button
            onClick={() => setLang(lang === 'ru' ? 'tk' : 'ru')}
            style={{
              fontFamily: "'Jost', system-ui, sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#7a7570',
              background: 'transparent',
              border: '1px solid #3e3830',
              padding: '4px 10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.color = '#c8922a'
              el.style.borderColor = '#c8922a'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.color = '#7a7570'
              el.style.borderColor = '#3e3830'
            }}
          >
            {lang === 'ru' ? 'TK' : 'RU'}
          </button>

          <Link
            href="/booking"
            className="hidden md:block btn-gold"
            style={{ padding: '8px 20px', fontSize: '10px' }}
          >
            {tr.bookTable}
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            style={{ color: '#9e9890', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: '#080705', borderTop: '1px solid #1e1b16' }}
          >
            <nav style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {links.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    fontFamily: "'Jost', system-ui, sans-serif",
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isActive(l.href) ? '#c8922a' : '#9e9890',
                    textDecoration: 'none',
                  }}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/booking"
                onClick={() => setOpen(false)}
                className="btn-gold"
                style={{ width: 'fit-content', marginTop: '8px' }}
              >
                {tr.bookTable}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
