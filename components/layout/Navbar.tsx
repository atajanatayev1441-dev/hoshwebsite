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
  const pathname  = usePathname()
  const { lang, setLang } = useLang()
  const [open, setOpen]   = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [imgOk, setImgOk] = useState(true)
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

  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-[#080705]/96 backdrop-blur-md border-b border-[#1e1b16]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

        {/* ── Logo ──
            The PNG has a sage-green background. We isolate it on a pure-black
            container and use mix-blend-mode:screen so the background disappears
            while white text remains visible. A text fallback is always shown. */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          {imgOk && (
            <div
              className="relative w-11 h-11 rounded-sm overflow-hidden flex-shrink-0"
              style={{ background: '#000', isolation: 'isolate' }}
            >
              <Image
                src="/images/logo.png"
                alt=""
                fill
                className="object-contain"
                style={{ mixBlendMode: 'screen' }}
                priority
                onError={() => setImgOk(false)}
              />
            </div>
          )}
          {/* Text logo — always visible, matches brand typography */}
          <div className="flex flex-col leading-none">
            <span
              className="text-[22px] font-light tracking-[0.12em] text-[#f0ece3] group-hover:text-gold-400 transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              HOS
            </span>
            <span className="text-[8px] font-medium tracking-[0.45em] uppercase text-gold-500 font-body mt-0.5">
              Lounge
            </span>
          </div>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map(l => (
            <Link
              key={l.href} href={l.href}
              className={`font-body text-[11px] font-medium tracking-[0.22em] uppercase transition-colors ${
                active(l.href)
                  ? 'text-gold-400'
                  : 'text-[#9e9890] hover:text-[#f0ece3]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* ── Controls ── */}
        <div className="flex items-center gap-5">
          {/* Language switcher */}
          <button
            onClick={() => setLang(lang === 'ru' ? 'tk' : 'ru')}
            className="font-body text-[11px] font-medium tracking-[0.22em] uppercase text-[#7a7570] hover:text-gold-400 transition-colors border border-[#3e3830] hover:border-gold-500 px-2.5 py-1"
          >
            {lang === 'ru' ? 'TK' : 'RU'}
          </button>

          <Link href="/booking" className="hidden md:block btn-gold !py-2 !px-5 text-[10px]">
            {tr.bookTable}
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[#9e9890] hover:text-[#f0ece3] transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#080705] border-t border-[#1e1b16]"
          >
            <nav className="px-8 py-8 flex flex-col gap-6">
              {links.map(l => (
                <Link
                  key={l.href} href={l.href}
                  onClick={() => setOpen(false)}
                  className={`font-body text-sm font-medium tracking-[0.2em] uppercase ${
                    active(l.href) ? 'text-gold-400' : 'text-[#9e9890]'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link href="/booking" onClick={() => setOpen(false)} className="btn-gold w-fit mt-2">
                {tr.bookTable}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
