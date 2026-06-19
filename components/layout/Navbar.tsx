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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const tr = translations[lang]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/', label: tr.home },
    { href: '/menu', label: tr.menu },
    { href: '/booking', label: tr.booking },
    { href: '/promotions', label: tr.promotions },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-carbon-950/95 backdrop-blur-md border-b border-carbon-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative w-16 h-16 logo-blend">
            <Image
              src="/images/logo.png"
              alt="HOS Lounge"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200 ${
                isActive(link.href)
                  ? 'text-gold-400'
                  : 'text-concrete-300 hover:text-concrete-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === 'ru' ? 'tk' : 'ru')}
            className="text-xs font-semibold tracking-widest text-concrete-400 hover:text-gold-400 transition-colors uppercase"
          >
            {lang === 'ru' ? 'TK' : 'RU'}
          </button>

          <Link
            href="/booking"
            className="hidden md:block btn-gold text-[10px] py-2.5 px-5"
          >
            {tr.bookTable}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-concrete-300 hover:text-concrete-100 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-carbon-950 border-t border-carbon-800"
          >
            <nav className="px-6 py-6 flex flex-col gap-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-semibold tracking-[0.2em] uppercase ${
                    isActive(link.href) ? 'text-gold-400' : 'text-concrete-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/booking"
                onClick={() => setMobileOpen(false)}
                className="btn-gold text-center mt-2"
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
