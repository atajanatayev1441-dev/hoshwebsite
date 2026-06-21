'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Maximize2, Minimize2 } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'

/* ─── MAP OF LOCATIONS ─────────────────────────────────────────────
   Each location has:
   - src: photo to show
   - neighbors: which location you reach by going forward/back/left/right
   User uploads real photos later — just change src values.
──────────────────────────────────────────────────────────────────── */
type Dir = 'forward' | 'back' | 'left' | 'right'

interface Location {
  id: string
  labelRu: string
  labelTk: string
  src: string
  neighbors: Partial<Record<Dir, string>>
}

const LOCATIONS: Location[] = [
  {
    id: 'entrance',
    labelRu: 'Вход',
    labelTk: 'Girelge',
    src: '/images/hero.jpg',
    neighbors: { forward: 'main-hall' },
  },
  {
    id: 'main-hall',
    labelRu: 'Основной зал',
    labelTk: 'Esasy zal',
    src: '/images/interior.jpg',
    neighbors: {
      back: 'entrance',
      left: 'bar',
      right: 'art-wall',
      forward: 'industrial',
    },
  },
  {
    id: 'bar',
    labelRu: 'Барная зона',
    labelTk: 'Bar zonagy',
    src: '/images/photo_2026-06-19_18-49-22.jpg',
    neighbors: { right: 'main-hall' },
  },
  {
    id: 'art-wall',
    labelRu: 'Арт-стена',
    labelTk: 'Sungat diwary',
    src: '/images/art-wall.jpg',
    neighbors: { left: 'main-hall' },
  },
  {
    id: 'industrial',
    labelRu: '#Industrial зона',
    labelTk: '#Industrial zona',
    src: '/images/industrial.jpg',
    neighbors: { back: 'main-hall', left: 'plant-area' },
  },
  {
    id: 'plant-area',
    labelRu: 'Зона отдыха',
    labelTk: 'Dynç alma zonagy',
    src: '/images/plant.jpg',
    neighbors: { right: 'industrial' },
  },
]

const LOC_MAP = Object.fromEntries(LOCATIONS.map(l => [l.id, l]))

/* ─── Direction arrow vectors (x/y offset from center as %) ─────── */
const ARROW_CONFIG: Record<Dir, { label: string; arrowChar: string; style: React.CSSProperties }> = {
  forward: {
    label: 'Вперёд',
    arrowChar: '↑',
    style: { bottom: '22%', left: '50%', transform: 'translateX(-50%)' },
  },
  back: {
    label: 'Назад',
    arrowChar: '↓',
    style: { top: '18%', left: '50%', transform: 'translateX(-50%)' },
  },
  left: {
    label: 'Влево',
    arrowChar: '←',
    style: { top: '50%', left: '8%', transform: 'translateY(-50%)' },
  },
  right: {
    label: 'Вправо',
    arrowChar: '→',
    style: { top: '50%', right: '8%', transform: 'translateY(-50%)' },
  },
}

/* ─── Transition zoom direction ─────────────────────────────────── */
const ZOOM_ORIGIN: Record<Dir, string> = {
  forward: 'center bottom',
  back:    'center top',
  left:    'left center',
  right:   'right center',
}

function NavArrow({ dir, label, onClick }: { dir: Dir; label: string; onClick: () => void }) {
  const { arrowChar, style } = ARROW_CONFIG[dir]
  return (
    <button
      onClick={onClick}
      title={label}
      className="absolute z-20 flex flex-col items-center gap-1.5 group"
      style={style}
    >
      {/* Outer ring pulse */}
      <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: 'rgba(201,168,76,0.5)' }} />

      {/* Main circle */}
      <span
        className="relative flex items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110"
        style={{
          width: 56, height: 56,
          background: 'rgba(10,10,10,0.65)',
          border: '2px solid rgba(201,168,76,0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#C9A84C',
          fontSize: '22px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.25)'
          ;(e.currentTarget as HTMLElement).style.borderColor = '#C9A84C'
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLElement).style.background = 'rgba(10,10,10,0.65)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.7)'
        }}
      >
        {arrowChar}
      </span>
    </button>
  )
}

/* ─── Main component ─────────────────────────────────────────────── */
export function VirtualTour() {
  const { lang } = useLang()
  const ru = lang === 'ru'

  const [currentId, setCurrentId] = useState<string>('entrance')
  const [prevId, setPrevId]       = useState<string | null>(null)
  const [exitDir, setExitDir]     = useState<Dir>('forward')
  const [isAnimating, setIsAnimating] = useState(false)
  const [fullscreen, setFullscreen]   = useState(false)

  const current = LOC_MAP[currentId]
  const label = ru ? current.labelRu : current.labelTk

  // Visited path for breadcrumb
  const [path, setPath] = useState<string[]>(['entrance'])

  const navigate = useCallback((dir: Dir) => {
    const nextId = current.neighbors[dir]
    if (!nextId || isAnimating) return
    setExitDir(dir)
    setIsAnimating(true)
    setPrevId(currentId)
    setTimeout(() => {
      setCurrentId(nextId)
      setPath(p => [...p, nextId])
      setIsAnimating(false)
    }, 420)
  }, [current, currentId, isAnimating])

  // Keyboard navigation
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    const map: Record<string, Dir> = {
      ArrowUp: 'forward', ArrowDown: 'back',
      ArrowLeft: 'left', ArrowRight: 'right',
      w: 'forward', s: 'back', a: 'left', d: 'right',
    }
    if (map[e.key]) navigate(map[e.key])
  }, [navigate])

  const Wrap = fullscreen
    ? ({ ch }: { ch: React.ReactNode }) => (
        <div className="fixed inset-0 z-50" style={{ background: '#000' }} tabIndex={0} onKeyDown={handleKey}>
          {ch}
        </div>
      )
    : ({ ch }: { ch: React.ReactNode }) => (
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9', maxHeight: '80vh' }} tabIndex={0} onKeyDown={handleKey}>
          {ch}
        </div>
      )

  const photoVariants = {
    enter:  { opacity: 0, scale: 1.08 },
    center: { opacity: 1, scale: 1 },
    exit:   { opacity: 0, scale: 1.04 },
  }

  return (
    <Wrap ch={
      <div className="relative w-full h-full" style={fullscreen ? { height: '100dvh' } : {}}>

        {/* ── Photo layer ── */}
        <AnimatePresence mode="sync">
          <motion.div
            key={currentId}
            variants={photoVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: 'absolute', inset: 0, transformOrigin: ZOOM_ORIGIN[exitDir] }}
          >
            <Image
              src={current.src}
              alt={label}
              fill
              className="object-cover"
              priority
            />
            {/* Dark vignette edges */}
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)'
            }} />
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40" style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
            }} />
          </motion.div>
        </AnimatePresence>

        {/* ── Top bar ── */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-start justify-between px-6 py-5" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)'
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500,
              letterSpacing: '0.42em', textTransform: 'uppercase',
              color: 'var(--gold)', marginBottom: '6px',
            }}>
              {ru ? 'ВИРТУАЛЬНАЯ ЭКСКУРСИЯ' : 'WIRTUAL GEZELENÇ'} · HOŞ LOUNGE
            </p>
            <AnimatePresence mode="wait">
              <motion.h3
                key={currentId}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 3vw, 32px)',
                  fontWeight: 300, fontStyle: 'italic', color: '#FAFAF8', margin: 0,
                }}
              >
                {label}
              </motion.h3>
            </AnimatePresence>
          </div>

          <button
            onClick={() => setFullscreen(f => !f)}
            style={{
              width: 40, height: 40, background: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)', color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        {/* ── Directional nav arrows ── */}
        {(Object.keys(current.neighbors) as Dir[]).map(dir => (
          <NavArrow
            key={dir}
            dir={dir}
            label={ru ? ARROW_CONFIG[dir].label : ARROW_CONFIG[dir].label}
            onClick={() => navigate(dir)}
          />
        ))}

        {/* ── Destination preview on hover (mini tooltip) ── */}
        {(Object.entries(current.neighbors) as [Dir, string][]).map(([dir, destId]) => {
          const dest = LOC_MAP[destId]
          if (!dest) return null
          const destLabel = ru ? dest.labelRu : dest.labelTk
          const { style } = ARROW_CONFIG[dir]

          // Offset label below/above arrow
          const labelOffset: React.CSSProperties = dir === 'forward'
            ? { bottom: 'calc(22% - 36px)' }
            : dir === 'back'
            ? { top: 'calc(18% - 36px)' }
            : dir === 'left'
            ? { top: '50%', left: 'calc(8% + 64px)', transform: 'translateY(-50%)' }
            : { top: '50%', right: 'calc(8% + 64px)', transform: 'translateY(-50%)' }

          return (
            <div
              key={`label-${dir}`}
              className="absolute z-10 pointer-events-none"
              style={
                dir === 'left' || dir === 'right'
                  ? labelOffset
                  : { ...style, ...labelOffset, left: '50%', transform: 'translateX(-50%)' }
              }
            >
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.85)',
                background: 'rgba(0,0,0,0.45)',
                padding: '3px 10px',
                backdropFilter: 'blur(6px)',
                whiteSpace: 'nowrap',
              }}>
                {destLabel}
              </span>
            </div>
          )
        })}

        {/* ── Bottom: breadcrumb path + room dots ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-5">
          {/* Room dots */}
          <div className="flex gap-2 justify-center mb-3">
            {LOCATIONS.map(loc => {
              const visited = path.includes(loc.id)
              const isCurrent = loc.id === currentId
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    if (!isAnimating && loc.id !== currentId) {
                      setPrevId(currentId)
                      setCurrentId(loc.id)
                      setPath(p => [...p, loc.id])
                    }
                  }}
                  title={ru ? loc.labelRu : loc.labelTk}
                  style={{
                    width: isCurrent ? 28 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: isCurrent ? 'var(--gold)' : visited ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.35s ease',
                    padding: 0,
                  }}
                />
              )
            })}
          </div>

          {/* Location name + hint */}
          <div className="flex items-center justify-between">
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              {path.length > 1 ? (ru ? `${path.length - 1} шаг${path.length - 1 > 1 ? 'а' : ''}` : `${path.length - 1} ädim`) : (ru ? 'Начало' : 'Başlangyç')}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
              {ru ? '← → ↑ ↓ для навигации' : '← → ↑ ↓ nawigasiýa üçin'}
            </p>
          </div>
        </div>

        {/* ── Fullscreen close hint ── */}
        {fullscreen && (
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-5 right-16 z-40 flex items-center gap-2"
            style={{
              background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)', color: '#fff', padding: '8px 14px', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.1em',
            }}
          >
            <X size={14} /> {ru ? 'Выйти' : 'Çyk'}
          </button>
        )}
      </div>
    } />
  )
}
