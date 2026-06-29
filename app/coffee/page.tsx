'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Phone, Coffee, Leaf, Star } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'

export default function CoffeePage() {
  const { lang } = useLang()
  const ru = lang === 'ru'

  const features = [
    {
      icon: Coffee,
      titleRu: 'Авторский кофе',
      titleTk: 'Awtor kofe',
      descRu: 'Моносорта и купажи от ведущих обжарщиков мира',
      descTk: 'Dünýäniň öňdebaryjy gowurujylaryndan monosortlar',
    },
    {
      icon: Leaf,
      titleRu: 'Натуральный состав',
      titleTk: 'Tebigy düzüm',
      descRu: 'Только свежие ингредиенты, никаких консервантов',
      descTk: 'Diňe täze ingredientler, hiç hili konserwant ýok',
    },
    {
      icon: Star,
      titleRu: 'Уютная атмосфера',
      titleTk: 'Amatly atmosfera',
      descRu: 'Пространство для работы, встреч и отдыха',
      descTk: 'Iş, duşuşyk we dynç almak üçin giňişlik',
    },
  ]

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#FAFAF8' }}>

      {/* Back to main */}
      <div className="fixed top-20 left-5 sm:left-8 z-40">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none',
            transition: 'color 0.25s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          {ru ? 'HOŞ Lounge' : 'HOŞ Lounge'}
        </Link>
      </div>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ minHeight: '100vh', padding: '120px 24px 80px' }}>

        {/* Sage green ambient glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(107,131,107,0.12) 0%, transparent 70%)',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          {/* Logo — mix-blend-mode screen убирает фон */}
          <div className="relative mb-10" style={{ width: 'clamp(200px, 45vw, 320px)', aspectRatio: '1/1' }}>
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(107,131,107,0.08) 0%, transparent 70%)',
            }} />
            <Image
              src="/images/coffee-logo.webp"
              alt="HOŞ Coffee"
              fill
              className="object-contain"
              style={{ mixBlendMode: 'screen', filter: 'brightness(1.1) contrast(1.1)' }}
              priority
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.5em', textTransform: 'uppercase',
              color: 'rgba(107,131,107,0.8)', display: 'block', marginBottom: '20px',
            }}>
              {ru ? 'КОФЕЙНЯ · АШХАБАД' : 'KOFEHANA · AŞGABAT'}
            </span>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(52px, 12vw, 110px)',
              fontWeight: 300, lineHeight: 0.9,
              color: '#FAFAF8', letterSpacing: '-0.02em',
              marginBottom: '8px',
            }}>
              HOŞ
            </h1>
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 6vw, 56px)',
              fontWeight: 300, fontStyle: 'italic',
              color: 'rgba(107,131,107,0.9)',
              marginBottom: '36px',
            }}>
              Coffee
            </p>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(14px, 2vw, 16px)',
              fontWeight: 300, lineHeight: 1.8,
              color: '#6B6B6B',
              maxWidth: '440px', margin: '0 auto 48px',
            }}>
              {ru
                ? 'Место где каждая чашка — результат мастерства. Третья волна кофе, уютное пространство, внимание к деталям.'
                : 'Her käse ussatlygyň netijesi. Üçünji tolkun kofe, amatly giňişlik, jikme-jikliklere üns.'}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="tel:+99362XXXXXX"
                className="btn-gold"
                style={{ gap: '10px' }}
              >
                <Phone size={14} />
                {ru ? 'ПОЗВОНИТЬ' : 'JAŇ ET'}
              </a>
              <Link href="/" className="btn-outline">
                {ru ? 'HOŞ LOUNGE' : 'HOŞ LOUNGE'}
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, rgba(107,131,107,0.5))' }} />
        </motion.div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* ── FEATURES ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 0' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.06)' }}>
            {features.map(({ icon: Icon, titleRu, titleTk, descRu, descTk }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="flex flex-col items-start gap-5 p-8"
                style={{ background: '#0a0a0a' }}
              >
                <div style={{
                  width: 44, height: 44,
                  border: '1px solid rgba(107,131,107,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} style={{ color: 'rgba(107,131,107,0.8)' }} />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '22px', fontWeight: 300,
                    color: '#FAFAF8', marginBottom: '10px',
                  }}>
                    {ru ? titleRu : titleTk}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px', fontWeight: 300,
                    color: '#6B6B6B', lineHeight: 1.7,
                  }}>
                    {ru ? descRu : descTk}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* ── INFO ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 0' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px', fontWeight: 500,
              letterSpacing: '0.45em', textTransform: 'uppercase',
              color: 'rgba(107,131,107,0.7)',
              display: 'block', marginBottom: '20px',
            }}>
              {ru ? 'КАК НАС НАЙТИ' : 'NÄDIP TAPMALY'}
            </span>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 300, color: '#FAFAF8',
            }}>
              {ru ? 'Мы здесь' : 'Biz bu ýerde'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {[
              { icon: MapPin, labelRu: 'АДРЕС', labelTk: 'SALGY', valRu: 'Ашхабад, Туркменистан', valTk: 'Aşgabat, Türkmenistan' },
              { icon: Clock,  labelRu: 'ЧАСЫ',  labelTk: 'SAGAT', valRu: 'Ежедневно 08:00 – 22:00', valTk: 'Her gün 08:00 – 22:00' },
              { icon: Phone,  labelRu: 'ТЕЛЕФОН', labelTk: 'TELEFON', valRu: '+993 62 XXXXXX', valTk: '+993 62 XXXXXX' },
            ].map(({ icon: Icon, labelRu, labelTk, valRu, valTk }, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4 p-8" style={{ background: '#0a0a0a' }}>
                <Icon size={18} style={{ color: 'rgba(107,131,107,0.7)' }} />
                <div>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '9px', fontWeight: 500,
                    letterSpacing: '0.35em', textTransform: 'uppercase',
                    color: '#3a3a3a', marginBottom: '8px',
                  }}>
                    {ru ? labelRu : labelTk}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px', fontWeight: 300,
                    color: '#9a9a9a',
                  }}>
                    {ru ? valRu : valTk}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 20px', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px', fontWeight: 300,
          color: '#2a2a2a', letterSpacing: '0.3em', textTransform: 'uppercase',
        }}>
          © {new Date().getFullYear()} HOŞ Coffee · Ашхабад
        </p>
      </div>
    </div>
  )
}
