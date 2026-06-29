'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/components/providers/LangProvider'
import { useCart } from '@/components/providers/CartProvider'
import { ArrowRight, MapPin, Clock, Phone, Plus } from 'lucide-react'
import { CoffeeCartDrawer } from '@/components/coffee/CoffeeCartDrawer'

// ── Color tokens ──────────────────────────────────────
const BG      = '#f0ede6'
const SURFACE = '#edeae2'
const TEXT    = '#1c1c1c'
const MUTED   = '#8a857e'
const SAGE    = '#6b7d68'
const SAGE_DIM = 'rgba(107,125,104,0.6)'
const BORDER  = 'rgba(0,0,0,0.08)'

// ── Types ─────────────────────────────────────────────
interface CategoryItem {
  id: number
  name_ru: string
  name_tk: string
  description_ru: string | null
  description_tk: string | null
  price: number
  imageUrl: string | null
  available: boolean
  featured: boolean
}

interface Category {
  id: number
  name_ru: string
  name_tk: string
  items: CategoryItem[]
}

export default function CoffeePage() {
  const { lang } = useLang()
  const { addItem, setCartOpen } = useCart()
  const ru = lang === 'ru'
  const heroRef = useRef<HTMLDivElement>(null)

  const [categories, setCategories] = useState<Category[]>([])
  const [activeTab, setActiveTab] = useState<number | null>(null)
  const [menuLoading, setMenuLoading] = useState(true)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY    = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // Fetch dynamic menu
  useEffect(() => {
    fetch('/api/coffee/categories')
      .then((r) => r.json())
      .then((data: Category[]) => {
        setCategories(data)
        if (data.length > 0) setActiveTab(data[0].id)
        setMenuLoading(false)
      })
      .catch(() => setMenuLoading(false))
  }, [])

  // GSAP scroll animations
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cleanup: (() => void) | undefined
    ;(async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsap.utils.toArray<HTMLElement>('[data-animate-c]').forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 40, duration: 1, ease: 'power2.out',
          delay: el.dataset.delay ? parseFloat(el.dataset.delay) : 0,
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        })
      })
      document.querySelectorAll<HTMLElement>('[data-count-c]').forEach((el) => {
        const target = parseInt(el.dataset.countC || '0')
        const obj = { n: 0 }
        ScrollTrigger.create({
          trigger: el, start: 'top 80%', once: true,
          onEnter: () => gsap.to(obj, {
            n: target, duration: 1.5, ease: 'power1.out', snap: { n: 1 },
            onUpdate() { el.textContent = String(Math.round(obj.n)) },
          }),
        })
      })
      cleanup = () => ScrollTrigger.getAll().forEach((t) => t.kill())
    })()
    return () => cleanup?.()
  }, [])

  const activeItems = categories.find((c) => c.id === activeTab)?.items ?? []
  const fmt = (p: number) => new Intl.NumberFormat('ru-RU').format(p) + ' TMT'

  const Divider = () => (
    <div style={{ height: '1px', background: BORDER, margin: 0 }} />
  )

  return (
    <div style={{ background: BG, color: TEXT }}>

      {/* ══════════════════════════════════════
          HERO — dark overlay, white text
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
          <Image
            src="/images/coffee/photo_5_2026-06-29_19-37-02.jpg"
            alt="HOŞ Coffee интерьер"
            fill priority quality={90}
            className="object-cover object-center"
          />
        </motion.div>
        {/* Dark gradient overlay — text will be white */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(15,18,12,0.75) 40%, rgba(15,18,12,0.3) 100%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(15,18,12,0.6) 0%, transparent 50%)',
        }} />

        <motion.div
          style={{ opacity: fadeOut }}
          className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 md:px-20 max-w-4xl"
        >
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.45em', textTransform: 'uppercase',
              color: SAGE, display: 'block', marginBottom: '28px',
            }}>
              {ru ? 'КОФЕЙНЯ · АШХАБАД' : 'KOFEHANA · AŞGABAT'}
            </span>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(90px, 14vw, 180px)',
              fontWeight: 300, lineHeight: 0.85,
              color: '#f0ede6', letterSpacing: '-0.02em', margin: 0,
            }}>
              HOŞ
            </h1>
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(44px, 7vw, 90px)',
              fontWeight: 300, fontStyle: 'italic',
              color: SAGE, lineHeight: 1, marginBottom: '44px',
            }}>
              Coffee
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#menu" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                background: SAGE, color: '#fff',
                padding: '14px 32px',
                fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                transition: 'background 0.25s', cursor: 'pointer', textDecoration: 'none',
              }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#5a6b57')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = SAGE)}
              >
                {ru ? 'СМОТРЕТЬ МЕНЮ' : 'MENÝUNY GÖR'}
                <ArrowRight size={14} />
              </a>
              <a href="#booking" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                border: `1px solid rgba(240,237,230,0.4)`, color: '#f0ede6',
                padding: '14px 32px',
                fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                transition: 'all 0.25s', cursor: 'pointer', textDecoration: 'none',
              }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(240,237,230,0.1)'
                  el.style.borderColor = 'rgba(240,237,230,0.7)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.borderColor = 'rgba(240,237,230,0.4)'
                }}
              >
                {ru ? 'ЗАБРОНИРОВАТЬ' : 'ZAKAZ ETMEK'}
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9 }}
          className="absolute bottom-0 left-0 right-0"
          style={{ borderTop: '1px solid rgba(240,237,230,0.12)', background: 'rgba(15,18,12,0.55)', backdropFilter: 'blur(12px)' }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-3 divide-x" style={{ '--tw-divide-color': 'rgba(240,237,230,0.1)' } as React.CSSProperties}>
            {[
              { count: 2,  label: ru ? 'ЗОНЫ'    : 'ZONALAR' },
              { count: 38, label: ru ? 'ПОЗИЦИЙ' : 'POZISIÝA' },
              { count: 0,  label: ru ? 'ЧАСЫ'    : 'SAGAT', display: '08–22' },
            ].map((s, i) => (
              <div key={i} className="py-4 sm:py-6 flex flex-col items-center gap-1">
                {s.count > 0
                  ? <span data-count-c={s.count} style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px,5vw,48px)', fontWeight: 300, color: SAGE, lineHeight: 1 }}>0</span>
                  : <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px,5vw,48px)', fontWeight: 300, color: SAGE, lineHeight: 1 }}>{s.display}</span>
                }
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(7px,2vw,9px)', fontWeight: 500, letterSpacing: '0.2em', color: 'rgba(240,237,230,0.45)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          MARQUEE — sage green
      ══════════════════════════════════════ */}
      <div style={{ background: SAGE, overflow: 'hidden', padding: '13px 0' }}>
        <div className="flex animate-marquee whitespace-nowrap select-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="mx-8" style={{
              fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.42em', textTransform: 'uppercase', color: '#fff',
            }}>
              Good Morning &nbsp;·&nbsp; Freshly Roasted &nbsp;·&nbsp; Third Wave &nbsp;·&nbsp; Specialty Coffee &nbsp;·&nbsp; #HOŞCoffee
            </span>
          ))}
        </div>
      </div>

      <Divider />

      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      <section id="about" style={{ padding: 'clamp(60px, 10vw, 120px) 0', background: BG }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          <div data-animate-c>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: SAGE, display: 'block', marginBottom: '20px' }}>
              {ru ? 'О НАС' : 'BIZ HAKDA'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, lineHeight: 1.1, color: TEXT, marginBottom: '28px' }}>
              {ru
                ? <>{`Место, где каждая чашка —`}<br /><em style={{ color: SAGE }}>искусство</em></>
                : <>{`Her käse —`}<br /><em style={{ color: SAGE }}>sungat eseri</em></>}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.9, color: MUTED, fontSize: '15px', marginBottom: '16px', maxWidth: '440px' }}>
              {ru
                ? 'HOŞ Coffee — это не просто кофейня. Это пространство, где каждая чашка создаётся с любовью и вниманием к деталям. Мы работаем только со свежеобжаренными зёрнами от лучших хозяйств мира.'
                : 'HOŞ Coffee — diňe bir kofehana däl. Bu ýerde her käse söýgi we jikme-jikliklere üns bilen taýýarlanýar. Biz dünýäniň iň gowy fermalaryndan täze gowrulan däneler bilen işleýäris.'}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.9, color: 'rgba(138,133,126,0.6)', fontSize: '14px', maxWidth: '420px', marginBottom: '40px' }}>
              {ru
                ? 'Авторский кофе, свежая выпечка, уютные зоны для работы и отдыха.'
                : 'Awtor kofe, täze çörek önümleri, iş we dynç alyş üçin amatly zonaları.'}
            </p>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-0" style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '32px' }}>
              {[
                { count: 2,  label: ru ? 'Зоны'       : 'Zona' },
                { count: 38, label: ru ? 'Позиций'    : 'Menýu' },
                { count: 5,  label: ru ? 'Лет опыта'  : 'Ýyl tejribe' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '0 24px 0 0', borderRight: i < 2 ? `1px solid ${BORDER}` : 'none', marginLeft: i > 0 ? '24px' : 0 }}>
                  <div data-count-c={s.count} style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', fontWeight: 300, color: SAGE, lineHeight: 1 }}>0</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: MUTED, marginTop: '8px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            data-animate-c data-delay="0.15"
            className="relative overflow-hidden"
            style={{ aspectRatio: '4/5', minHeight: '400px' }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/images/coffee/photo_1_2026-06-29_19-37-02.jpg"
              alt="HOŞ Coffee"
              fill
              className="object-cover"
              style={{ objectPosition: 'center' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: `linear-gradient(to top, rgba(62,78,58,0.35), transparent)` }} />
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          PHILOSOPHY — photo_6 as full bg
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ padding: 'clamp(80px, 12vw, 140px) 0' }}>
        <Image
          src="/images/coffee/photo_6_2026-06-29_19-37-02.jpg"
          alt="HOŞ Coffee атмосфера"
          fill
          className="object-cover object-center"
          style={{ filter: 'brightness(0.4)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,12,10,0.55)' }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 md:px-20 text-center" data-animate-c>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.45em', textTransform: 'uppercase', color: SAGE, display: 'block', marginBottom: '24px' }}>
            {ru ? 'ФИЛОСОФИЯ' : 'FILOSOFIÝA'}
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(52px, 10vw, 120px)', fontWeight: 300, lineHeight: 0.9, color: '#fff', letterSpacing: '-0.02em', marginBottom: '24px' }}>
            #SPECIALTY
          </h2>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px,2.5vw,28px)', fontStyle: 'italic', color: SAGE }}>
            Freshness &amp; Craft — The Third Wave Way
          </p>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          MENU — dynamic from API
      ══════════════════════════════════════ */}
      <section id="menu" style={{ padding: 'clamp(60px, 10vw, 120px) 0', background: BG }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-20">

          <div className="text-center mb-12" data-animate-c>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: SAGE, display: 'block', marginBottom: '20px' }}>
              {ru ? 'МЕНЮ' : 'MENÝU'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, color: TEXT, lineHeight: 1.05, marginBottom: '4px' }}>
              {ru ? 'Наш выбор' : 'Biziň saýlawymyz'}
            </h2>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, fontStyle: 'italic', color: SAGE, lineHeight: 1.05 }}>
              {ru ? 'свежее каждый день' : 'Her gün täze'}
            </h2>
          </div>

          {menuLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ height: '120px', background: SURFACE, animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : categories.length === 0 ? (
            /* Fallback: no categories in DB yet — show coming soon */
            <div className="text-center py-16" style={{ color: MUTED }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 300 }}>
                {ru ? 'Меню скоро появится' : 'Menýu ýakynda peýda bolar'}
              </p>
            </div>
          ) : (
            <>
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    style={{
                      fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500,
                      letterSpacing: '0.22em', textTransform: 'uppercase',
                      padding: '9px 20px',
                      background: activeTab === cat.id ? SAGE : 'transparent',
                      color: activeTab === cat.id ? '#fff' : MUTED,
                      border: `1px solid ${activeTab === cat.id ? SAGE : BORDER}`,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== cat.id) {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = SAGE
                        el.style.color = SAGE
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== cat.id) {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = BORDER
                        el.style.color = MUTED
                      }
                    }}
                  >
                    {ru ? cat.name_ru : cat.name_tk}
                  </button>
                ))}
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeItems.length === 0 ? (
                  <div className="col-span-full text-center py-12" style={{ color: MUTED }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 300 }}>
                      {ru ? 'Позиций пока нет' : 'Pozisiýa ýok'}
                    </p>
                  </div>
                ) : (
                  activeItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{
                        background: SURFACE,
                        border: `1px solid ${BORDER}`,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Image */}
                      {item.imageUrl && (
                        <div style={{ position: 'relative', height: '160px', flexShrink: 0 }}>
                          <Image
                            src={item.imageUrl}
                            alt={item.name_ru}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div style={{ padding: '18px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                          <h3 style={{
                            fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 400,
                            color: TEXT, lineHeight: 1.35, flex: 1,
                          }}>
                            {ru ? item.name_ru : item.name_tk}
                          </h3>
                          <span style={{
                            fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500,
                            color: SAGE, flexShrink: 0,
                          }}>
                            {fmt(item.price)}
                          </span>
                        </div>
                        {(ru ? item.description_ru : item.description_tk) && (
                          <p style={{
                            fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 300,
                            color: MUTED, lineHeight: 1.6,
                          }}>
                            {ru ? item.description_ru : item.description_tk}
                          </p>
                        )}
                        <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                          <button
                            onClick={() => {
                              addItem({
                                id: item.id,
                                name_ru: item.name_ru,
                                name_tk: item.name_tk,
                                price: item.price,
                              })
                              setCartOpen(true)
                            }}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              background: 'transparent',
                              border: `1px solid ${SAGE}`,
                              color: SAGE,
                              padding: '8px 18px',
                              fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500,
                              letterSpacing: '0.18em', textTransform: 'uppercase',
                              cursor: 'pointer', transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement
                              el.style.background = SAGE
                              el.style.color = '#fff'
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement
                              el.style.background = 'transparent'
                              el.style.color = SAGE
                            }}
                          >
                            <Plus size={12} />
                            {ru ? 'Добавить' : 'Goş'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          FEATURES — photo cards
      ══════════════════════════════════════ */}
      <section style={{ padding: 'clamp(60px, 10vw, 120px) 0', background: SURFACE }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-20">
          <div className="text-center mb-12" data-animate-c>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.45em', textTransform: 'uppercase', color: SAGE, display: 'block', marginBottom: '16px' }}>
              {ru ? 'ПОЧЕМУ МЫ' : 'NÄME ÜÇIN BIZ'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, color: TEXT }}>
              {ru ? 'В деталях — разница' : 'Jikme-jikliklerde tapawut'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                photo: '/images/coffee/photo_3_2026-06-29_19-37-02.jpg',
                titleRu: 'Авторский кофе', titleTk: 'Awtor kofe',
                descRu: 'Моносорта и купажи от ведущих обжарщиков — свежие каждую неделю.',
                descTk: 'Dünýäniň öňdebaryjy gowurujylaryndan monosortlar — her hepde täze.',
              },
              {
                photo: '/images/coffee/photo_4_2026-06-29_19-37-02.jpg',
                titleRu: 'На любой вкус', titleTk: 'Islendik tagam',
                descRu: 'Горячий эспрессо, холодные напитки, авторские коктейли — на ваш выбор.',
                descTk: 'Ýyly espresso, sowuk içgiler, awtor kokteýller — siziň saýlawyňyz üçin.',
              },
              {
                photo: '/images/coffee/photo_2_2026-06-29_19-37-02.jpg',
                titleRu: 'Уютная атмосфера', titleTk: 'Amatly atmosfera',
                descRu: 'Тёплое пространство для встреч, работы и неспешного кофе.',
                descTk: 'Duşuşyk, iş we kofe üçin ýyly giňişlik.',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden group"
                style={{ aspectRatio: '3/4', minHeight: '360px' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
              >
                <Image
                  src={card.photo}
                  alt={card.titleRu}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,12,8,0.82) 0%, rgba(8,12,8,0.2) 55%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 24px' }}>
                  <div style={{ width: 24, height: 1, background: SAGE, marginBottom: '12px' }} />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 300, color: '#fff', marginBottom: '8px', lineHeight: 1.2 }}>
                    {ru ? card.titleRu : card.titleTk}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>
                    {ru ? card.descRu : card.descTk}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          BOOKING / CONTACT CTA
      ══════════════════════════════════════ */}
      <section id="booking" style={{ padding: 'clamp(60px, 10vw, 120px) 0', background: BG }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          <div data-animate-c>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: SAGE, display: 'block', marginBottom: '20px' }}>
              {ru ? 'БРОНИРОВАНИЕ' : 'ZAKAZ'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, color: TEXT, lineHeight: 1.05, marginBottom: '4px' }}>
              {ru ? 'Зарезервируйте' : 'Stolyňyzy'}
            </h2>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, fontStyle: 'italic', color: SAGE, lineHeight: 1.05, marginBottom: '28px' }}>
              {ru ? 'ваш столик' : 'zakaz ediň'}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.9, color: MUTED, fontSize: '15px', maxWidth: '380px', marginBottom: '36px' }}>
              {ru
                ? 'Свяжитесь с нами по телефону или напишите в Telegram — мы подберём удобное время и лучший столик.'
                : 'Telefon ýa-da Telegram arkaly biziň bilen habarlaşyň — size amatly wagt we iň gowy stoljagy saýlarys.'}
            </p>
            <a href="tel:+99362000000" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              background: SAGE, color: '#fff',
              padding: '14px 32px',
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase',
              transition: 'background 0.25s', cursor: 'pointer', textDecoration: 'none',
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#5a6b57')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = SAGE)}
            >
              <Phone size={14} />
              {ru ? 'ПОЗВОНИТЬ' : 'JAŇ ET'}
            </a>
          </div>

          <div className="space-y-3" data-animate-c data-delay="0.1">
            {[
              { icon: MapPin, labelRu: 'АДРЕС',       labelTk: 'SALGY',    valRu: 'Ашхабад, Туркменистан',    valTk: 'Aşgabat, Türkmenistan' },
              { icon: Clock,  labelRu: 'ЧАСЫ РАБОТЫ', labelTk: 'IŞ WAGTY', valRu: 'Ежедневно 08:00 – 22:00', valTk: 'Her gün 08:00 – 22:00' },
              { icon: Phone,  labelRu: 'ТЕЛЕФОН',     labelTk: 'TELEFON',  valRu: '+993 62 XXXXXX',           valTk: '+993 62 XXXXXX' },
            ].map(({ icon: Icon, labelRu, labelTk, valRu, valTk }, i) => (
              <div key={i} className="flex items-center gap-5 px-6 py-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <div style={{ width: 40, height: 40, border: `1px solid rgba(107,125,104,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} style={{ color: SAGE }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: MUTED, marginBottom: '3px' }}>
                    {ru ? labelRu : labelTk}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 300, color: TEXT }}>
                    {ru ? valRu : valTk}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          FOOTER — light themed
      ══════════════════════════════════════ */}
      <footer style={{ background: SURFACE, borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-14 mb-12">

            {/* Brand */}
            <div>
              <div className="flex flex-col items-start leading-none mb-6">
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', color: SAGE, letterSpacing: '0.04em', lineHeight: 1 }}>HOŞ</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: SAGE_DIM, letterSpacing: '0.45em', textTransform: 'uppercase', marginTop: '4px' }}>COFFEE</span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 300, color: MUTED, lineHeight: 1.8, maxWidth: '220px' }}>
                {ru ? 'Место для тех, кто ценит настоящий кофе.' : 'Hakyky kofe bilen gyzyklanýanlar üçin ýer.'}
              </p>
            </div>

            {/* Links */}
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: MUTED, marginBottom: '16px' }}>
                {ru ? 'НАВИГАЦИЯ' : 'NAWİGASIÝA'}
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { href: '#about',   labelRu: 'О нас',         labelTk: 'Biz hakda' },
                  { href: '#menu',    labelRu: 'Меню',          labelTk: 'Menýu' },
                  { href: '#booking', labelRu: 'Бронирование',  labelTk: 'Zakaz' },
                  { href: '/',        labelRu: 'HOŞ Lounge ↗',  labelTk: 'HOŞ Lounge ↗' },
                ].map((l) => (
                  <a key={l.href} href={l.href} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 300, color: MUTED, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = SAGE)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = MUTED)}
                  >
                    {ru ? l.labelRu : l.labelTk}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: MUTED, marginBottom: '16px' }}>
                {ru ? 'КОНТАКТЫ' : 'HABARLAŞMAK'}
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Ашхабад, Туркменистан' },
                  { label: '+993 62 XXXXXX' },
                  { label: ru ? 'Ежедневно 08:00 – 22:00' : 'Her gün 08:00 – 22:00' },
                ].map((c, i) => (
                  <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 300, color: MUTED }}>{c.label}</p>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 300, color: MUTED, letterSpacing: '0.2em' }}>
              © {new Date().getFullYear()} HOŞ Coffee
            </p>
            <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED, textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = SAGE)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = MUTED)}
            >
              HOŞ Lounge ↗
            </Link>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CoffeeCartDrawer />
    </div>
  )
}
