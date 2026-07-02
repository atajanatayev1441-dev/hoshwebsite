'use client'

import Link from 'next/link'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import { MapPin, Phone, Clock, Instagram } from 'lucide-react'

export function Footer() {
  const { lang } = useLang()
  const tr = translations[lang]
  const ru = lang === 'ru'

  return (
    <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>

      {/* Top info strip */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-2 text-center">
          {[
            ru ? 'Ежедневно 09:00 – 23:00' : 'Her gün 09:00 – 23:00',
            ru ? 'ул. Держинского 143, напротив Цирка' : 'Jerjinskiý köç. 143, Sirkiň garşysynda',
            '+993 71 66 7777',
          ].map((text, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-14">

          {/* Brand */}
          <div>
            <div className="mb-6">
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 300, letterSpacing: '0.15em', color: 'var(--white)', display: 'block', lineHeight: 1 }}>
                HOS
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginTop: '4px' }}>
                Lounge
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '220px' }}>
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
                  <Link href={l.href} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.05em', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
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
                { Icon: MapPin, text: ru ? 'ул. Держинского 143, напротив Цирка' : 'Jerjinskiý köç. 143, Sirkiň garşysynda' },
                { Icon: Phone,  text: '+993 71 66 7777' },
                { Icon: Clock,  text: ru ? 'Ежедневно 09:00 – 23:00' : 'Her gün 09:00 – 23:00' },
              ].map(({ Icon, text }, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Icon style={{ width: '14px', height: '14px', color: 'var(--gold)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--muted)' }}>{text}</span>
                </li>
              ))}
            </ul>
            <a href="https://www.instagram.com/hos_lounge_ashgabat" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              style={{ display: 'inline-flex', marginTop: '24px', width: '36px', height: '36px', border: '1px solid var(--border-2)', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}>
              <Instagram style={{ width: '16px', height: '16px' }} />
            </a>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--muted-xlo)', letterSpacing: '0.15em' }}>
            © {new Date().getFullYear()} HOŞ Coffee Lounge
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--muted-xlo)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Brutalism &amp; Beans · The Industrial Way
          </p>
        </div>
      </div>
    </footer>
  )
}
