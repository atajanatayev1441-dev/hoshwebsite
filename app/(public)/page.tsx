'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import { ArrowRight, MapPin, Clock, Phone } from 'lucide-react'

/* ─── tiny helpers ─── */
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.13, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function HomePage() {
  const { lang } = useLang()
  const tr = translations[lang]
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY    = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  /* translation shorthands */
  const ru = lang === 'ru'

  return (
    <>
      {/* ══════════════════════════════════════
          HERO — full-screen entrance photo
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

        {/* Strong uniform overlay — suppresses the physical HOS sign on the building
            so it doesn't compete with the page typography */}
        <div className="absolute inset-0 bg-[#080705]/70" />
        {/* Extra gradient: deeper at bottom for text legibility, lighter at top */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080705]/30 via-transparent to-[#080705]" />

        {/* content */}
        <motion.div
          style={{ opacity }}
          className="relative z-10 h-full flex flex-col justify-end pb-24 px-8 md:px-20 max-w-7xl mx-auto w-full"
        >
          <motion.span custom={0} variants={fadeUp} initial="hidden" animate="visible" className="section-label mb-6">
            {ru ? 'Кофе-лаунж · Ашхабад' : 'Kofe Lounge · Aşgabat'}
          </motion.span>

          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="font-display text-[clamp(72px,12vw,160px)] font-light leading-none tracking-tight text-[#f0ece3] mb-1"
          >
            HOS
          </motion.h1>

          <motion.h2
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="font-display text-[clamp(36px,6vw,80px)] font-light italic text-gold-400 leading-none mb-10"
          >
            Lounge
          </motion.h2>

          <motion.div
            custom={3} variants={fadeUp} initial="hidden" animate="visible"
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
          MARQUEE STRIP
      ══════════════════════════════════════ */}
      <div className="bg-gold-500 overflow-hidden py-3">
        <div className="flex animate-marquee whitespace-nowrap select-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-10 text-[#080705] text-[10px] font-body font-medium tracking-[0.35em] uppercase">
              Wake Up &nbsp;·&nbsp; Drink Coffee &nbsp;·&nbsp; Create &nbsp;·&nbsp; Brutalism &amp; Beans &nbsp;·&nbsp; The Industrial Way
            </span>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════
          ABOUT — 2-column, left text / right image
      ══════════════════════════════════════ */}
      <section className="py-32 px-8 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="section-label mb-6">{ru ? 'О нас' : 'Biz hakda'}</span>
            <h2 className="font-display text-[clamp(36px,4vw,60px)] font-light text-[#f0ece3] leading-[1.15] mb-8">
              {ru
                ? <><em className="not-italic font-light">Место,</em> где каждая<br />чашка —{' '}
                    <span className="italic text-gold-400">искусство</span></>
                : <>Her käse{' '}<span className="italic text-gold-400">sungat</span></>}
            </h2>
            <p className="text-[#9e9890] leading-relaxed mb-5 max-w-sm">
              {ru
                ? 'HOS Lounge — пространство с уникальным индустриальным характером. Бетонные стены, тёплый свет и безупречный кофе создают атмосферу, которую хочется возвращать.'
                : 'HOS Lounge — özboluşly industrial häsiýetli mekan. Beton diwarlary, ýyly yşyk we kämil kofe yzyna gaýtmak isleýän atmosfera döredýär.'}
            </p>
            <p className="text-[#7a7570] leading-relaxed max-w-sm text-sm">
              {ru
                ? 'Авторский кофе, изысканные десерты, три зоны: основной зал, VIP и открытая терраса.'
                : 'Awtor kofe, ajaýyp süýjülikler, üç zona: esasy zal, VIP we açyk taras.'}
            </p>
          </motion.div>

          {/* Right — image with gold accent */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/5] overflow-hidden">
              <Image
                src="/images/photo_2026-06-19_18-49-30.jpg"
                alt="HOS art wall"
                fill className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080705]/50 to-transparent" />
            </div>
            {/* Gold counter badge — absolute, bottom-left outside image */}
            <div className="absolute -bottom-5 -left-5 w-28 h-28 bg-gold-500 flex flex-col items-center justify-center">
              <span className="font-display text-5xl font-light text-[#080705] leading-none">3</span>
              <span className="font-body text-[9px] font-medium tracking-[0.3em] uppercase text-[#080705]/70 mt-1">
                {ru ? 'Зоны' : 'Zona'}
              </span>
            </div>
          </motion.div>

        </div>
      </section>


      {/* ══════════════════════════════════════
          BAR — full-width cinematic photo
      ══════════════════════════════════════ */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src="/images/photo_2026-06-19_18-49-22.jpg"
          alt="HOS bar" fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#080705]/55" />
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <span className="section-label mb-5">{ru ? 'Наш бар' : 'Biziň bary'}</span>
          <h2 className="font-display text-[clamp(32px,5vw,72px)] font-light italic text-[#f0ece3] leading-tight">
            {ru ? 'Мастерство в каждом глотке' : 'Her owurtda ussatlyk'}
          </h2>
        </motion.div>
      </section>


      {/* ══════════════════════════════════════
          GALLERY — строгая сетка 3+1
      ══════════════════════════════════════ */}
      <section className="py-28 px-8 md:px-20">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="section-label mb-3">{ru ? 'Пространство' : 'Giňişlik'}</span>
              <h2 className="font-display text-[clamp(32px,4vw,52px)] font-light text-[#f0ece3]">
                {ru ? 'Интерьер' : 'Interior'}
              </h2>
            </div>
            <div className="hidden md:block h-px w-32 bg-gold-500/60" />
          </div>

          {/* Grid: верхний ряд 2 равные колонки, нижний ряд 2 равные колонки */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Верхние 2 */}
            {[
              { src: '/images/photo_2026-06-19_18-49-24.jpg', label: ru ? 'Основной зал' : 'Esasy zal' },
              { src: '/images/photo_2026-06-19_18-49-32.jpg', label: ru ? 'Атмосфера'   : 'Atmosfera' },
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }}
                className="relative overflow-hidden group aspect-[16/10]"
              >
                <Image src={img.src} alt={img.label} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[#080705]/20 group-hover:bg-[#080705]/10 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <span className="section-label">{img.label}</span>
                </div>
              </motion.div>
            ))}

            {/* Нижние 2 */}
            {[
              { src: '/images/photo_2026-06-19_18-49-30.jpg', label: ru ? 'Арт-стена' : 'Sungat diwary' },
              { src: '/images/photo_2026-06-19_18-49-27.jpg', label: ru ? 'Вход'       : 'Girelge' },
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 + 0.2, duration: 0.7 }}
                className="relative overflow-hidden group aspect-[16/10]"
              >
                <Image src={img.src} alt={img.label} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[#080705]/20 group-hover:bg-[#080705]/10 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <span className="section-label">{img.label}</span>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          QUOTE — philosophy banner
      ══════════════════════════════════════ */}
      <section className="relative py-36 overflow-hidden">
        <Image
          src="/images/photo_2026-06-19_18-49-32.jpg"
          alt="atmosphere" fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#080705]/75" />
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl mx-auto px-8 text-center"
        >
          <span className="section-label mb-8">{ru ? 'Философия' : 'Filosofiýa'}</span>
          <blockquote className="font-display text-[clamp(28px,4vw,56px)] font-light italic text-[#f0ece3] leading-snug mt-6">
            "Brutalism &amp; Beans:<br />
            <span className="text-gold-400">The Industrial Way"</span>
          </blockquote>
        </motion.div>
      </section>


      {/* ══════════════════════════════════════
          BOOKING CTA + INFO
      ══════════════════════════════════════ */}
      <section className="py-32 px-8 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <span className="section-label mb-6">{ru ? 'Бронирование' : 'Zakaz'}</span>
            <h2 className="font-display text-[clamp(32px,4vw,56px)] font-light text-[#f0ece3] leading-[1.15] mb-6">
              {ru
                ? <>Зарезервируйте<br /><span className="italic text-gold-400">ваш столик</span></>
                : <>Stolyňyzy<br /><span className="italic text-gold-400">zakaz ediň</span></>}
            </h2>
            <p className="text-[#7a7570] mb-10 leading-relaxed max-w-sm">
              {ru
                ? 'Три зоны для вашего отдыха. Подтверждение придёт по SMS — без ожидания у входа.'
                : 'Dynç almak üçin üç zona. Tassyklama SMS arkaly geler.'}
            </p>
            <Link href="/booking" className="btn-gold group">
              {tr.bookTable}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right — info cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}
            className="space-y-3"
          >
            {[
              { icon: MapPin, labelRu: 'Адрес',         labelTk: 'Salgy',     valueRu: 'Ашхабад, Туркменистан',      valueTk: 'Aşgabat, Türkmenistan' },
              { icon: Clock,  labelRu: 'Часы работы',   labelTk: 'Iş wagty',  valueRu: 'Ежедневно 09:00 – 23:00',   valueTk: 'Her gün 09:00 – 23:00' },
              { icon: Phone,  labelRu: 'Телефон',       labelTk: 'Telefon',   valueRu: '+993 62 XXXXXX',             valueTk: '+993 62 XXXXXX' },
            ].map(({ icon: Icon, labelRu, labelTk, valueRu, valueTk }, i) => (
              <div key={i} className="flex items-center gap-5 px-6 py-5 border border-[#1e1b16] bg-[#0d0c09]">
                <div className="w-10 h-10 border border-gold-500/40 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-gold-500" />
                </div>
                <div>
                  <p className="font-body text-[10px] font-medium tracking-[0.25em] uppercase text-[#5c5852] mb-0.5">
                    {ru ? labelRu : labelTk}
                  </p>
                  <p className="font-body text-[#c4bfb3] font-light">
                    {ru ? valueRu : valueTk}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </section>
    </>
  )
}
