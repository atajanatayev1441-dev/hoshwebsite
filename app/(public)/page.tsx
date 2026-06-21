'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import { ArrowRight, MapPin, Clock, Phone } from 'lucide-react'

const H = ({ tag = 'h2', className = '', style = {}, children }: any) => {
  const Tag = tag
  return <Tag className={className} style={{ fontFamily: 'var(--font-heading)', fontWeight: 300, ...style }}>{children}</Tag>
}
const Label = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '16px' }}>
    {children}
  </span>
)
const Body = ({ children, style = {} }: any) => (
  <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.85, color: 'var(--muted)', ...style }}>{children}</p>
)

export default function HomePage() {
  const { lang } = useLang()
  const tr = translations[lang]
  const ru = lang === 'ru'
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY   = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)

    gsap.utils.toArray<HTMLElement>('[data-animate]').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 40, duration: 1, ease: 'power2.out',
        delay: (el.dataset.delay ? parseFloat(el.dataset.delay) : 0),
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      })
    })

    // count-up
    document.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count || '0')
      const obj = { n: 0 }
      ScrollTrigger.create({
        trigger: el, start: 'top 80%', once: true,
        onEnter: () => gsap.to(obj, {
          n: target, duration: 1.5, ease: 'power1.out', snap: { n: 1 },
          onUpdate() { el.textContent = String(Math.round(obj.n)) },
        }),
      })
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--white)' }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
          <Image
            src="/images/hero.jpg"
            alt="HOS Lounge"
            fill priority quality={95}
            className="object-cover object-center"
          />
        </motion.div>

        {/* Gradient: dark left, lighter right */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(10,10,10,0.92) 45%, rgba(10,10,10,0.4) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)'
        }} />

        {/* Content — left side */}
        <motion.div
          style={{ opacity: fadeOut }}
          className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 max-w-4xl"
        >
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '32px' }}>
              {ru ? 'КОФЕ · ЛАУНДЖ · АШХАБАД' : 'KOFE · LOUNGE · AŞGABAT'}
            </span>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(90px, 14vw, 180px)', fontWeight: 300, lineHeight: 0.85, color: 'var(--white)', letterSpacing: '-0.02em', margin: 0 }}>
              HOS
            </h1>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(44px, 7vw, 90px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--gold)', lineHeight: 1, marginBottom: '48px' }}>
              Lounge
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/menu" className="btn-gold group">
                {ru ? 'СМОТРЕТЬ МЕНЮ' : 'MENÝUNY GÖR'}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/booking" className="btn-outline">
                {ru ? 'ЗАБРОНИРОВАТЬ' : 'ZAKAZ ETMEK'}
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats row — bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9 }}
          className="absolute bottom-0 left-0 right-0 px-8 md:px-20"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-3 divide-x" style={{ '--tw-divide-opacity': 1 } as any}>
            {[
              { num: 3,       label: ru ? 'ЗОНЫ'    : 'ZONALAR',  suffix: '' },
              { num: 47,      label: ru ? 'ПОЗИЦИЙ' : 'POZISIÝA', suffix: '' },
              { num: null,    label: ru ? 'ЧАСЫ'    : 'SAGAT',    display: '09–23' },
            ].map((s, i) => (
              <div key={i} className="py-6 flex flex-col items-center gap-1" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {s.num !== null ? (
                  <span data-count={s.num} style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>0</span>
                ) : (
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>{s.display}</span>
                )}
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.3em', color: 'var(--muted)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>


      {/* ══════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════ */}
      <div style={{ background: 'var(--gold)', overflow: 'hidden', padding: '12px 0' }}>
        <div className="flex animate-marquee whitespace-nowrap select-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="mx-8" style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--bg)' }}>
              Wake Up &nbsp;·&nbsp; Drink Coffee &nbsp;·&nbsp; Create &nbsp;·&nbsp; #Industrial &nbsp;·&nbsp; Brutalism &amp; Beans
            </span>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════
          ABOUT — 50/50
      ══════════════════════════════════════ */}
      <section style={{ padding: '120px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">

          {/* Left: text */}
          <div className="flex flex-col justify-center pr-0 lg:pr-20" data-animate>
            <Label>{ru ? 'О НАС' : 'BIZ HAKDA'}</Label>
            <H style={{ fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 1.1, color: 'var(--white)', marginBottom: '28px' }}>
              {ru ? <>Место, где каждая<br />чашка —{' '}<em style={{ color: 'var(--gold)' }}>искусство</em></> : <>Her käse —<br /><em style={{ color: 'var(--gold)' }}>sungat eseri</em></>}
            </H>
            <Body style={{ fontSize: '15px', marginBottom: '16px', maxWidth: '420px' }}>
              {ru
                ? 'HOS Lounge — пространство с уникальным индустриальным характером. Открытый кирпич, бетонные стены, тёплый свет ламп и безупречный кофе создают атмосферу, в которую хочется возвращаться.'
                : 'HOS Lounge — özboluşly industrial häsiýetli giňişlik. Açyk kerpiç, beton diwarlary we kämil kofe yzyna gaýtmak isleýän atmosfera döredýär.'}
            </Body>
            <Body style={{ fontSize: '14px', maxWidth: '400px' }}>
              {ru ? 'Авторский кофе, изысканные десерты, три зоны: основной зал, VIP и открытая терраса.' : 'Awtor kofe, ajaýyp süýjülikler, üç zona: esasy zal, VIP we açyk taras.'}
            </Body>
          </div>

          {/* Right: ONE photo, no cards */}
          <div data-animate data-delay="0.15" className="relative min-h-[480px] lg:min-h-0" style={{ aspectRatio: '4/5' }}>
            <Image
              src="/images/photo_2026-06-19_18-49-24.jpg"
              alt="HOS interior"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          PHILOSOPHY — full width 60vh
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: '60vh' }}>
        <Image src="/images/photo_2026-06-19_18-49-30.jpg" alt="#INDUSTRIAL" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.85)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" data-animate>
          <H tag="h2" style={{ fontSize: 'clamp(48px, 10vw, 100px)', lineHeight: 0.9, color: 'var(--white)', letterSpacing: '-0.02em', marginBottom: '20px' }}>
            #INDUSTRIAL
          </H>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(16px, 2vw, 24px)', fontStyle: 'italic', color: 'var(--gold)' }}>
            Brutalism &amp; Beans — The Industrial Way
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════
          GALLERY — CSS Grid, no cards
      ══════════════════════════════════════ */}
      <section style={{ padding: '100px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-20">
          <div className="mb-12" data-animate>
            <Label>{ru ? 'АТМОСФЕРА' : 'ATMOSFERA'}</Label>
            <H style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--white)' }}>
              {ru ? 'Интерьер' : 'Interior'}
            </H>
          </div>

          {/* Row 1: large (2/3) + tall (1/3) */}
          <div className="grid grid-cols-3 gap-[2px] mb-[2px]">
            <div className="col-span-2 relative overflow-hidden group" style={{ aspectRatio: '16/9' }}>
              <Image src="/images/interior.jpg" alt="interior" fill className="object-cover transition-all duration-500 group-hover:brightness-110" />
            </div>
            <div className="relative overflow-hidden group" style={{ aspectRatio: '9/16' }}>
              <Image src="/images/art-wall.jpg" alt="art wall" fill className="object-cover transition-all duration-500 group-hover:brightness-110" />
              <div className="absolute bottom-4 left-4">
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  {ru ? 'Арт-стена' : 'Sungat diwary'}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: three equal cells */}
          <div className="grid grid-cols-3 gap-[2px]" data-animate>
            {[
              { src: '/images/brick.jpg',       alt: ru ? 'Детали' : 'Jikme-jikler' },
              { src: '/images/lamp.jpg',        alt: ru ? 'Свет'   : 'Yşyk' },
              { src: '/images/photo_2026-06-19_18-49-22.jpg', alt: ru ? 'Бар' : 'Bar' },
            ].map((img, i) => (
              <div key={i} className="relative overflow-hidden group" style={{ aspectRatio: '1/1' }}>
                <Image src={img.src} alt={img.alt} fill className="object-cover transition-all duration-500 group-hover:brightness-110" />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          BOOKING CTA
      ══════════════════════════════════════ */}
      <section style={{ padding: '120px 0' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div data-animate>
            <Label>{ru ? 'БРОНИРОВАНИЕ' : 'ZAKAZ'}</Label>
            <H style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, color: 'var(--white)', marginBottom: '4px' }}>
              {ru ? 'Зарезервируйте' : 'Stolyňyzy'}
            </H>
            <H style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, fontStyle: 'italic', color: 'var(--gold)', marginBottom: '28px' }}>
              {ru ? 'ваш столик' : 'zakaz ediň'}
            </H>
            <Body style={{ fontSize: '15px', maxWidth: '380px', marginBottom: '36px' }}>
              {ru ? 'Три зоны для вашего отдыха. Подтверждение придёт по SMS — без ожидания у входа.' : 'Dynç almak üçin üç zona. Tassyklama SMS arkaly geler.'}
            </Body>
            <Link href="/booking" className="btn-gold group">
              {tr.bookTable}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: info cards */}
          <div className="space-y-3" data-animate data-delay="0.1">
            {[
              { icon: MapPin, labelRu: 'АДРЕС',       labelTk: 'SALGY',    valueRu: 'Ашхабад, Туркменистан',    valueTk: 'Aşgabat, Türkmenistan' },
              { icon: Clock,  labelRu: 'ЧАСЫ РАБОТЫ', labelTk: 'IŞ WAGTY', valueRu: 'Ежедневно 09:00 – 23:00', valueTk: 'Her gün 09:00 – 23:00' },
              { icon: Phone,  labelRu: 'ТЕЛЕФОН',     labelTk: 'TELEFON',  valueRu: '+993 62 XXXXXX',           valueTk: '+993 62 XXXXXX' },
            ].map(({ icon: Icon, labelRu, labelTk, valueRu, valueTk }, i) => (
              <div key={i} className="flex items-center gap-5 px-6 py-5" style={{ background: '#161616', border: '1px solid var(--border)' }}>
                <div style={{ width: 40, height: 40, border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} style={{ color: 'var(--gold)' }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '3px' }}>
                    {ru ? labelRu : labelTk}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 300, color: 'var(--white)' }}>
                    {ru ? valueRu : valueTk}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
