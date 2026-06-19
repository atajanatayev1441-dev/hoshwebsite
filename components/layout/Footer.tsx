'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import { MapPin, Phone, Clock, Instagram } from 'lucide-react'

export function Footer() {
  const { lang } = useLang()
  const tr = translations[lang]

  return (
    <footer className="bg-carbon-950 border-t border-carbon-800">
      {/* Top bar */}
      <div className="border-b border-carbon-800 py-6 px-8 md:px-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-concrete-500 text-xs tracking-[0.2em] uppercase font-light">
            {lang === 'ru' ? 'Ежедневно 09:00 – 23:00' : 'Her gün 09:00 – 23:00'}
          </p>
          <div className="w-px h-4 bg-carbon-700 hidden sm:block" />
          <p className="text-concrete-500 text-xs tracking-[0.2em] uppercase font-light">
            {lang === 'ru' ? 'Ашхабад, Туркменистан' : 'Aşgabat, Türkmenistan'}
          </p>
          <div className="w-px h-4 bg-carbon-700 hidden sm:block" />
          <p className="text-concrete-500 text-xs tracking-[0.2em] uppercase font-light">
            +993 62 XXXXXX
          </p>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-8 md:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="relative w-20 h-20 logo-blend mb-4">
              <Image src="/images/logo.png" alt="HOS Lounge" fill className="object-contain" />
            </div>
            <p className="text-concrete-500 text-sm leading-relaxed font-light max-w-xs">
              {lang === 'ru'
                ? 'Brutalism & Beans — пространство где индустриальная эстетика встречается с безупречным кофе'
                : 'Brutalism & Beans — industrial estetikasy kämil kofe bilen duşuşýan mekan'}
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500 mb-6">
              {lang === 'ru' ? 'Навигация' : 'Nawigasiýa'}
            </p>
            <ul className="space-y-3">
              {[
                { href: '/menu', label: tr.menu },
                { href: '/booking', label: tr.booking },
                { href: '/promotions', label: tr.promotions },
                { href: '/admin', label: 'Admin' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-concrete-500 hover:text-gold-400 text-sm transition-colors tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500 mb-6">
              {lang === 'ru' ? 'Контакты' : 'Habarlaşmak'}
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="text-concrete-500 text-sm">{tr.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span className="text-concrete-500 text-sm">{tr.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span className="text-concrete-500 text-sm">{tr.hours}</span>
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="w-9 h-9 border border-carbon-700 hover:border-gold-500 flex items-center justify-center text-concrete-500 hover:text-gold-400 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-carbon-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-concrete-600 text-xs tracking-widest">
            © {new Date().getFullYear()} HOS Coffee Lounge. All rights reserved.
          </p>
          <p className="text-concrete-700 text-xs">
            BRUTALISM &amp; BEANS · THE INDUSTRIAL WAY
          </p>
        </div>
      </div>
    </footer>
  )
}
