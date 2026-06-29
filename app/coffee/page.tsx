'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useLang } from '@/components/providers/LangProvider'
import { ArrowRight, MapPin, Clock, Phone, Coffee, Leaf, Wind } from 'lucide-react'

// ── Color tokens (inverted from Lounge) ──────────────────
const BG      = '#f5f4f0'
const SURFACE = '#edeae2'
const TEXT    = '#1a1a1a'
const MUTED   = '#8a857e'
const SAGE    = '#7a8c75'
const SAGE_DIM = 'rgba(122,140,117,0.6)'
const BORDER  = 'rgba(0,0,0,0.08)'

// ── Menu data ────────────────────────────────────────────
const MENU_CATS = [
  {
    categoryRu: 'КОФЕ',
    categoryTk:  'KOFE',
    items: [
      { nameRu: 'Эспрессо',    nameTk: 'Espresso',   price: '15' },
      { nameRu: 'Американо',   nameTk: 'Americano',  price: '18' },
      { nameRu: 'Капучино',    nameTk: 'Cappuccino', price: '25' },
      { nameRu: 'Флэт уайт',  nameTk: 'Flat White', price: '28' },
      { nameRu: 'Латте',       nameTk: 'Latte',      price: '30' },
      { nameRu: 'Раф',         nameTk: 'Raf',        price: '32' },
    ],
  },
  {
    categoryRu: 'ЗАВТРАКИ',
    categoryTk:  'ERTIRLIK',
    items: [
      { nameRu: 'Круассан',         nameTk: 'Kruassan',          price: '22' },
      { nameRu: 'Авокадо тост',     nameTk: 'Awokado tost',      price: '45' },
      { nameRu: 'Яйца бенедикт',   nameTk: 'Ýumurtga Benedict', price: '55' },
      { nameRu: 'Каша',             nameTk: 'Ýüpek botuny',      price: '30' },
    ],
  },
  {
    categoryRu: 'ДЕСЕРТЫ',
    categoryTk:  'SÜÝJÜLIK',
    items: [
      { nameRu: 'Тирамису',  nameTk: 'Tiramisu', price: '35' },
      { nameRu: 'Чизкейк',  nameTk: 'Çizkek',   price: '32' },
      { nameRu: 'Брауни',   nameTk: 'Brauni',    price: '28' },
    ],
  },
]

export default function CoffeePage() {
  const { lang } = useLang()
  const ru = lang === 'ru'
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY    = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cleanup: (() => void) | undefined
    ;(async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsap.utils.toArray<HTMLElement>('[data-animate-c]').forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 40, duration: 1, ease: 'power2.out',
          delay: el.dataset.delay ? parseFloat(el.dataset.delay) : 0,
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        })
      })
      document.querySelectorAll<HTMLElement>('[data-count-c]').forEach(el => {
        const target = parseInt(el.dataset.countC || '0')
        const obj = { n: 0 }
        ScrollTrigger.create({
          trigger: el, start: 'top 80%', once: true,
          onEnter: () => gsap.to(obj, {
            n: target, duration: 1.5, ease: 'power1.out', snap: { n: 1 },
            onUpdate() { el.textContent = String(Math.round(obj.n)) },
          }),
        })
      })
      cleanup = () => ScrollTrigger.getAll().forEach(t => t.kill())
    })()
    return () => cleanup?.()
  }, [])

  const Divider = () => (
    <div style={{ height: '1px', background: BORDER, margin: 0 }} />
  )

  return (
    <div style={{ background: BG, color: TEXT }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
          <Image
            src="/images/hero.jpg"
            alt="HOŞ Coffee"
            fill priority quality={90}
            className="object-cover object-center"
          />
        </motion.div>
        {/* Light cream overlay — inverse of dark lounge overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(245,244,240,0.94) 45%, rgba(245,244,240,0.55) 100%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(245,244,240,0.7) 0%, transparent 50%)',
        }} />

        <motion.div style={{ opacity: fadeOut }}
          className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 md:px-20 max-w-4xl"
        >
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.45em', textTransform: 'uppercase', color: SAGE, display: 'block', marginBottom: '28px' }}>
              {ru ? 'КОФЕЙНЯ · АШХАБАД' : 'KOFEHANA · AŞGABAT'}
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(90px, 14vw, 180px)', fontWeight: 300, lineHeight: 0.85, color: TEXT, letterSpacing: '-0.02em', margin: 0 }}>
              HOŞ
            </h1>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(44px, 7vw, 90px)', fontWeight: 300, fontStyle: 'italic', color: SAGE, lineHeight: 1, marginBottom: '44px' }}>
              Coffee
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#menu" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                background: SAGE, color: '#fff',
                padding: '14px 32px',
                fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase',
                transition: 'background 0.25s', cursor: 'pointer', textDecoration: 'none',
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#6b7f67')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = SAGE)}
              >
                {ru ? 'СМОТРЕТЬ МЕНЮ' : 'MENÝUNY GÖR'}
                <ArrowRight size={14} />
              </a>
              <a href="#booking" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                border: `1px solid ${SAGE}`, color: TEXT,
                padding: '14px 32px',
                fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase',
                transition: 'all 0.25s', cursor: 'pointer', textDecoration: 'none',
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = `rgba(122,140,117,0.08)`)}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                {ru ? 'ЗАБРОНИРОВАТЬ' : 'ZAKAZ ETMEK'}
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats row — cream bg instead of dark */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9 }}
          className="absolute bottom-0 left-0 right-0"
          style={{ borderTop: `1px solid ${BORDER}`, background: 'rgba(245,244,240,0.85)', backdropFilter: 'blur(12px)' }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-3 divide-x" style={{ '--tw-divide-color': BORDER } as any}>
            {[
              { count: 2,  label: ru ? 'ЗОНЫ'    : 'ZONALAR' },
              { count: 38, label: ru ? 'ПОЗИЦИЙ' : 'POZISIÝA' },
              { count: 0,  label: ru ? 'ЧАСЫ'    : 'SAGAT', display: '08–22' },
            ].map((s, i) => (
              <div key={i} className="py-4 sm:py-6 flex flex-col items-center gap-1">
                {s.count > 0
                  ? <span data-count-c={s.count} style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px,5vw,48px)', fontWeight: 300, color: SAGE, lineHeight: 1 }}>0</span>
                  : <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px,5vw,48px)', fontWeight: 300, color: SAGE, lineHeight: 1 }}>{s.display}</span>
                }
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(7px,2vw,9px)', fontWeight: 500, letterSpacing: '0.2em', color: MUTED }}>{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          TWO VENUES
      ══════════════════════════════════════ */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 0', background: SURFACE }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-20">

          <div className="text-center mb-12" data-animate-c>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.5em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '16px' }}>
              {ru ? 'НАШИ ЗАВЕДЕНИЯ' : 'BIZIŇ KÄRHANALARYMYZ'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, color: TEXT, letterSpacing: '-0.01em' }}>
              {ru ? 'Два места — одна семья' : 'Iki ýer — bir maşgala'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: BORDER }} data-animate-c data-delay="0.1">

            {/* HOŞ COFFEE — current page */}
            <div className="relative group flex flex-col items-center justify-center text-center p-10 md:p-16 overflow-hidden"
              style={{ background: BG, minHeight: '420px' }}>
              {/* Sage glow */}
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(122,140,117,0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', height: '40px', background: `linear-gradient(to bottom, ${SAGE}, transparent)` }} />

              <div className="relative mb-8" style={{ width: 'clamp(120px,20vw,180px)', aspectRatio: '1/1' }}>
                <Image
                  src="/images/hoscoffee.webp"
                  alt="HOŞ Coffee"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  style={{ mixBlendMode: 'multiply', filter: 'brightness(0.9) contrast(1.1)' }}
                />
              </div>

              <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.5em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '12px' }}>
                {ru ? 'КОФЕЙНЯ' : 'KOFEHANA'}
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 300, color: TEXT, lineHeight: 0.95, marginBottom: '16px' }}>
                HOŞ<br /><em style={{ color: SAGE, fontSize: '0.65em' }}>Coffee</em>
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 300, color: MUTED, lineHeight: 1.7, maxWidth: '280px', marginBottom: '32px' }}>
                {ru ? 'Третья волна кофе, уютная атмосфера, свежие зёрна.' : 'Üçünji tolkun kofe, amatly atmosfera, täze däneler.'}
              </p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: SAGE, border: `1px solid rgba(122,140,117,0.4)`,
                padding: '10px 24px',
              }}>
                {ru ? 'ВЫ ЗДЕСЬ' : 'SIZ BU ÝERDE'}
              </span>
            </div>

            {/* HOŞ LOUNGE — link */}
            <Link href="/" className="relative group flex flex-col items-center justify-center text-center p-10 md:p-16 overflow-hidden"
              style={{ background: '#0a0a0a', minHeight: '420px', textDecoration: 'none', display: 'flex' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none', opacity: 0.5, transition: 'opacity 0.5s' }} className="group-hover:!opacity-100" />
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', height: '0px', background: 'linear-gradient(to bottom, rgba(201,168,76,0.8), transparent)', transition: 'height 0.4s' }} className="group-hover:!h-[40px]" />

              <div className="relative mb-8" style={{ width: 'clamp(120px,20vw,180px)', aspectRatio: '1/1' }}>
                <Image
                  src="/images/hoslounge.jpg"
                  alt="HOŞ Lounge"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  style={{ mixBlendMode: 'screen', filter: 'brightness(1.05) contrast(1.1)' }}
                />
              </div>

              <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.5em', textTransform: 'uppercase', color: '#5a5042', display: 'block', marginBottom: '12px' }}>
                {ru ? 'ЛАУНДЖ' : 'LOUNGE'}
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 300, color: '#FAFAF8', lineHeight: 0.95, marginBottom: '16px' }}>
                HOŞ<br /><em style={{ color: '#C9A84C', fontSize: '0.65em' }}>Lounge</em>
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 300, color: '#6B6B6B', lineHeight: 1.7, maxWidth: '280px', marginBottom: '32px' }}>
                {ru ? 'Индустриальная эстетика, авторский кофе, три зоны отдыха.' : 'Industrial estetika, awtor kofe, üç dynç alyş zonamyz.'}
              </p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.8)', border: '1px solid rgba(201,168,76,0.3)',
                padding: '10px 24px', transition: 'all 0.3s',
              }}
                className="group-hover:border-[rgba(201,168,76,0.7)] group-hover:text-[rgba(201,168,76,1)]"
              >
                {ru ? 'ПЕРЕЙТИ →' : 'GIT →'}
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          MARQUEE — sage green (inverse of gold)
      ══════════════════════════════════════ */}
      <div style={{ background: SAGE, overflow: 'hidden', padding: '13px 0' }}>
        <div className="flex animate-marquee whitespace-nowrap select-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="mx-8" style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#fff' }}>
              Good Morning &nbsp;·&nbsp; Freshly Roasted &nbsp;·&nbsp; Third Wave &nbsp;·&nbsp; Specialty Coffee &nbsp;·&nbsp; #HOŞCoffee
            </span>
          ))}
        </div>
      </div>

      <Divider />

      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      <section id="about" style={{ padding: 'clamp(60px, 10vw, 120px) 0', background: BG }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

          <div data-animate-c>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: SAGE, display: 'block', marginBottom: '20px' }}>
              {ru ? 'О НАС' : 'BIZ HAKDA'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, lineHeight: 1.1, color: TEXT, marginBottom: '28px' }}>
              {ru
                ? <>Место, где каждая чашка —<br /><em style={{ color: SAGE }}>искусство</em></>
                : <>Her käse —<br /><em style={{ color: SAGE }}>sungat eseri</em></>}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.9, color: MUTED, fontSize: '15px', marginBottom: '16px', maxWidth: '440px' }}>
              {ru
                ? 'HOŞ Coffee — это не просто кофейня. Это пространство, где каждая чашка создаётся с любовью и вниманием к деталям. Мы работаем только со свежеобжаренными зёрнами от лучших хозяйств мира.'
                : 'HOŞ Coffee — diňe bir kofehana däl. Bu ýerde her käse söýgi we jikme-jikliklere üns bilen taýýarlanýar. Biz dünýäniň iň gowy fermalaryndan täze gowrulan däneler bilen işleýäris.'}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.9, color: 'rgba(138,133,126,0.6)', fontSize: '14px', maxWidth: '420px' }}>
              {ru
                ? 'Авторский кофе, свежая выпечка, уютные зоны для работы и отдыха.'
                : 'Awtor kofe, täze çörek önümleri, iş we dynç alyş üçin amatly zonaları.'}
            </p>
          </div>

          <div data-animate-c data-delay="0.12" className="grid grid-cols-3 gap-0 self-center" style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '40px' }}>
            {[
              { count: 2,  label: ru ? 'Зоны'       : 'Zona' },
              { count: 38, label: ru ? 'Позиций'    : 'Menýu' },
              { count: 5,  label: ru ? 'Лет опыта'  : 'Ýyl tejribe' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '0 24px 0 0', borderRight: i < 2 ? `1px solid ${BORDER}` : 'none', marginLeft: i > 0 ? '24px' : 0 }}>
                <div data-count-c={s.count} style={{ fontFamily: 'var(--font-heading)', fontSize: '56px', fontWeight: 300, color: SAGE, lineHeight: 1 }}>0</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: MUTED, marginTop: '8px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          PHILOSOPHY — light sage bg (inverse of dark #0d0d0d)
      ══════════════════════════════════════ */}
      <section style={{ padding: 'clamp(60px, 10vw, 120px) 0', background: SURFACE }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-20 text-center" data-animate-c>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.45em', textTransform: 'uppercase', color: SAGE, display: 'block', marginBottom: '24px' }}>
            {ru ? 'ФИЛОСОФИЯ' : 'FILOSOFIÝA'}
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(52px, 10vw, 120px)', fontWeight: 300, lineHeight: 0.9, color: TEXT, letterSpacing: '-0.02em', marginBottom: '24px' }}>
            #SPECIALTY
          </h2>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px,2.5vw,28px)', fontStyle: 'italic', color: SAGE }}>
            Freshness &amp; Craft — The Third Wave Way
          </p>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          MENU
      ══════════════════════════════════════ */}
      <section id="menu" style={{ padding: 'clamp(60px, 10vw, 120px) 0', background: BG }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-20">

          <div className="text-center mb-16" data-animate-c>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: SAGE, display: 'block', marginBottom: '20px' }}>
              {ru ? 'МЕНЮ' : 'MENÝU'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, color: TEXT, lineHeight: 1.05, marginBottom: '4px' }}>
              {ru ? 'Наш выбор' : 'Biziň saýlawymyz'}
            </h2>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, fontStyle: 'italic', color: SAGE, lineHeight: 1.05 }}>
              {ru ? 'свежее каждый день' : 'Her gün täze'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: BORDER }}>
            {MENU_CATS.map((cat, ci) => (
              <motion.div key={ci}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.1, duration: 0.7 }}
                style={{ background: BG, padding: '36px 32px' }}
              >
                {/* Category header */}
                <div style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '32px', height: '1px', background: SAGE, marginBottom: '12px' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.4em', textTransform: 'uppercase', color: SAGE }}>
                    {ru ? cat.categoryRu : cat.categoryTk}
                  </span>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-4">
                  {cat.items.map((item, ii) => (
                    <div key={ii} className="flex justify-between items-baseline gap-4">
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 300, color: TEXT, lineHeight: 1.4 }}>
                        {ru ? item.nameRu : item.nameTk}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 400, color: SAGE, flexShrink: 0 }}>
                        {item.price} <span style={{ fontSize: '10px', opacity: 0.7 }}>TMT</span>
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12" data-animate-c data-delay="0.2">
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 300, color: MUTED, marginBottom: '24px' }}>
              {ru ? 'Полное меню доступно в заведении' : 'Doly menýu kärhanada elýeterlidir'}
            </p>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          FEATURES — 3 cards (inverse style)
      ══════════════════════════════════════ */}
      <section style={{ padding: 'clamp(60px, 10vw, 120px) 0', background: SURFACE }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12" data-animate-c>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.45em', textTransform: 'uppercase', color: SAGE, display: 'block', marginBottom: '16px' }}>
              {ru ? 'ПОЧЕМУ МЫ' : 'NÄME ÜÇIN BIZ'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, color: TEXT }}>
              {ru ? 'В деталях — разница' : 'Jikme-jikliklerde tapawut'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: BORDER }}>
            {[
              { icon: Coffee, titleRu: 'Авторский кофе', titleTk: 'Awtor kofe', descRu: 'Моносорта и купажи от ведущих обжарщиков мира — свежие каждую неделю.', descTk: 'Dünýäniň öňdebaryjy gowurujylaryndan monosortlar — her hepde täze.' },
              { icon: Leaf,   titleRu: 'Натуральный состав', titleTk: 'Tebigy düzüm', descRu: 'Только свежие ингредиенты, никаких консервантов, никаких компромиссов.', descTk: 'Diňe täze ingredientler, hiç hili konserwant, hiç hili kompromiss.' },
              { icon: Wind,   titleRu: 'Уютная атмосфера', titleTk: 'Amatly atmosfera', descRu: 'Два зала для работы, встреч и неспешного кофе в любое время дня.', descTk: 'Günüň islendik wagtynda iş, duşuşyk we kofe üçin iki zal.' },
            ].map(({ icon: Icon, titleRu, titleTk, descRu, descTk }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="flex flex-col items-start gap-5 p-8"
                style={{ background: BG }}
              >
                <div style={{ width: 44, height: 44, border: `1px solid rgba(122,140,117,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} style={{ color: SAGE_DIM }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 300, color: TEXT, marginBottom: '10px' }}>
                    {ru ? titleRu : titleTk}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 300, color: MUTED, lineHeight: 1.7 }}>
                    {ru ? descRu : descTk}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          BOOKING / CONTACT CTA
      ══════════════════════════════════════ */}
      <section id="booking" style={{ padding: 'clamp(60px, 10vw, 120px) 0', background: BG }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          <div data-animate-c>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: SAGE, display: 'block', marginBottom: '20px' }}>
              {ru ? 'БРОНИРОВАНИЕ' : 'ZAKAZ'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, color: TEXT, lineHeight: 1.05, marginBottom: '4px' }}>
              {ru ? 'Зарезервируйте' : 'Stolyňyzy'}
            </h2>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, fontStyle: 'italic', color: SAGE, lineHeight: 1.05, marginBottom: '28px' }}>
              {ru ? 'ваш столик' : 'zakaz ediň'}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.9, color: MUTED, fontSize: '15px', maxWidth: '380px', marginBottom: '36px' }}>
              {ru
                ? 'Свяжитесь с нами по телефону или напишите в Telegram — мы подберём удобное время и лучший столик.'
                : 'Telefon ýa-da Telegram arkaly biziň bilen habarlaşyň — size amatly wagt we iň gowy stoljagy saýlarys.'}
            </p>
            <a href="tel:+99362000000" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              background: SAGE, color: '#fff',
              padding: '14px 32px',
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase',
              transition: 'background 0.25s', cursor: 'pointer', textDecoration: 'none',
            }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#6b7f67')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = SAGE)}
            >
              <Phone size={14} />
              {ru ? 'ПОЗВОНИТЬ' : 'JAŇ ET'}
            </a>
          </div>

          <div className="space-y-3" data-animate-c data-delay="0.1">
            {[
              { icon: MapPin, labelRu: 'АДРЕС',       labelTk: 'SALGY',    valRu: 'Ашхабад, Туркменистан',    valTk: 'Aşgabat, Türkmenistan' },
              { icon: Clock,  labelRu: 'ЧАСЫ РАБОТЫ', labelTk: 'IŞ WAGTY', valRu: 'Ежедневно 08:00 – 22:00', valTk: 'Her gün 08:00 – 22:00' },
              { icon: Phone,  labelRu: 'ТЕЛЕФОН',     labelTk: 'TELEFON',  valRu: '+993 62 XXXXXX',           valTk: '+993 62 XXXXXX' },
            ].map(({ icon: Icon, labelRu, labelTk, valRu, valTk }, i) => (
              <div key={i} className="flex items-center gap-5 px-6 py-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <div style={{ width: 40, height: 40, border: `1px solid rgba(122,140,117,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} style={{ color: SAGE }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: MUTED, marginBottom: '3px' }}>
                    {ru ? labelRu : labelTk}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 300, color: TEXT }}>
                    {ru ? valRu : valTk}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          FOOTER — light themed
      ══════════════════════════════════════ */}
      <footer style={{ background: SURFACE, borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-14 mb-12">

            {/* Brand */}
            <div>
              <div className="flex flex-col items-start leading-none mb-6">
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', color: SAGE, letterSpacing: '0.04em', lineHeight: 1 }}>HOŞ</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: SAGE_DIM, letterSpacing: '0.45em', textTransform: 'uppercase', marginTop: '4px' }}>COFFEE</span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 300, color: MUTED, lineHeight: 1.8, maxWidth: '220px' }}>
                {ru ? 'Место для тех, кто ценит настоящий кофе.' : 'Hakyky kofe bilen gyzyklanýanlar üçin ýer.'}
              </p>
            </div>

            {/* Links */}
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: MUTED, marginBottom: '16px' }}>
                {ru ? 'НАВИГАЦИЯ' : 'NAWİGASIÝA'}
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { href: '#about',   labelRu: 'О нас',         labelTk: 'Biz hakda' },
                  { href: '#menu',    labelRu: 'Меню',          labelTk: 'Menýu' },
                  { href: '#booking', labelRu: 'Бронирование',  labelTk: 'Zakaz' },
                  { href: '/',        labelRu: 'HOŞ Lounge ↗',  labelTk: 'HOŞ Lounge ↗' },
                ].map(l => (
                  <a key={l.href} href={l.href} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 300, color: MUTED, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = SAGE)}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = MUTED)}
                  >
                    {ru ? l.labelRu : l.labelTk}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: MUTED, marginBottom: '16px' }}>
                {ru ? 'КОНТАКТЫ' : 'HABARLAŞMAK'}
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Ашхабад, Туркменистан' },
                  { label: '+993 62 XXXXXX' },
                  { label: ru ? 'Ежедневно 08:00 – 22:00' : 'Her gün 08:00 – 22:00' },
                ].map((c, i) => (
                  <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 300, color: MUTED }}>{c.label}</p>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 300, color: MUTED, letterSpacing: '0.2em' }}>
              © {new Date().getFullYear()} HOŞ Coffee
            </p>
            <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED, textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = SAGE)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = MUTED)}
            >
              HOŞ Lounge ↗
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
