'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/providers/LangProvider'
import { X, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { VenueSwitcher } from '@/components/shared/VenueSwitcher'

const SAGE    = '#7a8c75'
const SAGE_DIM = 'rgba(122,140,117,0.6)'
const BG_LIGHT = '#f5f4f0'
const TEXT_DARK = '#1a1a1a'

export function CoffeeNavbar() {
  const { lang, setLang } = useLang()
  const ru = lang === 'ru'
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { href: '#about',   labelRu: 'О НАС',       labelTk: 'BIZ HAKDA' },
    { href: '#menu',    labelRu: 'МЕНЮ',         labelTk: 'MENÝU' },
    { href: '#booking', labelRu: 'БРОНИРОВАНИЕ', labelTk: 'ZAKAZ' },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-500" style={{
      height: '64px',
      background: scrolled ? 'rgba(245,244,240,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(122,140,117,0.15)' : 'none',
    }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-full">

        {/* Venue switcher */}
        <VenueSwitcher />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map(l => (
            <a key={l.href} href={l.href} style={{
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(26,26,26,0.5)', textDecoration: 'none', transition: 'color 0.25s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = SAGE)}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,26,26,0.5)')}
            >
              {ru ? l.labelRu : l.labelTk}
            </a>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(lang === 'ru' ? 'tk' : 'ru')} style={{
            fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'rgba(26,26,26,0.4)', background: 'transparent',
            border: '1px solid rgba(26,26,26,0.15)', padding: '5px 10px', cursor: 'pointer', transition: 'all 0.25s',
          }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.color = SAGE; el.style.borderColor = SAGE }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.color = 'rgba(26,26,26,0.4)'; el.style.borderColor = 'rgba(26,26,26,0.15)' }}
          >
            {ru ? 'TK' : 'RU'}
          </button>

          <button onClick={() => setOpen(!open)} className="md:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_DARK }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: BG_LIGHT, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2.5rem' }}>
            <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: '20px', right: '28px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(26,26,26,0.4)' }}>
              <X size={24} />
            </button>
            {links.map((l, i) => (
              <motion.div key={l.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.07 }}>
                <a href={l.href} onClick={() => setOpen(false)} style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 9vw, 48px)', color: TEXT_DARK, textDecoration: 'none', letterSpacing: '0.02em' }}>
                  {ru ? l.labelRu : l.labelTk}
                </a>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <div style={{ marginTop: '8px' }}>
                <VenueSwitcher />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
