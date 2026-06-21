'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import { ArrowRight, MapPin, Clock, Phone, Play } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const VRTourModal = dynamic(
  () => import('@/components/ui/VRTourModal').then(m => m.VRTourModal),
  { ssr: false }
)

export default function HomePage() {
  const { lang } = useLang()
  const tr = translations[lang]
  const ru = lang === 'ru'
  const heroRef = useRef<HTMLDivElement>(null)
  const [tourOpen, setTourOpen] = useState(false)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY    = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    gsap.utils.toArray<HTMLElement>('[data-animate]').forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 40, duration: 1, ease: 'power2.out',
        delay: el.dataset.delay ? parseFloat(el.dataset.delay) : 0,
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      })
    })
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

  const Divider = () => (
    <div style={{ height: '1px', background: 'var(--border)', margin: '0' }} />
  )

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--white)' }}>

      {/* ══════════════════════════════════════
          HERO — единственное фото на странице
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
          <Image src="/images/hero.jpg" alt="HOŞ Lounge" fill priority quality={95} className="object-cover object-center" />
        </motion.div>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(10,10,10,0.92) 45%, rgba(10,10,10,0.4) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 50%)'
        }} />

        <motion.div style={{ opacity: fadeOut }}
          className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 max-w-4xl"
        >
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '28px' }}>
              {ru ? 'КОФЕ · ЛАУНДЖ · АШХАБАД' : 'KOFE · LOUNGE · AŞGABAT'}
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(90px, 14vw, 180px)', fontWeight: 300, lineHeight: 0.85, color: 'var(--white)', letterSpacing: '-0.02em', margin: 0 }}>
              HOŞ
            </h1>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(44px, 7vw, 90px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--gold)', lineHeight: 1, marginBottom: '44px' }}>
              Lounge
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/menu" className="btn-gold group">
                {ru ? 'СМОТРЕТЬ МЕНЮ' : 'MENÝUNY GÖR'}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/booking" className="btn-outline">{ru ? 'ЗАБРОНИРОВАТЬ' : 'ZAKAZ ETMEK'}</Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9 }}
          className="absolute bottom-0 left-0 right-0 px-8 md:px-20"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-3 divide-x" style={{ '--tw-divide-color': 'rgba(255,255,255,0.08)' } as any}>
            {[
              { count: 3,  label: ru ? 'ЗОНЫ'    : 'ZONALAR' },
              { count: 47, label: ru ? 'ПОЗИЦИЙ' : 'POZISIÝA' },
              { count: 0,  label: ru ? 'ЧАСЫ'    : 'SAGAT', display: '09–23' },
            ].map((s, i) => (
              <div key={i} className="py-6 flex flex-col items-center gap-1.5" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {s.count > 0
                  ? <span data-count={s.count} style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>0</span>
                  : <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>{s.display}</span>
                }
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.3em', color: 'var(--muted)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════ */}
      <div style={{ background: 'var(--gold)', overflow: 'hidden', padding: '13px 0' }}>
        <div className="flex animate-marquee whitespace-nowrap select-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="mx-8" style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--bg)' }}>
              Wake Up &nbsp;·&nbsp; Drink Coffee &nbsp;·&nbsp; Create &nbsp;·&nbsp; #Industrial &nbsp;·&nbsp; Brutalism &amp; Beans
            </span>
          ))}
        </div>
      </div>

      <Divider />

      {/* ══════════════════════════════════════
          ABOUT — только текст
      ══════════════════════════════════════ */}
      <section style={{ padding: '120px 0' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          <div data-animate>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '20px' }}>
              {ru ? 'О НАС' : 'BIZ HAKDA'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, lineHeight: 1.1, color: 'var(--white)', marginBottom: '28px' }}>
              {ru ? <>Место, где каждая чашка —<br /><em style={{ color: 'var(--gold)' }}>искусство</em></> : <>Her käse —<br /><em style={{ color: 'var(--gold)' }}>sungat eseri</em></>}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.9, color: 'var(--muted)', fontSize: '15px', marginBottom: '16px', maxWidth: '440px' }}>
              {ru
                ? 'HOŞ Lounge — пространство с уникальным индустриальным характером. Открытый кирпич, бетонные стены, тёплый свет ламп и безупречный кофе создают атмосферу, в которую хочется возвращаться.'
                : 'HOŞ Lounge — özboluşly industrial häsiýetli giňişlik. Açyk kerpiç, beton diwarlary we kämil kofe yzyna gaýtmak isleýän atmosfera döredýär.'}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.9, color: '#4a4a4a', fontSize: '14px', maxWidth: '420px' }}>
              {ru ? 'Авторский кофе, изысканные десерты, три зоны: основной зал, VIP и открытая терраса.' : 'Awtor kofe, ajaýyp süýjülikler, üç zona: esasy zal, VIP we açyk taras.'}
            </p>
          </div>

          <div data-animate data-delay="0.12" className="grid grid-cols-3 gap-0 self-center" style={{ borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
            {[
              { count: 3,  label: ru ? 'Зоны'       : 'Zona' },
              { count: 47, label: ru ? 'Позиций'    : 'Menýu' },
              { count: 9,  label: ru ? 'Лет опыта'  : 'Ýyl tejribe' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '0 24px 0 0', borderRight: i < 2 ? '1px solid var(--border)' : 'none', marginLeft: i > 0 ? '24px' : 0 }}>
                <div data-count={s.count} style={{ fontFamily: 'var(--font-heading)', fontSize: '56px', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>0</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '8px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          PHILOSOPHY — только текст, без фото
      ══════════════════════════════════════ */}
      <section style={{ padding: '120px 0', background: '#0d0d0d' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-20 text-center" data-animate>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '24px' }}>
            {ru ? 'ФИЛОСОФИЯ' : 'FILOSOFIÝA'}
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(52px, 10vw, 120px)', fontWeight: 300, lineHeight: 0.9, color: 'var(--white)', letterSpacing: '-0.02em', marginBottom: '24px' }}>
            #INDUSTRIAL
          </h2>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 2.5vw, 28px)', fontStyle: 'italic', color: 'var(--gold)' }}>
            Brutalism &amp; Beans — The Industrial Way
          </p>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          ВИРТУАЛЬНЫЙ ТУР — кнопка входа
      ══════════════════════════════════════ */}
      <section style={{ padding: '100px 0', background: '#0d0d0d' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" data-animate>

          {/* Left: text */}
          <div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '16px' }}>
              {ru ? 'ВИРТУАЛЬНЫЙ ТУР' : 'WIRTUAL SYÝAHAT'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 300, lineHeight: 1.1, color: 'var(--white)', marginBottom: '20px' }}>
              {ru ? <>Прогуляйтесь<br /><em style={{ color: 'var(--gold)' }}>по нашему заведению</em></> : <>Biziň kafe boýunça<br /><em style={{ color: 'var(--gold)' }}>gezelenç ediň</em></>}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.85, color: 'var(--muted)', fontSize: '15px', maxWidth: '400px', marginBottom: '36px' }}>
              {ru
                ? 'Виртуальная 360° экскурсия — оглядывайтесь вокруг, переходите из зала в зал через стрелки прямо внутри panoraмы.'
                : 'Wirtual 360° gezelenç — töweregiňize serediň, panoryma içindäki oklary ulanyp zala-zaldan geçiň.'}
            </p>
            <button
              onClick={() => setTourOpen(true)}
              className="btn-gold group"
              style={{ gap: '14px', paddingLeft: '28px', paddingRight: '28px' }}
            >
              <span className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(0,0,0,0.3)' }}>
                <Play size={14} fill="currentColor" />
              </span>
              {ru ? 'ВОЙТИ В ТУР' : 'TURA GIR'}
            </button>
          </div>

          {/* Right: preview image with play overlay */}
          <button
            onClick={() => setTourOpen(true)}
            className="relative overflow-hidden group block w-full"
            style={{ aspectRatio: '16/9', cursor: 'pointer' }}
          >
            <img src="/images/interior.jpg" alt="Tour preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '2px solid rgba(201,168,76,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
                className="group-hover:scale-110 group-hover:bg-[rgba(201,168,76,0.3)]"
              >
                <Play size={28} style={{ color: '#C9A84C', marginLeft: 4 }} fill="#C9A84C" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.9)', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', backdropFilter: 'blur(8px)' }}>
                360° VR
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* VR Tour Modal */}
      {tourOpen && <VRTourModal onClose={() => setTourOpen(false)} />}

      <Divider />

      {/* ══════════════════════════════════════
          BOOKING CTA
      ══════════════════════════════════════ */}
      <section style={{ padding: '120px 0' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div data-animate>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '20px' }}>
              {ru ? 'БРОНИРОВАНИЕ' : 'ZAKAZ'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.05, marginBottom: '4px' }}>
              {ru ? 'Зарезервируйте' : 'Stolyňyzy'}
            </h2>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--gold)', lineHeight: 1.05, marginBottom: '28px' }}>
              {ru ? 'ваш столик' : 'zakaz ediň'}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.9, color: 'var(--muted)', fontSize: '15px', maxWidth: '380px', marginBottom: '36px' }}>
              {ru ? 'Три зоны для вашего отдыха. Подтверждение придёт по SMS — без ожидания у входа.' : 'Dynç almak üçin üç zona. Tassyklama SMS arkaly geler.'}
            </p>
            <Link href="/booking" className="btn-gold group">
              {tr.bookTable} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3" data-animate data-delay="0.1">
            {[
              { icon: MapPin, labelRu: 'АДРЕС',       labelTk: 'SALGY',    valRu: 'Ашхабад, Туркменистан',    valTk: 'Aşgabat, Türkmenistan' },
              { icon: Clock,  labelRu: 'ЧАСЫ РАБОТЫ', labelTk: 'IŞ WAGTY', valRu: 'Ежедневно 09:00 – 23:00', valTk: 'Her gün 09:00 – 23:00' },
              { icon: Phone,  labelRu: 'ТЕЛЕФОН',     labelTk: 'TELEFON',  valRu: '+993 62 XXXXXX',           valTk: '+993 62 XXXXXX' },
            ].map(({ icon: Icon, labelRu, labelTk, valRu, valTk }, i) => (
              <div key={i} className="flex items-center gap-5 px-6 py-5" style={{ background: '#161616', border: '1px solid var(--border)' }}>
                <div style={{ width: 40, height: 40, border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} style={{ color: 'var(--gold)' }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '3px' }}>
                    {ru ? labelRu : labelTk}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 300, color: 'var(--white)' }}>
                    {ru ? valRu : valTk}
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
