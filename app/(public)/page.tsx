'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import { InteriorCarousel } from '@/components/ui/InteriorCarousel'
import { ArrowRight, MapPin, Clock, Phone, ArrowDown } from 'lucide-react'

export default function HomePage() {
  const { lang } = useLang()
  const tr = translations[lang]
  const ru = lang === 'ru'
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Fade up
    gsap.utils.toArray<HTMLElement>('.g-up').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 64 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } }
      )
    })

    // Photo zoom-in
    gsap.utils.toArray<HTMLElement>('.g-photo').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, scale: 1.07 },
        { opacity: 1, scale: 1, duration: 1.3, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' } }
      )
    })

    // From left
    gsap.utils.toArray<HTMLElement>('.g-left').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -70 },
        { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%' } }
      )
    })

    // From right
    gsap.utils.toArray<HTMLElement>('.g-right').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: 70 },
        { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%' } }
      )
    })

    // Line reveal
    gsap.utils.toArray<HTMLElement>('.g-line').forEach(el => {
      gsap.fromTo(el,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 1.4, ease: 'power3.inOut',
          scrollTrigger: { trigger: el, start: 'top 90%' } }
      )
    })

    // Count-up
    document.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
      const target = parseInt(el.getAttribute('data-count') || '0', 10)
      const obj = { val: 0 }
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => gsap.to(obj, {
          val: target, duration: 2.2, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.val).toString() },
        }),
      })
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div style={{ background: '#0a0908', color: '#f5f0e8' }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: 1.1 }}>
          <Image src="/images/hero.jpg" alt="HOS Lounge" fill priority quality={95} className="object-cover object-center" />
        </motion.div>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(160deg, rgba(10,9,8,0.15) 0%, rgba(10,9,8,0.4) 45%, rgba(10,9,8,0.93) 100%)'
        }} />

        <motion.div style={{ opacity: heroOpacity }}
          className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-20 max-w-7xl mx-auto w-full"
        >
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            style={{ fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '11px',
              letterSpacing: '0.42em', textTransform: 'uppercase', color: '#C9A84C', display: 'block', marginBottom: '18px' }}
          >
            {ru ? 'Кофе-лаунж · Ашхабад' : 'Kofe Lounge · Aşgabat'}
          </motion.span>

          <motion.h1 initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: 'var(--font-italiana, Georgia, serif)',
              fontSize: 'clamp(80px, 14vw, 190px)', fontWeight: 400,
              lineHeight: 0.88, letterSpacing: '-0.01em', color: '#f5f0e8', margin: 0 }}
          >
            HOS
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)',
              fontSize: 'clamp(38px, 6.5vw, 92px)', fontWeight: 300, fontStyle: 'italic',
              lineHeight: 1, color: '#C9A84C', marginBottom: '40px' }}
          >
            Lounge
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78, duration: 0.9 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/menu" className="btn-gold group" style={{ letterSpacing: '0.2em' }}>
              {tr.viewMenu} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/booking" className="btn-outline" style={{ letterSpacing: '0.2em' }}>
              {tr.bookTable}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div animate={{ y: [0, 9, 0] }} transition={{ repeat: Infinity, duration: 1.9, ease: 'easeInOut' }}>
            <ArrowDown size={16} style={{ color: '#C9A84C' }} />
          </motion.div>
        </motion.div>
      </section>


      {/* ══════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════ */}
      <div style={{ background: '#C9A84C', overflow: 'hidden', padding: '13px 0' }}>
        <div className="flex animate-marquee whitespace-nowrap select-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="mx-8" style={{
              fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '10px',
              fontWeight: 600, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#0a0908',
            }}>
              Wake Up &nbsp;·&nbsp; Drink Coffee &nbsp;·&nbsp; Create &nbsp;·&nbsp; #Industrial &nbsp;·&nbsp; Brutalism &amp; Beans
            </span>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════
          LOGO SHOWCASE — 3D логотип
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: '72vh' }}>
        <div className="g-photo absolute inset-0">
          <Image src="/images/logo-wall.jpg" alt="HOS 3D logo" fill className="object-cover object-center" />
        </div>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(10,9,8,0.55) 0%, rgba(10,9,8,0.2) 40%, rgba(10,9,8,0.65) 100%)'
        }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="g-up" style={{
            fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '10px',
            letterSpacing: '0.45em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px',
          }}>
            {ru ? 'Наше место' : 'Biziň ýerimiz'}
          </p>
          <blockquote className="g-up" style={{
            fontFamily: 'var(--font-cormorant, Georgia, serif)',
            fontSize: 'clamp(24px, 4vw, 58px)', fontWeight: 300, fontStyle: 'italic',
            color: '#f5f0e8', lineHeight: 1.3, maxWidth: '760px',
          }}>
            {ru
              ? '"Где бетон встречается с красотой,\nа кофе — с искусством"'
              : '"Betonyň gözellik bilen, kofäniň sungat bilen duşuşýan ýeri"'}
          </blockquote>
        </div>
      </section>


      {/* ══════════════════════════════════════
          ABOUT — 2 колонки
      ══════════════════════════════════════ */}
      <section className="py-32 px-8 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-28 items-center">

          {/* Текст */}
          <div className="g-left">
            <div className="g-line mb-10 block" style={{ height: '1px', background: 'rgba(201,168,76,0.4)' }} />
            <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '10px',
              letterSpacing: '0.42em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '22px' }}>
              {ru ? 'О нас' : 'Biz hakda'}
            </p>
            <h2 style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)',
              fontSize: 'clamp(36px, 4.5vw, 62px)', fontWeight: 300, lineHeight: 1.1,
              color: '#f5f0e8', marginBottom: '28px' }}>
              {ru
                ? <>Место, где каждая чашка —<br /><em style={{ color: '#C9A84C', fontStyle: 'italic' }}>произведение искусства</em></>
                : <>Her käse bir<br /><em style={{ color: '#C9A84C', fontStyle: 'italic' }}>sungat eseri</em></>}
            </h2>
            <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', fontWeight: 300,
              lineHeight: 1.9, color: '#8a8278', marginBottom: '16px', fontSize: '15px', maxWidth: '430px' }}>
              {ru
                ? 'HOS Lounge — пространство с уникальным индустриальным характером. Открытый кирпич, бетонные стены, тёплый свет ламп и безупречный кофе создают атмосферу, в которую хочется возвращаться.'
                : 'HOS Lounge — özboluşly industrial häsiýetli giňişlik. Açyk kerpiç, beton diwarlary, çyralaryň ýyly yşygy we kämil kofe yzyna gaýtmak isleýän atmosfera döredýär.'}
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', fontWeight: 300,
              lineHeight: 1.9, color: '#5c5852', fontSize: '14px', maxWidth: '400px' }}>
              {ru
                ? 'Авторский кофе, изысканные десерты, три зоны: основной зал, VIP и открытая терраса.'
                : 'Awtor kofe, ajaýyp süýjülikler, üç zona: esasy zal, VIP we açyk taras.'}
            </p>

            {/* Статы с count-up */}
            <div className="grid grid-cols-3 mt-14 gap-0" style={{ borderTop: '1px solid rgba(201,168,76,0.18)', paddingTop: '32px' }}>
              {[
                { count: 3,  label: ru ? 'Зоны'       : 'Zona' },
                { count: 47, label: ru ? 'Позиций'    : 'Menýu' },
                { count: 9,  label: ru ? 'Лет опыта'  : 'Ýyl tejribe' },
              ].map((s, i) => (
                <div key={i} style={{
                  paddingRight: i < 2 ? '20px' : 0,
                  borderRight: i < 2 ? '1px solid rgba(201,168,76,0.15)' : 'none',
                  paddingLeft: i > 0 ? '20px' : 0,
                }}>
                  <div data-count={s.count} style={{
                    fontFamily: 'var(--font-italiana, Georgia, serif)',
                    fontSize: '52px', color: '#C9A84C', lineHeight: 1,
                  }}>0</div>
                  <div style={{
                    fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '9px',
                    letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5c5852', marginTop: '6px',
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Фото */}
          <div className="g-right relative">
            <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <Image src="/images/art-wall.jpg" alt="HOS art wall" fill className="object-cover object-top" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,9,8,0.5) 0%, transparent 60%)' }} />
            </div>
            {/* Gold accent badge */}
            <div className="absolute -bottom-5 -right-5 flex flex-col items-center justify-center"
              style={{ width: '130px', height: '130px', background: '#C9A84C' }}
            >
              <span style={{ fontFamily: 'var(--font-italiana, Georgia)', fontSize: '14px', color: '#0a0908', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {ru ? 'с' : 'bäri'}
              </span>
              <span style={{ fontFamily: 'var(--font-italiana, Georgia)', fontSize: '46px', color: '#0a0908', lineHeight: 1 }}>
                2015
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          INTERIOR CAROUSEL
      ══════════════════════════════════════ */}
      <section className="py-0">
        <div className="max-w-7xl mx-auto px-8 md:px-20">
          <div className="g-up flex items-end justify-between mb-8">
            <div>
              <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '10px',
                letterSpacing: '0.42em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '8px' }}>
                {ru ? 'Интерьер' : 'Interior'}
              </p>
              <h2 style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)',
                fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 300, color: '#f5f0e8' }}>
                {ru ? 'Пространство' : 'Giňişlik'}
              </h2>
            </div>
            <div className="hidden md:block g-line flex-1 ml-12" style={{ height: '1px', background: 'rgba(201,168,76,0.22)' }} />
          </div>
        </div>
        <InteriorCarousel />
      </section>


      {/* ══════════════════════════════════════
          ART WALL — split layout
      ══════════════════════════════════════ */}
      <section style={{ marginTop: '0' }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: '580px' }}>
          <div className="g-photo relative overflow-hidden order-2 md:order-1" style={{ minHeight: '420px' }}>
            <Image src="/images/photo_2026-06-19_18-49-30.jpg" alt="HOS sculpture" fill className="object-cover object-top" />
            <div className="absolute inset-0" style={{ background: 'rgba(10,9,8,0.15)' }} />
          </div>
          <div className="g-right order-1 md:order-2 flex flex-col justify-center px-10 md:px-16 py-20"
            style={{ background: '#0f0e0c' }}>
            <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '10px',
              letterSpacing: '0.42em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '18px' }}>
              {ru ? 'Искусство' : 'Sungat'}
            </p>
            <h2 style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)',
              fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 300, lineHeight: 1.15,
              color: '#f5f0e8', marginBottom: '20px' }}>
              {ru
                ? <><span style={{ color: '#C9A84C', fontStyle: 'italic' }}>Бетон.</span><br />Скульптура.<br />Кофе.</>
                : <><span style={{ color: '#C9A84C', fontStyle: 'italic' }}>Beton.</span><br />Skulptura.<br />Kofe.</>}
            </h2>
            <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', fontWeight: 300,
              lineHeight: 1.85, color: '#6b6460', fontSize: '14px', maxWidth: '380px', marginBottom: '28px' }}>
              {ru
                ? 'Каждая деталь интерьера создана с вниманием к искусству. Барельефы, открытый кирпич и тёплый свет рассказывают историю места.'
                : 'Interioryň her bir jikme-jigi sungata üns berip döredildi. Barelýefler, açyk kerpiç we ýyly yşyk ýeriň taryhyny gürrüň berýär.'}
            </p>
            <div className="g-line block" style={{ height: '1px', background: 'rgba(201,168,76,0.25)' }} />
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          #INDUSTRIAL — full-screen
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: '82vh' }}>
        <div className="g-photo absolute inset-0">
          <Image src="/images/industrial.jpg" alt="#INDUSTRIAL" fill className="object-cover object-center" />
        </div>
        <div className="absolute inset-0" style={{ background: 'rgba(10,9,8,0.62)' }} />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-10 md:p-20 max-w-7xl mx-auto">
          <p className="g-up" style={{
            fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '10px',
            letterSpacing: '0.45em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '14px',
          }}>
            {ru ? 'Философия' : 'Filosofiýa'}
          </p>
          <h2 className="g-up" style={{
            fontFamily: 'var(--font-italiana, Georgia, serif)',
            fontSize: 'clamp(52px, 10vw, 140px)', fontWeight: 400,
            color: '#f5f0e8', lineHeight: 0.92, letterSpacing: '-0.01em',
          }}>
            #INDUSTRIAL
          </h2>
          <p className="g-up" style={{
            fontFamily: 'var(--font-cormorant, Georgia, serif)',
            fontSize: 'clamp(18px, 2.5vw, 32px)', fontStyle: 'italic',
            color: 'rgba(245,240,232,0.55)', marginTop: '18px', letterSpacing: '0.02em',
          }}>
            Brutalism &amp; Beans — The Industrial Way
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════
          GALLERY — симметричная сетка 3×2
      ══════════════════════════════════════ */}
      <section className="py-24 px-8 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="g-up flex items-end justify-between mb-12">
            <div>
              <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '10px',
                letterSpacing: '0.42em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '8px' }}>
                {ru ? 'Атмосфера' : 'Atmosfera'}
              </p>
              <h2 style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)',
                fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 300, color: '#f5f0e8' }}>
                {ru ? 'Детали' : 'Jikme-jikler'}
              </h2>
            </div>
            <div className="hidden md:block g-line flex-1 ml-12" style={{ height: '1px', background: 'rgba(201,168,76,0.22)' }} />
          </div>

          {/* Ряд 1: 3 равные квадратные ячейки */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[
              { src: '/images/brick.jpg',       labelRu: 'Детали',   labelTk: 'Jikme-jikler' },
              { src: '/images/lamp.jpg',        labelRu: 'Свет',     labelTk: 'Yşyk' },
              { src: '/images/plant.jpg',       labelRu: 'Природа',  labelTk: 'Tebigat' },
            ].map((img, i) => (
              <div key={i} className="g-photo relative overflow-hidden group" style={{ aspectRatio: '1/1' }}>
                <Image src={img.src} alt={ru ? img.labelRu : img.labelTk} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-108" />
                <div className="absolute inset-0 transition-colors duration-500"
                  style={{ background: 'rgba(10,9,8,0.2)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,9,8,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(10,9,8,0.2)')}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <span className="section-label">{ru ? img.labelRu : img.labelTk}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Ряд 2: широкий + узкий */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="g-photo relative overflow-hidden group sm:col-span-3" style={{ aspectRatio: '4/3' }}>
              <Image src="/images/photo_2026-06-19_18-49-27.jpg" alt={ru ? 'Вход' : 'Girelge'} fill
                className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: 'rgba(10,9,8,0.2)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <span className="section-label">{ru ? 'Вход' : 'Girelge'}</span>
              </div>
            </div>
            <div className="g-photo relative overflow-hidden group sm:col-span-2" style={{ aspectRatio: '4/3' }}>
              <Image src="/images/logo-wall.jpg" alt={ru ? 'Логотип' : 'Logo'} fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: 'rgba(10,9,8,0.25)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <span className="section-label">{ru ? 'HOS Lounge' : 'HOS Lounge'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          BOOKING CTA
      ══════════════════════════════════════ */}
      <section className="py-32 px-8 md:px-20" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          <div className="g-left">
            <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '10px',
              letterSpacing: '0.42em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>
              {ru ? 'Бронирование' : 'Zakaz'}
            </p>
            <h2 style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)',
              fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 300,
              color: '#f5f0e8', lineHeight: 1.1, marginBottom: '22px' }}>
              {ru
                ? <>Зарезервируйте<br /><em style={{ color: '#C9A84C', fontStyle: 'italic' }}>ваш столик</em></>
                : <>Stolyňyzy<br /><em style={{ color: '#C9A84C', fontStyle: 'italic' }}>zakaz ediň</em></>}
            </h2>
            <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', fontWeight: 300,
              lineHeight: 1.9, color: '#5c5852', fontSize: '15px', maxWidth: '380px', marginBottom: '36px' }}>
              {ru
                ? 'Три зоны для вашего отдыха. Подтверждение придёт по SMS — без ожидания у входа.'
                : 'Dynç almak üçin üç zona. Tassyklama SMS arkaly geler.'}
            </p>
            <Link href="/booking" className="btn-gold group" style={{ letterSpacing: '0.2em' }}>
              {tr.bookTable}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3 g-right">
            {[
              { icon: MapPin, labelRu: 'Адрес',       labelTk: 'Salgy',    valueRu: 'Ашхабад, Туркменистан',    valueTk: 'Aşgabat, Türkmenistan' },
              { icon: Clock,  labelRu: 'Часы работы', labelTk: 'Iş wagty', valueRu: 'Ежедневно 09:00 – 23:00', valueTk: 'Her gün 09:00 – 23:00' },
              { icon: Phone,  labelRu: 'Телефон',     labelTk: 'Telefon',  valueRu: '+993 62 XXXXXX',           valueTk: '+993 62 XXXXXX' },
            ].map(({ icon: Icon, labelRu, labelTk, valueRu, valueTk }, i) => (
              <div key={i} className="flex items-center gap-5 px-6 py-5 transition-colors duration-300"
                style={{ border: '1px solid rgba(201,168,76,0.1)', background: '#0f0e0c' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)')}
              >
                <div style={{
                  width: '44px', height: '44px', flexShrink: 0,
                  border: '1px solid rgba(201,168,76,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'border-color 0.3s',
                }}>
                  <Icon size={16} style={{ color: '#C9A84C' }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '9px',
                    letterSpacing: '0.28em', textTransform: 'uppercase', color: '#3e3830', marginBottom: '4px' }}>
                    {ru ? labelRu : labelTk}
                  </p>
                  <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', color: '#8a8278', fontWeight: 300, fontSize: '14px' }}>
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
