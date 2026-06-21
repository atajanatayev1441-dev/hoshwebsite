'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'

const rooms = [
  {
    id: 'hall',
    labelRu: 'Основной зал',
    labelTk: 'Esasy zal',
    src: '/images/interior.jpg',
  },
  {
    id: 'bar',
    labelRu: 'Барная зона',
    labelTk: 'Bar zonagy',
    src: '/images/photo_2026-06-19_18-49-22.jpg',
  },
  {
    id: 'art',
    labelRu: 'Арт-стена',
    labelTk: 'Sungat diwary',
    src: '/images/art-wall.jpg',
  },
  {
    id: 'industrial',
    labelRu: '#Industrial зона',
    labelTk: '#Industrial zona',
    src: '/images/industrial.jpg',
  },
  {
    id: 'entrance',
    labelRu: 'Вход',
    labelTk: 'Girelge',
    src: '/images/hero.jpg',
  },
]

function Arrow({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) {
  const Icon = dir === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center transition-all duration-200 group"
      style={{
        width: 56, height: 56,
        background: 'rgba(10,10,10,0.6)',
        border: '1px solid rgba(201,168,76,0.3)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#FAFAF8',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.2)'
        ;(e.currentTarget as HTMLElement).style.borderColor = '#C9A84C'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(10,10,10,0.6)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)'
      }}
      aria-label={dir}
    >
      <Icon size={22} />
    </button>
  )
}

export function VirtualTour() {
  const { lang } = useLang()
  const ru = lang === 'ru'

  const [idx, setIdx]         = useState(0)
  const [dir, setDir]         = useState(1)
  const [fullscreen, setFS]   = useState(false)

  const go = useCallback((d: number) => {
    setDir(d)
    setIdx(i => (i + d + rooms.length) % rooms.length)
  }, [])

  const room = rooms[idx]

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? '8%' : '-8%', opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:   (d: number) => ({ x: d > 0 ? '-8%' : '8%', opacity: 0, scale: 0.97 }),
  }

  const Wrapper = fullscreen
    ? ({ children }: { children: React.ReactNode }) => (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0a0a0a' }}>
          <button
            onClick={() => setFS(false)}
            className="absolute top-4 right-4 z-10 flex items-center justify-center"
            style={{ width: 44, height: 44, background: 'rgba(10,10,10,0.7)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
          {children}
        </div>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>

  return (
    <Wrapper>
      <div className="relative w-full overflow-hidden" style={fullscreen ? { flex: 1 } : { aspectRatio: '16/9', maxHeight: '75vh' }}>

        {/* Photo */}
        <AnimatePresence initial={false} custom={dir} mode="sync">
          <motion.div
            key={idx}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.32, 0, 0.67, 0] }}
            className="absolute inset-0"
          >
            <Image
              src={room.src}
              alt={ru ? room.labelRu : room.labelTk}
              fill
              className="object-cover"
              priority
            />
            {/* Vignette */}
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.7) 100%)'
            }} />
          </motion.div>
        </AnimatePresence>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5" style={{
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.7), transparent)'
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '4px' }}>
              HOŞ LOUNGE — {ru ? 'Виртуальная экскурсия' : 'Wirtual gezelenç'}
            </p>
            <motion.p
              key={`label-${idx}`}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(16px, 2.5vw, 26px)', fontWeight: 300, color: '#FAFAF8' }}
            >
              {ru ? room.labelRu : room.labelTk}
            </motion.p>
          </div>

          <button
            onClick={() => setFS(f => !f)}
            style={{ background: 'rgba(10,10,10,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Side arrows */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
          <Arrow dir="left" onClick={() => go(-1)} />
        </div>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10">
          <Arrow dir="right" onClick={() => go(1)} />
        </div>

        {/* Bottom: room thumbnails nav */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-5" style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.85), transparent)'
        }}>
          <div className="flex gap-2 justify-center">
            {rooms.map((r, i) => (
              <button
                key={r.id}
                onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i) }}
                className="relative overflow-hidden transition-all duration-300"
                style={{
                  width: i === idx ? '80px' : '52px',
                  height: '40px',
                  border: i === idx ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,0.2)',
                  opacity: i === idx ? 1 : 0.6,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <Image src={r.src} alt={ru ? r.labelRu : r.labelTk} fill className="object-cover" />
                {i === idx && (
                  <div className="absolute inset-0" style={{ background: 'rgba(201,168,76,0.15)' }} />
                )}
              </button>
            ))}
          </div>

          {/* Counter */}
          <p className="text-center mt-3" style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)' }}>
            {String(idx + 1).padStart(2, '0')} / {String(rooms.length).padStart(2, '0')}
          </p>
        </div>
      </div>
    </Wrapper>
  )
}
