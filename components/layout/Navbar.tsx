'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import { Sun, Moon, Menu, X, Coffee } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { lang, setLang } = useLang()
  const [mobileOpen, setMobileOpen] = useState(false)
  const tr = translations[lang]

  const links = [
    { href: '/', label: tr.home },
    { href: '/menu', label: tr.menu },
    { href: '/booking', label: tr.booking },
    { href: '/promotions', label: tr.promotions },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream-100/90 dark:bg-sage-950/90 backdrop-blur-md border-b border-cream-200 dark:border-sage-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-sage-600 flex items-center justify-center">
            <Coffee className="w-4 h-4 text-white" />
          </div>
          <span className="font-playfair font-semibold text-lg text-sage-800 dark:text-cream-100">
            HOS
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-sage-100 dark:bg-sage-800 text-sage-800 dark:text-cream-100'
                  : 'text-sage-600 dark:text-sage-300 hover:text-sage-900 dark:hover:text-cream-100 hover:bg-sage-50 dark:hover:bg-sage-800/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <button
            onClick={() => setLang(lang === 'ru' ? 'tk' : 'ru')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-sage-300 dark:border-sage-600 text-sage-700 dark:text-sage-200 hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors"
          >
            {lang === 'ru' ? 'TK' : 'RU'}
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-sage-600 dark:text-sage-300 hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-sage-600 dark:text-sage-300 hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="md:hidden border-t border-cream-200 dark:border-sage-800 bg-cream-100 dark:bg-sage-950"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-sage-100 dark:bg-sage-800 text-sage-800 dark:text-cream-100'
                      : 'text-sage-600 dark:text-sage-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
