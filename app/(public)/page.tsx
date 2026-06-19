'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import { ArrowRight, ChevronDown, Star, Clock, MapPin } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function HomePage() {
  const { lang } = useLang()
  const tr = translations[lang]

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-sage-50 via-cream-100 to-cream-200 dark:from-sage-950 dark:via-sage-900 dark:to-sage-950">
        {/* Decorative circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sage-200/40 dark:bg-sage-800/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cream-300/50 dark:bg-sage-700/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-200 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-sage-200 dark:border-sage-700"
          >
            <Star className="w-3.5 h-3.5 fill-sage-500 text-sage-500" />
            Ashgabat, Turkmenistan
          </motion.div>

          {/* Title */}
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-playfair text-5xl md:text-7xl font-bold text-sage-900 dark:text-cream-50 mb-4 leading-tight"
          >
            HOS
            <br />
            <span className="italic text-sage-600 dark:text-sage-300">Coffee Lounge</span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-xl md:text-2xl font-playfair italic text-sage-600 dark:text-sage-300 mb-3"
          >
            {tr.heroTagline}
          </motion.p>

          <motion.p
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-sage-500 dark:text-sage-400 mb-10 text-base md:text-lg"
          >
            {tr.heroSubtitle}
          </motion.p>

          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/menu"
              className="btn-primary flex items-center justify-center gap-2 group"
            >
              {tr.viewMenu}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/booking" className="btn-secondary flex items-center justify-center gap-2">
              {tr.bookTable}
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-sage-400"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-sage-800 dark:text-cream-100 mb-3">
            {lang === 'ru' ? 'Почему выбирают нас' : 'Näme üçin bizi saýlaýarlar'}
          </h2>
          <div className="w-16 h-0.5 bg-sage-400 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Star className="w-6 h-6" />,
              titleRu: 'Авторский кофе',
              titleTk: 'Awtor kofe',
              descRu: 'Зёрна высшего сорта из лучших плантаций мира',
              descTk: 'Dünýäniň iň oňat plantasiýalaryndan premium derejeli däneler',
            },
            {
              icon: <Clock className="w-6 h-6" />,
              titleRu: 'Быстро и свежо',
              titleTk: 'Çalt we täze',
              descRu: 'Каждый напиток готовится прямо при вас за несколько минут',
              descTk: 'Her içgi birnäçe minudyň içinde siziň öňüňizde taýýarlanýar',
            },
            {
              icon: <MapPin className="w-6 h-6" />,
              titleRu: 'Уютная атмосфера',
              titleTk: 'Amatly atmosfera',
              descRu: 'Три зоны: основной зал, VIP и открытая терраса',
              descTk: 'Üç zona: esasy zal, VIP we açyk taras',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 text-center group hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-sage-100 dark:bg-sage-800 flex items-center justify-center text-sage-600 dark:text-sage-300 mx-auto mb-4 group-hover:bg-sage-200 dark:group-hover:bg-sage-700 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-playfair font-semibold text-lg text-sage-800 dark:text-cream-100 mb-2">
                {lang === 'ru' ? item.titleRu : item.titleTk}
              </h3>
              <p className="text-sage-500 dark:text-sage-400 text-sm leading-relaxed">
                {lang === 'ru' ? item.descRu : item.descTk}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sage-700 dark:bg-sage-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-playfair text-3xl md:text-4xl font-semibold mb-4"
          >
            {lang === 'ru' ? 'Зарезервируйте столик' : 'Stol zakaz ediň'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sage-200 mb-8 text-lg"
          >
            {lang === 'ru'
              ? 'Подтверждение придёт по SMS. Без ожидания у входа.'
              : 'Tassyklama SMS arkaly geler. Girelgede garaşmazlyk.'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-white text-sage-800 hover:bg-cream-100 px-8 py-4 rounded-xl font-semibold transition-colors group"
            >
              {tr.bookTable}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
