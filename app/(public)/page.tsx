'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import { ArrowRight, ArrowDown, MapPin, Clock, Phone } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
}

const GALLERY = [
  { src: '/images/photo_2026-06-19_18-49-22.jpg', alt: 'Бар HOS', label: 'The Bar' },
  { src: '/images/photo_2026-06-19_18-49-24.jpg', alt: 'Основной зал', label: 'Main Hall' },
  { src: '/images/photo_2026-06-19_18-49-30.jpg', alt: 'Арт-стена', label: 'Art Wall' },
  { src: '/images/photo_2026-06-19_18-49-32.jpg', alt: 'Интерьер', label: 'Atmosphere' },
]

export default function HomePage() {
  const { lang } = useLang()
  const tr = translations[lang]
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <>
      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Parallax background */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src="/images/photo_2026-06-19_18-49-27.jpg"
            alt="HOS Lounge exterior"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-carbon-950/70 via-carbon-950/40 to-carbon-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon-950/60 via-transparent to-transparent" />
        </motion.div>

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col items-start justify-center px-8 md:px-20 max-w-7xl mx-auto"
        >
          <motion.p
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="section-label mb-6"
          >
            {lang === 'ru' ? 'Кофе-лаунж · Ашхабад' : 'Kofe Lounge · Aşgabat'}
          </motion.p>

          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="font-playfair text-6xl md:text-8xl lg:text-[110px] font-bold text-concrete-100 leading-none mb-2"
          >
            HOS
          </motion.h1>

          <motion.h2
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="font-playfair text-4xl md:text-6xl lg:text-7xl text-gold-400 italic font-medium leading-none mb-8"
          >
            Lounge
          </motion.h2>

          <motion.p
            custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="text-concrete-300 text-base md:text-lg max-w-md mb-12 leading-relaxed font-light"
          >
            {lang === 'ru'
              ? 'Brutalism & Beans — пространство, где индустриальная эстетика встречается с безупречным кофе'
              : 'Brutalism & Beans — senagat estetikasy kämil kofe bilen duşuşýan mekan'}
          </motion.p>

          <motion.div
            custom={4} variants={fadeUp} initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/menu" className="btn-gold flex items-center gap-3 group">
              {tr.viewMenu}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/booking" className="btn-outline">
              {tr.bookTable}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-concrete-500"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── MARQUEE STRIP ─── */}
      <div className="bg-gold-500 py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="text-carbon-950 text-xs font-bold tracking-[0.3em] uppercase mx-8">
              Wake Up · Drink Coffee · Create &nbsp;&nbsp;·&nbsp;&nbsp; Brutalism &amp; Beans · The Industrial Way &nbsp;&nbsp;·&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ─── INTRO ─── */}
      <section className="py-28 px-8 md:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-label mb-5">
              {lang === 'ru' ? 'О нас' : 'Biz hakda'}
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl text-concrete-100 leading-tight mb-6">
              {lang === 'ru'
                ? <>Место, где<br /><span className="italic text-gold-400">каждая чашка</span><br />— это искусство</>
                : <>Her käse<br /><span className="italic text-gold-400">sungat</span><br />eseri</>}
            </h2>
            <p className="text-concrete-400 leading-relaxed mb-6 font-light">
              {lang === 'ru'
                ? 'HOS Lounge — это не просто кофейня. Это пространство с уникальным индустриальным характером, где бетонные стены хранят историю, а тёплый свет создаёт особую атмосферу для встреч и вдохновения.'
                : 'HOS Lounge — diňe bir kofehanasy däl. Bu, beton diwarlaryň taryhy saklap, ýyly yşygyň duşuşmak we ylham üçin aýratyn atmosfera döredýän özboluşly industrial häsiýetli mekan.'}
            </p>
            <p className="text-concrete-400 leading-relaxed font-light">
              {lang === 'ru'
                ? 'Авторский кофе, изысканные десерты и три уникальные зоны — основной зал, VIP и открытая терраса.'
                : 'Awtor kofe, ajaýyp süýjülikler we üç özboluşly zona — esasy zal, VIP we açyk taras.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative h-[500px] overflow-hidden">
              <Image
                src="/images/photo_2026-06-19_18-49-30.jpg"
                alt="HOS Art Wall"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/60 to-transparent" />
            </div>
            {/* Gold accent box */}
            <div className="absolute -bottom-6 -left-6 bg-gold-500 p-6 w-36 h-36 flex flex-col items-center justify-center text-center">
              <span className="font-playfair text-4xl font-bold text-carbon-950 leading-none">3</span>
              <span className="text-carbon-950 text-xs font-semibold tracking-widest uppercase mt-1">
                {lang === 'ru' ? 'Зоны' : 'Zona'}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FULL-BLEED BAR PHOTO ─── */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src="/images/photo_2026-06-19_18-49-22.jpg"
          alt="HOS Bar"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-carbon-950/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center px-4"
          >
            <p className="section-label mb-4">
              {lang === 'ru' ? 'Наш бар' : 'Biziň bary'}
            </p>
            <h2 className="font-playfair text-5xl md:text-7xl text-concrete-100 font-bold italic">
              {lang === 'ru' ? 'Мастерство<br/>в каждом глотке' : 'Her owurtda<br/>ussatlyk'}
            </h2>
          </motion.div>
        </div>
      </section>

      {/* ─── PHOTO GALLERY ─── */}
      <section className="py-24 px-8 md:px-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="section-label mb-3">
              {lang === 'ru' ? 'Интерьер' : 'Interior'}
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl text-concrete-100">
              {lang === 'ru' ? 'Пространство' : 'Giňişlik'}
            </h2>
          </div>
          <div className="hidden md:block w-24 h-px bg-gold-500" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {GALLERY.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className={`relative overflow-hidden group ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              style={{ height: i === 0 ? '480px' : '230px' }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-carbon-950/30 group-hover:bg-carbon-950/10 transition-colors duration-500" />
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-semibold tracking-widest uppercase text-gold-400">
                  {img.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── ATMOSPHERE QUOTE ─── */}
      <section className="relative py-32 overflow-hidden">
        <Image
          src="/images/photo_2026-06-19_18-49-32.jpg"
          alt="HOS atmosphere"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-carbon-950/75" />
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="section-label mb-8">
              {lang === 'ru' ? 'Философия' : 'Filosofiýa'}
            </p>
            <blockquote className="font-playfair text-3xl md:text-5xl text-concrete-100 italic leading-tight mb-8">
              "Brutalism &amp; Beans:<br />
              <span className="text-gold-400">The Industrial Way"</span>
            </blockquote>
            <p className="text-concrete-400 max-w-xl mx-auto font-light leading-relaxed">
              {lang === 'ru'
                ? 'Сырые текстуры, тёплый свет и безупречный кофе — наш способ переосмыслить городское пространство'
                : 'Çig dokumalar, ýyly yşyk we kämil kofe — şäher giňişligini täzeden düşünmek usulymy'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA BOOKING ─── */}
      <section className="py-28 px-8 md:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="section-label mb-5">
              {lang === 'ru' ? 'Бронирование' : 'Zakaz'}
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl text-concrete-100 leading-tight mb-6">
              {lang === 'ru'
                ? <>Зарезервируйте<br /><span className="italic text-gold-400">ваш столик</span></>
                : <>Stolyňyzy<br /><span className="italic text-gold-400">zakaz ediň</span></>}
            </h2>
            <p className="text-concrete-400 mb-8 font-light leading-relaxed">
              {lang === 'ru'
                ? 'Три уникальные зоны для вашего отдыха. Подтверждение придёт по SMS — без ожидания у входа.'
                : 'Dynç almak üçin üç özboluşly zona. Tassyklama SMS arkaly geler — girelgede garaşmazlyk.'}
            </p>
            <Link href="/booking" className="btn-gold inline-flex items-center gap-3 group">
              {tr.bookTable}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="grid grid-cols-1 gap-4"
          >
            {[
              { icon: MapPin, label: lang === 'ru' ? 'Адрес' : 'Salgy', value: lang === 'ru' ? 'Ашхабад, Туркменистан' : 'Aşgabat, Türkmenistan' },
              { icon: Clock, label: lang === 'ru' ? 'Часы работы' : 'Iş wagty', value: lang === 'ru' ? 'Ежедневно 09:00 – 23:00' : 'Her gün 09:00 – 23:00' },
              { icon: Phone, label: lang === 'ru' ? 'Телефон' : 'Telefon', value: '+993 62 XXXXXX' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-center gap-5 p-5 border border-carbon-800 bg-carbon-900">
                  <div className="w-10 h-10 border border-gold-500 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gold-500" />
                  </div>
                  <div>
                    <p className="text-xs text-concrete-500 tracking-widest uppercase mb-0.5">{item.label}</p>
                    <p className="text-concrete-200 font-medium">{item.value}</p>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </>
  )
}
