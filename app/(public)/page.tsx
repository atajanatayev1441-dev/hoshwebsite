'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import { ArrowRight, MapPin, Clock, Phone, ArrowDown } from 'lucide-react'

export default function HomePage() {
  const { lang } = useLang()
  const tr = translations[lang]
  const ru = lang === 'ru'
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY    = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Универсальный fade-up
    gsap.utils.toArray<HTMLElement>('.g-up').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 70 },
        {
          opacity: 1, y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        }
      )
    })

    // Fade-in с масштабом для фото
    gsap.utils.toArray<HTMLElement>('.g-photo').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, scale: 1.06 },
        {
          opacity: 1, scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        }
      )
    })

    // Slide from left
    gsap.utils.toArray<HTMLElement>('.g-left').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, x: -60 },
        {
          opacity: 1, x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      )
    })

    // Slide from right
    gsap.utils.toArray<HTMLElement>('.g-right').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, x: 60 },
        {
          opacity: 1, x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      )
    })

    // Count-up
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const target = parseInt(el.getAttribute('data-count') || '0', 10)
      const obj = { val: 0 }
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => gsap.to(obj, {
          val: target, duration: 2, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.val).toString() },
        }),
      })
    })

    // Clip-path reveal для разделителей
    gsap.utils.toArray<HTMLElement>('.g-line').forEach((el) => {
      gsap.fromTo(el,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div style={{ background: '#0a0908', color: '#f5f0e8' }}>

      {/* ══════════════════════════════════════
          HERO — full screen
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: 1.1 }}>
          <Image
            src="/images/hero.jpg"
            alt="HOS Lounge"
            fill priority quality={95}
            className="object-cover object-center"
          />
        </motion.div>

        {/* Градиентный оверлей */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(10,9,8,0.2) 0%, rgba(10,9,8,0.45) 50%, rgba(10,9,8,0.92) 100%)'
        }} />

        {/* Контент */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-20 max-w-7xl mx-auto w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="mb-4"
          >
            <span style={{
              fontFamily: 'var(--font-dm-sans, system-ui)',
              fontSize: '11px', letterSpacing: '0.4em',
              textTransform: 'uppercase', color: '#C9A84C',
              display: 'block', marginBottom: '20px',
            }}>
              {ru ? 'Кофе-лаунж · Ашхабад, Туркменистан' : 'Kofe-Lounge · Aşgabat, Türkmenistan'}
            </span>

            <h1 style={{
              fontFamily: 'var(--font-italiana, Georgia, serif)',
              fontSize: 'clamp(72px, 13vw, 180px)',
              fontWeight: 400,
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
              color: '#f5f0e8',
            }}>
              HOS
            </h1>
            <h2 style={{
              fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
              fontSize: 'clamp(36px, 6.5vw, 90px)',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1,
              color: '#C9A84C',
              marginBottom: '40px',
            }}>
              Lounge
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/menu" className="btn-gold group" style={{ letterSpacing: '0.2em' }}>
              {tr.viewMenu}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/booking" className="btn-outline" style={{ letterSpacing: '0.2em' }}>
              {tr.bookTable}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
            <ArrowDown size={18} style={{ color: '#C9A84C' }} />
          </motion.div>
        </motion.div>
      </section>


      {/* ══════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════ */}
      <div style={{ background: '#C9A84C', overflow: 'hidden', padding: '14px 0' }}>
        <div className="flex animate-marquee whitespace-nowrap select-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="mx-8" style={{
              fontFamily: 'var(--font-dm-sans, system-ui)',
              fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.4em', textTransform: 'uppercase',
              color: '#0a0908',
            }}>
              Wake Up &nbsp;·&nbsp; Drink Coffee &nbsp;·&nbsp; Create &nbsp;·&nbsp; #Industrial &nbsp;·&nbsp; Brutalism &amp; Beans
            </span>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════
          LOGO SHOWCASE — золотой 3D логотип
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: '70vh' }}>
        <div className="g-photo absolute inset-0">
          <Image src="/images/logo-wall.jpg" alt="HOS Lounge logo" fill className="object-cover object-center" />
        </div>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(10,9,8,0.7) 0%, rgba(10,9,8,0.2) 50%, rgba(10,9,8,0.7) 100%)'
        }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="g-up" style={{
            fontFamily: 'var(--font-dm-sans, system-ui)',
            fontSize: '10px', letterSpacing: '0.45em',
            textTransform: 'uppercase', color: '#C9A84C',
            marginBottom: '20px',
          }}>
            {ru ? 'Наше место' : 'Biziň ýerimiz'}
          </p>
          <blockquote className="g-up" style={{
            fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
            fontSize: 'clamp(26px, 4.5vw, 64px)',
            fontWeight: 300, fontStyle: 'italic',
            color: '#f5f0e8', lineHeight: 1.25, maxWidth: '800px',
          }}>
            {ru
              ? '"Где бетон встречается с красотой, а кофе — с искусством"'
              : '"Betonyň gözellik bilen, kofäniň sungat bilen duşuşýan ýeri"'}
          </blockquote>
        </div>
      </section>


      {/* ══════════════════════════════════════
          ABOUT — текст + интерьер
      ══════════════════════════════════════ */}
      <section className="py-32 px-8 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Текст */}
          <div className="g-left">
            <div className="g-line h-px mb-10" style={{ background: '#C9A84C', opacity: 0.5, display: 'block' }} />
            <p style={{
              fontFamily: 'var(--font-dm-sans, system-ui)',
              fontSize: '10px', letterSpacing: '0.4em',
              textTransform: 'uppercase', color: '#C9A84C',
              marginBottom: '24px',
            }}>
              {ru ? 'О нас' : 'Biz hakda'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)',
              fontSize: 'clamp(38px, 4.5vw, 64px)',
              fontWeight: 300, lineHeight: 1.1,
              color: '#f5f0e8', marginBottom: '28px',
            }}>
              {ru
                ? <>Место, где<br />каждая чашка —<br /><em style={{ color: '#C9A84C', fontStyle: 'italic' }}>произведение</em></>
                : <>Her käse<br /><em style={{ color: '#C9A84C', fontStyle: 'italic' }}>sungat eseri</em></>}
            </h2>
            <p style={{
              fontFamily: 'var(--font-dm-sans, system-ui)', fontWeight: 300,
              lineHeight: 1.85, color: '#9e9480', marginBottom: '16px',
              fontSize: '15px', maxWidth: '440px',
            }}>
              {ru
                ? 'HOS Lounge — это уникальное пространство с индустриальным характером. Открытый кирпич, бетонные стены, тёплый свет ламп и безупречный кофе создают атмосферу, в которую хочется возвращаться.'
                : 'HOS Lounge — özboluşly industrial häsiýetli giňişlik. Açyk kerpiç, beton diwarlary, çyralaryň ýyly yşygy we kämil kofe yzyna gaýtmak isleýän atmosfera döredýär.'}
            </p>
            <p style={{
              fontFamily: 'var(--font-dm-sans, system-ui)', fontWeight: 300,
              lineHeight: 1.85, color: '#6b6460', fontSize: '14px', maxWidth: '420px',
            }}>
              {ru
                ? 'Авторский кофе, изысканные десерты, три зоны: основной зал, VIP и открытая терраса.'
                : 'Awtor kofe, ajaýyp süýjülikler, üç zona: esasy zal, VIP we açyk taras.'}
            </p>

            {/* Статы */}
            <div className="grid grid-cols-3 mt-12 gap-0" style={{ borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: '32px' }}>
              {[
                { count: 3,  label: ru ? 'Зоны'        : 'Zona' },
                { count: 47, label: ru ? 'Позиций'     : 'Menýu' },
                { count: 5,  label: ru ? 'Лет с вами'  : 'Ýyl siziň bilen' },
              ].map((s, i) => (
                <div key={i} style={{ paddingRight: i < 2 ? '24px' : 0, borderRight: i < 2 ? '1px solid rgba(201,168,76,0.15)' : 'none', paddingLeft: i > 0 ? '24px' : 0 }}>
                  <div data-count={s.count} style={{
                    fontFamily: 'var(--font-italiana, Georgia, serif)',
                    fontSize: '48px', color: '#C9A84C', lineHeight: 1,
                  }}>0</div>
                  <div style={{
                    fontFamily: 'var(--font-dm-sans, system-ui)',
                    fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: '#6b6460', marginTop: '6px',
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Фото интерьера */}
          <div className="g-right relative">
            <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <Image src="/images/interior.jpg" alt="HOS interior" fill className="object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,9,8,0.4) 0%, transparent 60%)' }} />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 p-6" style={{
              background: '#C9A84C', width: '140px', height: '140px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'var(--font-italiana, Georgia)', fontSize: '42px', color: '#0a0908', lineHeight: 1 }}>9</span>
              <span style={{ fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(10,9,8,0.7)', marginTop: '4px' }}>{ru ? 'лет опыта' : 'ýyl tejribe'}</span>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          ART WALL — барельеф
      ══════════════════════════════════════ */}
      <section className="py-0">
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: '600px' }}>

          {/* Фото барельефа */}
          <div className="g-photo relative overflow-hidden" style={{ minHeight: '500px' }}>
            <Image src="/images/art-wall.jpg" alt="HOS art wall" fill className="object-cover object-top" />
            <div className="absolute inset-0" style={{ background: 'rgba(10,9,8,0.2)' }} />
          </div>

          {/* Текст */}
          <div className="g-right flex flex-col justify-center px-12 md:px-16 py-20" style={{ background: '#111009' }}>
            <p style={{
              fontFamily: 'var(--font-dm-sans, system-ui)',
              fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase',
              color: '#C9A84C', marginBottom: '20px',
            }}>
              {ru ? 'Искусство' : 'Sungat'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-cormorant, Georgia, serif)',
              fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 300,
              color: '#f5f0e8', lineHeight: 1.15, marginBottom: '24px',
            }}>
              {ru ? <>Бетон.<br />Скульптура.<br /><span style={{ color: '#C9A84C', fontStyle: 'italic' }}>Кофе.</span></> : <>Beton.<br />Skulptura.<br /><span style={{ color: '#C9A84C', fontStyle: 'italic' }}>Kofe.</span></>}
            </h2>
            <p style={{
              fontFamily: 'var(--font-dm-sans, system-ui)', fontWeight: 300,
              lineHeight: 1.85, color: '#7a7470', fontSize: '14px',
            }}>
              {ru
                ? 'Каждая деталь интерьера создана с вниманием к искусству. Барельефы на стенах, открытый кирпич и тёплый свет — всё это рассказывает историю места.'
                : 'Interioryň her bir jikme-jigi sungata üns berip döredildi. Diwarlardaky gipsleme, açyk kerpiç we ýyly yşyk — hemmesi ýeriň taryhyny gürrüň berýär.'}
            </p>
            <div className="g-line mt-10" style={{ height: '1px', background: 'rgba(201,168,76,0.3)', display: 'block' }} />
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          #INDUSTRIAL — полноэкранная секция
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: '80vh' }}>
        <div className="g-photo absolute inset-0">
          <Image src="/images/industrial.jpg" alt="#INDUSTRIAL" fill className="object-cover object-center" />
        </div>
        <div className="absolute inset-0" style={{ background: 'rgba(10,9,8,0.6)' }} />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-12 md:p-20 max-w-7xl mx-auto">
          <p className="g-up" style={{
            fontFamily: 'var(--font-dm-sans, system-ui)',
            fontSize: '10px', letterSpacing: '0.45em', textTransform: 'uppercase',
            color: '#C9A84C', marginBottom: '16px',
          }}>
            {ru ? 'Философия' : 'Filosofiýa'}
          </p>
          <h2 className="g-up" style={{
            fontFamily: 'var(--font-italiana, Georgia, serif)',
            fontSize: 'clamp(48px, 8vw, 120px)', fontWeight: 400,
            color: '#f5f0e8', lineHeight: 0.95, letterSpacing: '-0.01em',
          }}>
            #INDUSTRIAL
          </h2>
          <p className="g-up" style={{
            fontFamily: 'var(--font-cormorant, Georgia, serif)',
            fontSize: 'clamp(18px, 2.5vw, 30px)', fontStyle: 'italic',
            color: 'rgba(245,240,232,0.6)', marginTop: '16px',
          }}>
            Brutalism &amp; Beans — The Industrial Way
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════
          ГАЛЕРЕЯ — мозаика
      ══════════════════════════════════════ */}
      <section className="py-24 px-8 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div className="g-up">
              <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px' }}>
                {ru ? 'Атмосфера' : 'Atmosfera'}
              </p>
              <h2 style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: '#f5f0e8' }}>
                {ru ? 'Интерьер' : 'Interior'}
              </h2>
            </div>
            <div className="g-line hidden md:block flex-1 mx-12" style={{ height: '1px', background: 'rgba(201,168,76,0.25)' }} />
          </div>

          {/* Мозаичная сетка */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">

            {/* Кирпич — большой */}
            <div className="g-photo relative overflow-hidden group col-span-1 row-span-2" style={{ aspectRatio: '2/3' }}>
              <Image src="/images/brick.jpg" alt="brick detail" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" style={{ background: 'rgba(10,9,8,0.2)' }} />
              <div className="absolute bottom-4 left-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <span className="section-label">{ru ? 'Детали' : 'Jikme-jikler'}</span>
              </div>
            </div>

            {/* Растение */}
            <div className="g-photo relative overflow-hidden group" style={{ aspectRatio: '1/1' }}>
              <Image src="/images/plant.jpg" alt="plant" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" style={{ background: 'rgba(10,9,8,0.2)' }} />
              <div className="absolute bottom-4 left-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <span className="section-label">{ru ? 'Растения' : 'Ösümlikler'}</span>
              </div>
            </div>

            {/* Лампа */}
            <div className="g-photo relative overflow-hidden group" style={{ aspectRatio: '1/1' }}>
              <Image src="/images/lamp.jpg" alt="lamp" fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" style={{ background: 'rgba(10,9,8,0.3)' }} />
              <div className="absolute bottom-4 left-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <span className="section-label">{ru ? 'Свет' : 'Yşyk'}</span>
              </div>
            </div>

            {/* Интерьер — широкий */}
            <div className="g-photo relative overflow-hidden group col-span-2" style={{ aspectRatio: '16/7' }}>
              <Image src="/images/interior.jpg" alt="interior" fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" style={{ background: 'rgba(10,9,8,0.25)' }} />
              <div className="absolute bottom-4 left-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <span className="section-label">{ru ? 'Основной зал' : 'Esasy zal'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          BOOKING CTA
      ══════════════════════════════════════ */}
      <section className="py-32 px-8 md:px-20" style={{ borderTop: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          <div className="g-left">
            <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>
              {ru ? 'Бронирование' : 'Zakaz'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-cormorant, Georgia, serif)',
              fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 300,
              color: '#f5f0e8', lineHeight: 1.1, marginBottom: '24px',
            }}>
              {ru
                ? <>Зарезервируйте<br /><span style={{ color: '#C9A84C', fontStyle: 'italic' }}>ваш столик</span></>
                : <>Stolyňyzy<br /><span style={{ color: '#C9A84C', fontStyle: 'italic' }}>zakaz ediň</span></>}
            </h2>
            <p style={{
              fontFamily: 'var(--font-dm-sans, system-ui)', fontWeight: 300,
              lineHeight: 1.85, color: '#6b6460', fontSize: '15px',
              maxWidth: '400px', marginBottom: '36px',
            }}>
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
              <div
                key={i}
                className="flex items-center gap-5 px-6 py-5"
                style={{ border: '1px solid rgba(201,168,76,0.12)', background: '#111009' }}
              >
                <div style={{
                  width: '44px', height: '44px', flexShrink: 0,
                  border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} style={{ color: '#C9A84C' }} />
                </div>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-dm-sans, system-ui)', fontSize: '9px',
                    letterSpacing: '0.28em', textTransform: 'uppercase', color: '#3e3830', marginBottom: '4px',
                  }}>
                    {ru ? labelRu : labelTk}
                  </p>
                  <p style={{ fontFamily: 'var(--font-dm-sans, system-ui)', color: '#9e9480', fontWeight: 300, fontSize: '14px' }}>
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
