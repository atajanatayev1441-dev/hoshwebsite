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
  const [open, setOpen]   = useState(false)
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

  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-[#080705]/95 backdrop-blur-md border-b border-[#1e1b16]' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

        {/* Logo — filter убирает любой фон, оставляет белый силуэт */}
        <Link href="/" className="relative w-14 h-14 flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="HOS Lounge"
            fill
            className="object-contain logo-white"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map(l => (
            <Link
              key={l.href} href={l.href}
              className={`font-body text-[11px] font-medium tracking-[0.22em] uppercase transition-colors ${
                active(l.href) ? 'text-gold-400' : 'text-[#9e9890] hover:text-[#f0ece3]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setLang(lang === 'ru' ? 'tk' : 'ru')}
            className="font-body text-[11px] font-medium tracking-[0.2em] uppercase text-[#7a7570] hover:text-gold-400 transition-colors"
          >
            {lang === 'ru' ? 'TK' : 'RU'}
          </button>

          <Link href="/booking" className="hidden md:block btn-gold !py-2.5 !px-5 text-[10px]">
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

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#080705] border-t border-[#1e1b16]"
          >
            <nav className="px-8 py-7 flex flex-col gap-6">
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
