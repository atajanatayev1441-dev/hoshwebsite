'use client'

import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import { MapPin, Phone, Clock, Instagram } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const { lang } = useLang()
  const tr = translations[lang]

  return (
    <footer className="bg-sage-800 dark:bg-sage-950 text-cream-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-playfair text-xl font-semibold mb-3">HOS Coffee Lounge</h3>
            <p className="text-cream-300 text-sm leading-relaxed">{tr.heroTagline}</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-cream-200">Контакты</h4>
            <ul className="space-y-3 text-sm text-cream-300">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sage-400 flex-shrink-0" />
                {tr.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sage-400 flex-shrink-0" />
                {tr.phone}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sage-400 flex-shrink-0" />
                {tr.hours}
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-cream-200">{tr.followUs}</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-sage-700 hover:bg-sage-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <div className="mt-6 flex flex-col gap-1 text-sm text-cream-400">
              <Link href="/menu" className="hover:text-cream-200 transition-colors">{tr.menu}</Link>
              <Link href="/booking" className="hover:text-cream-200 transition-colors">{tr.booking}</Link>
              <Link href="/promotions" className="hover:text-cream-200 transition-colors">{tr.promotions}</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-sage-700 text-center text-sm text-cream-500">
          © {new Date().getFullYear()} HOS Coffee Lounge
        </div>
      </div>
    </footer>
  )
}
