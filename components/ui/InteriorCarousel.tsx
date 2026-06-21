'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'

const slides = [
  { src: '/images/interior.jpg',                        labelRu: 'Основной зал',      labelTk: 'Esasy zal' },
  { src: '/images/photo_2026-06-19_18-49-24.jpg',       labelRu: 'Атмосфера',         labelTk: 'Atmosfera' },
  { src: '/images/photo_2026-06-19_18-49-22.jpg',       labelRu: 'Бар',               labelTk: 'Bar' },
  { src: '/images/photo_2026-06-19_18-49-32.jpg',       labelRu: 'Brutalism & Beans', labelTk: 'Brutalism & Beans' },
  { src: '/images/art-wall.jpg',                        labelRu: 'Арт-стена',         labelTk: 'Sungat diwary' },
]

export function InteriorCarousel() {
  const { lang } = useLang()
  const ru = lang === 'ru'
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)

  const go = useCallback((d: number) => {
    setDir(d)
    setIndex(i => (i + d + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => go(1), 4500)
    return () => clearInterval(t)
  }, [paused, go])

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div
      className="relative overflow-hidden w-full"
      style={{ aspectRatio: '16/9', maxHeight: '75vh' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={dir} mode="sync">
        <motion.div
          key={index}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.32, 0, 0.67, 0] }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index].src}
            alt={ru ? slides[index].labelRu : slides[index].labelTk}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(10,9,8,0.7) 0%, rgba(10,9,8,0.1) 50%, transparent 100%)'
          }} />

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-8 left-8 md:left-12"
          >
            <p style={{
              fontFamily: 'var(--font-dm-sans, system-ui)',
              fontSize: '10px', letterSpacing: '0.4em',
              textTransform: 'uppercase', color: '#C9A84C',
              marginBottom: '6px',
            }}>
              {`0${index + 1} / 0${slides.length}`}
            </p>
            <p style={{
              fontFamily: 'var(--font-cormorant, Georgia, serif)',
              fontSize: 'clamp(22px, 3vw, 38px)', fontWeight: 300,
              fontStyle: 'italic', color: '#f5f0e8',
            }}>
              {ru ? slides[index].labelRu : slides[index].labelTk}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all duration-200"
        style={{
          width: '48px', height: '48px',
          background: 'rgba(10,9,8,0.5)',
          border: '1px solid rgba(201,168,76,0.3)',
          backdropFilter: 'blur(8px)',
          color: '#f5f0e8',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#C9A84C')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)')}
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all duration-200"
        style={{
          width: '48px', height: '48px',
          background: 'rgba(10,9,8,0.5)',
          border: '1px solid rgba(201,168,76,0.3)',
          backdropFilter: 'blur(8px)',
          color: '#f5f0e8',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#C9A84C')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)')}
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 right-8 md:right-12 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDir(i > index ? 1 : -1); setIndex(i) }}
            style={{
              width: i === index ? '24px' : '6px',
              height: '6px',
              background: i === index ? '#C9A84C' : 'rgba(245,240,232,0.35)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.4s ease',
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <motion.div
          key={`${index}-progress`}
          initial={{ scaleX: 0, transformOrigin: 'left' }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 4.5, ease: 'linear' }}
          className="absolute bottom-0 left-0 right-0 h-0.5 z-10"
          style={{ background: '#C9A84C' }}
        />
      )}
    </div>
  )
}
