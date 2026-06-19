'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import { MapPin, Phone, Clock, Instagram } from 'lucide-react'

export function Footer() {
  const { lang } = useLang()
  const tr = translations[lang]
  const ru = lang === 'ru'

  return (
    <footer className="bg-[#0a0906] border-t border-[#1e1b16]">

      {/* Top info strip */}
      <div className="border-b border-[#1e1b16]">
        <div className="max-w-7xl mx-auto px-8 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-center">
          {[
            ru ? 'Ежедневно 09:00 – 23:00' : 'Her gün 09:00 – 23:00',
            ru ? 'Ашхабад, Туркменистан'   : 'Aşgabat, Türkmenistan',
            '+993 62 XXXXXX',
          ].map((text, i) => (
            <span key={i} className="font-body text-[11px] font-medium tracking-[0.2em] uppercase text-[#5c5852]">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14">

          {/* Brand */}
          <div>
            <div className="relative w-16 h-16 mb-6">
              <Image src="/images/logo.png" alt="HOS Lounge" fill className="object-contain logo-white" />
            </div>
            <p className="font-body text-sm text-[#5c5852] leading-relaxed max-w-[220px]">
              {ru
                ? 'Brutalism & Beans — где индустриальная эстетика встречается с безупречным кофе'
                : 'Brutalism & Beans — industrial estetikasy kämil kofe bilen duşuşýan mekan'}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="section-label mb-7">{ru ? 'Навигация' : 'Nawigasiýa'}</p>
            <ul className="space-y-4">
              {[
                { href: '/menu',       label: tr.menu },
                { href: '/booking',    label: tr.booking },
                { href: '/promotions', label: tr.promotions },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="font-body text-sm text-[#5c5852] hover:text-gold-400 tracking-wide transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="section-label mb-7">{ru ? 'Контакты' : 'Habarlaşmak'}</p>
            <ul className="space-y-4">
              {[
                { Icon: MapPin, text: ru ? 'Ашхабад, Туркменистан' : 'Aşgabat, Türkmenistan' },
                { Icon: Phone,  text: '+993 62 XXXXXX' },
                { Icon: Clock,  text: ru ? 'Ежедневно 09:00 – 23:00' : 'Her gün 09:00 – 23:00' },
              ].map(({ Icon, text }, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Icon className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                  <span className="font-body text-sm text-[#5c5852]">{text}</span>
                </li>
              ))}
            </ul>
            <a href="#" aria-label="Instagram"
              className="inline-flex mt-6 w-9 h-9 border border-[#3e3830] hover:border-gold-500 items-center justify-center text-[#5c5852] hover:text-gold-400 transition-all">
              <Instagram className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Bottom line */}
        <div className="mt-16 pt-8 border-t border-[#1e1b16] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-[11px] text-[#3e3830] tracking-widest">
            © {new Date().getFullYear()} HOS Coffee Lounge
          </p>
          <p className="font-body text-[11px] text-[#3e3830] tracking-widest uppercase">
            Brutalism &amp; Beans · The Industrial Way
          </p>
        </div>
      </div>
    </footer>
  )
}
