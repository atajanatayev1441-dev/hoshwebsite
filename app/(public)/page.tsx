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

export default function HomePage() {
  const { lang } = useLang()
  const tr = translations[lang]
  const ru = lang === 'ru'
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY    = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    /* ── Fade-up for all .gsap-up elements ── */
    const els = gsap.utils.toArray<HTMLElement>('.gsap-up')
    els.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 56 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 87%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    /* ── Count-up for [data-count] ── */
    const counters = document.querySelectorAll<HTMLElement>('[data-count]')
    counters.forEach((el) => {
      const target = parseInt(el.getAttribute('data-count') || '0', 10)
      const obj = { val: 0 }
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate() { el.textContent = Math.round(obj.val).toString() },
          })
        },
      })
    })

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])

  return (
    <>
      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0 scale-105" style={{ y: imgY }}>
          <Image
            src="/images/photo_2026-06-19_18-49-27.jpg"
            alt="HOS Lounge entrance"
            fill priority quality={90}
            className="object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[#0a0a0a]/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />

        <motion.div
          style={{ opacity }}
          className="relative z-10 h-full flex flex-col justify-end pb-24 px-8 md:px-20 max-w-7xl mx-auto w-full"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="section-label mb-6"
          >
            {ru ? 'Кофе-лаунж · Ашхабад' : 'Kofe Lounge · Aşgabat'}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
              fontSize: 'clamp(96px, 14vw, 160px)',
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: '#f0ece3',
              marginBottom: '4px',
            }}
          >
            HOS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#C9A84C',
              lineHeight: 1,
              marginBottom: '2.5rem',
            }}
          >
            Lounge
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <Link href="/menu" className="btn-gold group">
              {tr.viewMenu}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/booking" className="btn-outline">{tr.bookTable}</Link>
          </motion.div>
        </motion.div>
      </section>


      {/* ══════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════ */}
      <div style={{ background: '#C9A84C', overflow: 'hidden', paddingTop: '12px', paddingBottom: '12px' }}>
        <div className="flex animate-marquee whitespace-nowrap select-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-10 text-[#0a0a0a] text-[10px] font-body font-medium tracking-[0.35em] uppercase">
              Wake Up &nbsp;·&nbsp; Drink Coffee &nbsp;·&nbsp; Create &nbsp;·&nbsp; Brutalism &amp; Beans &nbsp;·&nbsp; The Industrial Way
            </span>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      <section className="py-32 px-8 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          <div className="gsap-up">
            <span className="section-label mb-6">{ru ? 'О нас' : 'Biz hakda'}</span>
            <h2 style={{
              fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
              fontSize: 'clamp(36px, 4vw, 60px)',
              fontWeight: 300,
              color: '#f0ece3',
              lineHeight: 1.15,
              marginBottom: '2rem',
            }}>
              {ru
                ? <><em style={{ fontStyle: 'normal' }}>Место,</em> где каждая<br />чашка — <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>искусство</span></>
                : <>Her käse{' '}<span style={{ fontStyle: 'italic', color: '#C9A84C' }}>sungat</span></>}
            </h2>
            <p style={{ color: '#7a7570', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '380px', fontFamily: 'var(--font-dm-sans, system-ui)', fontWeight: 300 }}>
              {ru
                ? 'HOS Lounge — пространство с уникальным индустриальным характером. Бетонные стены, тёплый свет и безупречный кофе создают атмосферу, которую хочется возвращать.'
                : 'HOS Lounge — özboluşly industrial häsiýetli mekan. Beton diwarlary, ýyly yşyk we kämil kofe yzyna gaýtmak isleýän atmosfera döredýär.'}
            </p>
            <p style={{ color: '#5c5852', lineHeight: 1.75, maxWidth: '380px', fontSize: '14px', fontFamily: 'var(--font-dm-sans, system-ui)', fontWeight: 300 }}>
              {ru
                ? 'Авторский кофе, изысканные десерты, три зоны: основной зал, VIP и открытая терраса.'
                : 'Awtor kofe, ajaýyp süýjülikler, üç zona: esasy zal, VIP we açyk taras.'}
            </p>
          </div>

          <div className="gsap-up">
            <div className="relative w-full aspect-[4/5] overflow-hidden">
              <Image
                src="/images/photo_2026-06-19_18-49-24.jpg"
                alt="HOS main hall"
                fill className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 to-transparent" />
            </div>

            {/* Stats with count-up */}
            <div className="grid grid-cols-3">
              {[
                { count: 3,  display: '3',    label: ru ? 'Зоны'        : 'Zona' },
                { count: 47, display: '47',   label: ru ? 'Позиций'     : 'Menýu' },
                { count: 0,  display: '9–23', label: ru ? 'Часы работы' : 'Iş wagty' },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: '#C9A84C',
                    padding: '22px 16px',
                    textAlign: 'center',
                    borderRight: i < 2 ? '1px solid rgba(0,0,0,0.12)' : 'none',
                  }}
                >
                  {s.count > 0 ? (
                    <div
                      data-count={s.count}
                      style={{
                        fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                        fontSize: '40px', fontWeight: 400, color: '#1a1a1a', lineHeight: 1,
                      }}
                    >
                      0
                    </div>
                  ) : (
                    <div style={{
                      fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                      fontSize: '40px', fontWeight: 400, color: '#1a1a1a', lineHeight: 1,
                    }}>
                      {s.display}
                    </div>
                  )}
                  <div style={{
                    fontFamily: 'var(--font-dm-sans, system-ui, sans-serif)',
                    fontSize: '9px', fontWeight: 500, letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: 'rgba(26,26,26,0.6)', marginTop: '6px',
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          BAR — cinematic full-width
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: '60vh' }}>
        <Image
          src="/images/photo_2026-06-19_18-49-22.jpg"
          alt="HOS bar"
          fill className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.55)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gsap-up">
          <span className="section-label mb-5">{ru ? 'Наш бар' : 'Biziň bary'}</span>
          <h2 style={{
            fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
            fontSize: 'clamp(32px, 5vw, 72px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#f0ece3',
            lineHeight: 1.2,
          }}>
            {ru ? 'Мастерство в каждом глотке' : 'Her owurtda ussatlyk'}
          </h2>
        </div>
      </section>


      {/* ══════════════════════════════════════
          GALLERY — asymmetric
      ══════════════════════════════════════ */}
      <section className="py-28 px-8 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 gsap-up">
            <div>
              <span className="section-label mb-3">{ru ? 'Пространство' : 'Giňişlik'}</span>
              <h2 style={{
                fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
                fontSize: 'clamp(32px, 4vw, 52px)',
                fontWeight: 300,
                color: '#f0ece3',
              }}>
                {ru ? 'Интерьер' : 'Interior'}
              </h2>
            </div>
            <div style={{ height: '1px', width: '120px', background: 'rgba(201,168,76,0.4)' }} className="hidden md:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:h-[680px]">
            {/* Left: sculpture wall tall */}
            <div className="relative overflow-hidden group aspect-[3/4] md:aspect-auto md:h-full gsap-up">
              <Image
                src="/images/photo_2026-06-19_18-49-30.jpg"
                alt={ru ? 'Арт-стена' : 'Sungat diwary'}
                fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 transition-colors duration-500" style={{ background: 'rgba(10,10,10,0.15)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <span className="section-label">{ru ? 'Арт-стена' : 'Sungat diwary'}</span>
              </div>
            </div>

            {/* Right: stacked */}
            <div className="flex flex-col gap-4 md:h-full">
              <div className="relative overflow-hidden group flex-1 aspect-[16/9] md:aspect-auto gsap-up">
                <Image
                  src="/images/photo_2026-06-19_18-49-32.jpg"
                  alt={ru ? 'Атмосфера' : 'Atmosfera'}
                  fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 transition-colors duration-500" style={{ background: 'rgba(10,10,10,0.2)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <span className="section-label">{ru ? 'Атмосфера' : 'Atmosfera'}</span>
                </div>
              </div>
              <div className="relative overflow-hidden group flex-1 aspect-[16/9] md:aspect-auto gsap-up">
                <Image
                  src="/images/photo_2026-06-19_18-49-27.jpg"
                  alt={ru ? 'Вход' : 'Girelge'}
                  fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 transition-colors duration-500" style={{ background: 'rgba(10,10,10,0.2)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <span className="section-label">{ru ? 'Вход' : 'Girelge'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          QUOTE — philosophy
      ══════════════════════════════════════ */}
      <section className="relative py-36 overflow-hidden">
        <Image
          src="/images/photo_2026-06-19_18-49-32.jpg"
          alt="atmosphere" fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.75)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-8 text-center gsap-up">
          <span className="section-label mb-8">{ru ? 'Философия' : 'Filosofiýa'}</span>
          <blockquote style={{
            fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
            fontSize: 'clamp(28px, 4vw, 56px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#f0ece3',
            lineHeight: 1.3,
            marginTop: '1.5rem',
          }}>
            "Brutalism &amp; Beans:<br />
            <span style={{ color: '#C9A84C' }}>The Industrial Way"</span>
          </blockquote>
        </div>
      </section>


      {/* ══════════════════════════════════════
          BOOKING CTA
      ══════════════════════════════════════ */}
      <section className="py-32 px-8 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          <div className="gsap-up">
            <span className="section-label mb-6">{ru ? 'Бронирование' : 'Zakaz'}</span>
            <h2 style={{
              fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
              fontSize: 'clamp(32px, 4vw, 56px)',
              fontWeight: 300,
              color: '#f0ece3',
              lineHeight: 1.15,
              marginBottom: '1.5rem',
            }}>
              {ru
                ? <>Зарезервируйте<br /><span style={{ fontStyle: 'italic', color: '#C9A84C' }}>ваш столик</span></>
                : <>Stolyňyzy<br /><span style={{ fontStyle: 'italic', color: '#C9A84C' }}>zakaz ediň</span></>}
            </h2>
            <p style={{ color: '#5c5852', marginBottom: '2.5rem', lineHeight: 1.75, maxWidth: '380px', fontFamily: 'var(--font-dm-sans, system-ui)', fontWeight: 300 }}>
              {ru
                ? 'Три зоны для вашего отдыха. Подтверждение придёт по SMS — без ожидания у входа.'
                : 'Dynç almak üçin üç zona. Tassyklama SMS arkaly geler.'}
            </p>
            <Link href="/booking" className="btn-gold group">
              {tr.bookTable}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3 gsap-up">
            {[
              { icon: MapPin, labelRu: 'Адрес',       labelTk: 'Salgy',    valueRu: 'Ашхабад, Туркменистан',    valueTk: 'Aşgabat, Türkmenistan' },
              { icon: Clock,  labelRu: 'Часы работы', labelTk: 'Iş wagty', valueRu: 'Ежедневно 09:00 – 23:00', valueTk: 'Her gün 09:00 – 23:00' },
              { icon: Phone,  labelRu: 'Телефон',     labelTk: 'Telefon',  valueRu: '+993 62 XXXXXX',           valueTk: '+993 62 XXXXXX' },
            ].map(({ icon: Icon, labelRu, labelTk, valueRu, valueTk }, i) => (
              <div key={i} className="flex items-center gap-5 px-6 py-5" style={{ border: '1px solid #1e1b16', background: '#111009' }}>
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ border: '1px solid rgba(201,168,76,0.3)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#C9A84C' }} />
                </div>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '9px',
                    fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase',
                    color: '#3e3830', marginBottom: '3px',
                  }}>
                    {ru ? labelRu : labelTk}
                  </p>
                  <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', color: '#9e9890', fontWeight: 300, fontSize: '14px' }}>
                    {ru ? valueRu : valueTk}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
