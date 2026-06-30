'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/components/providers/LangProvider'
import { useCart } from '@/components/providers/CartProvider'
import { ArrowRight, MapPin, Clock, Phone, Plus, Users, Star, Leaf, CheckCircle, X, Search } from 'lucide-react'
import { toast } from 'sonner'

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
  const [menuSearch, setMenuSearch] = useState('')

  interface Promo { id: number; title_ru: string; title_tk: string; description_ru: string; description_tk: string; badge_ru: string | null; badge_tk: string | null; price: number | null }
  const [promos, setPromos] = useState<Promo[]>([])

  // Booking form state
  const [bZone,       setBZone]       = useState('main')
  const [bDate,       setBDate]       = useState('')
  const [bTime,       setBTime]       = useState('')
  const [bGuests,     setBGuests]     = useState(2)
  const [bName,       setBName]       = useState('')
  const [bPhone,      setBPhone]      = useState('')
  const [bNote,       setBNote]       = useState('')
  const [bLoading,    setBLoading]    = useState(false)
  const [bId,         setBId]         = useState<number | null>(null)
  const [bStatus,     setBStatus]     = useState('pending')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY    = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // Fetch dynamic menu + promos
  useEffect(() => {
    fetch('/api/coffee/categories')
      .then((r) => r.json())
      .then((data: Category[]) => {
        setCategories(data)
        if (data.length > 0) setActiveTab(data[0].id)
        setMenuLoading(false)
      })
      .catch(() => setMenuLoading(false))
    fetch('/api/promotions')
      .then((r) => r.json())
      .then(setPromos)
      .catch(() => {})
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

  // Cleanup poll on unmount
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])

  const pollBooking = (id: number) => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/bookings/${id}/status`)
      if (res.ok) {
        const d = await res.json()
        setBStatus(d.status)
        if (d.status !== 'pending') { clearInterval(pollRef.current!); pollRef.current = null }
      }
    }, 5000)
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bPhone.trim()) { toast.error(ru ? 'Введите номер телефона' : 'Telefon belgisin giriziň'); return }
    setBLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone: bZone, date: bDate, time: bTime, guestCount: bGuests, name: bName, phone: bPhone, note: bNote, clientLang: lang, venue: 'coffee' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBId(data.id)
      pollBooking(data.id)
      toast.success(ru ? 'Заявка отправлена!' : 'Arza iberildi!')
    } catch {
      toast.error(ru ? 'Ошибка. Попробуйте снова.' : 'Ýalňyşlyk. Gaýtadan synanşyň.')
    } finally { setBLoading(false) }
  }

  const activeItems = categories.find((c) => c.id === activeTab)?.items ?? []
  const fmt = (p: number) => new Intl.NumberFormat('ru-RU').format(p) + ' TMT'

  const q = menuSearch.trim().toLowerCase()
  const searchItems = q
    ? categories.flatMap((c) =>
        c.items.filter((item) =>
          item.name_ru.toLowerCase().includes(q) ||
          item.name_tk.toLowerCase().includes(q) ||
          (item.description_ru ?? '').toLowerCase().includes(q) ||
          (item.description_tk ?? '').toLowerCase().includes(q)
        )
      )
    : []

  const coffeeZones = [
    { id: 'main',    icon: Users, ru: 'Основной зал', tk: 'Esasy zal'  },
    { id: 'window',  icon: Star,  ru: 'У окна',       tk: 'Penjiräniň ýanynda' },
    { id: 'terrace', icon: Leaf,  ru: 'Терраса',      tk: 'Taras'      },
  ]
  const timeSlots = Array.from({ length: 27 }, (_, i) => {
    const m = 8 * 60 + i * 30
    return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
  })

  const inputLight = {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: `1px solid ${BORDER}`, color: TEXT,
    fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 300,
    padding: '10px 0', outline: 'none', transition: 'border-color 0.2s',
  } as React.CSSProperties

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
      <section id="about" style={{ padding: 'clamp(60px, 10vw, 120px) 0', background: BG, scrollMarginTop: '64px' }}>
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
          PROMOTIONS — only if active promos exist
      ══════════════════════════════════════ */}
      {promos.length > 0 && (
        <>
          <section style={{ padding: 'clamp(60px, 8vw, 100px) 0', background: SURFACE }}>
            <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-20">
              <div className="text-center mb-10" data-animate-c>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: SAGE, display: 'block', marginBottom: '16px' }}>
                  {ru ? 'СПЕЦИАЛЬНЫЕ ПРЕДЛОЖЕНИЯ' : 'AÝRATYN TEKLIPLER'}
                </span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, color: TEXT }}>
                  {ru ? 'Только сейчас' : 'Diňe häzir'}
                </h2>
              </div>
              <div className={`grid gap-5 ${promos.length === 1 ? '' : promos.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
                {promos.map((p, i) => (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    style={{ background: BG, border: `1px solid ${BORDER}`, padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}
                  >
                    {(ru ? p.badge_ru : p.badge_tk) && (
                      <span style={{ display: 'inline-block', alignSelf: 'flex-start', fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '4px 10px', background: SAGE, color: '#fff' }}>
                        {ru ? p.badge_ru : p.badge_tk}
                      </span>
                    )}
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 300, color: TEXT, lineHeight: 1.2, margin: 0 }}>
                      {ru ? p.title_ru : p.title_tk}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 300, color: MUTED, lineHeight: 1.7, margin: 0 }}>
                      {ru ? p.description_ru : p.description_tk}
                    </p>
                    {p.price && (
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 500, color: SAGE, marginTop: '4px' }}>
                        {fmt(p.price)}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          <Divider />
        </>
      )}

      {/* ══════════════════════════════════════
          MENU — dynamic from API
      ══════════════════════════════════════ */}
      <section id="menu" style={{ padding: 'clamp(60px, 10vw, 120px) 0', background: BG, scrollMarginTop: '64px' }}>
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

          {/* Search box */}
          {!menuLoading && categories.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '400px', margin: '0 auto 32px', border: `1px solid ${BORDER}`, background: SURFACE, padding: '10px 16px' }}>
              <Search size={14} style={{ color: MUTED, flexShrink: 0 }} />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder={ru ? 'Поиск по меню...' : 'Menýudan gözleg...'}
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '14px', color: TEXT }}
              />
              {menuSearch && (
                <button onClick={() => setMenuSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: MUTED, padding: 0, display: 'flex' }}>
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {menuLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ height: '120px', background: SURFACE, animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16" style={{ color: MUTED }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 300 }}>
                {ru ? 'Меню скоро появится' : 'Menýu ýakynda peýda bolar'}
              </p>
            </div>
          ) : q ? (
            /* Search results — across all categories */
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: MUTED, marginBottom: '20px', textAlign: 'center' }}>
                {ru ? `Результаты: ${searchItems.length}` : `Netije: ${searchItems.length}`}
              </p>
              {searchItems.length === 0 ? (
                <div className="text-center py-12" style={{ color: MUTED }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 300 }}>
                    {ru ? 'Ничего не найдено' : 'Hiç zat tapylmady'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {searchItems.map((item) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                      style={{ background: SURFACE, border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                      {item.imageUrl && (
                        <div style={{ position: 'relative', height: '160px', flexShrink: 0 }}>
                          <Image src={item.imageUrl} alt={item.name_ru} fill className="object-cover" />
                        </div>
                      )}
                      <div style={{ padding: '18px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                          <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 400, color: TEXT, lineHeight: 1.35, flex: 1 }}>
                            {ru ? item.name_ru : item.name_tk}
                          </h3>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: SAGE, flexShrink: 0 }}>{fmt(item.price)}</span>
                        </div>
                        <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                          <button onClick={() => { addItem({ id: item.id, name_ru: item.name_ru, name_tk: item.name_tk, price: item.price }); setCartOpen(true) }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'transparent', border: `1px solid ${SAGE}`, color: SAGE, padding: '8px 18px', fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = SAGE; el.style.color = '#fff' }}
                            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = SAGE }}
                          >
                            <Plus size={12} />{ru ? 'Добавить' : 'Goş'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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
          BOOKING — inline form
      ══════════════════════════════════════ */}
      <section id="booking" style={{ padding: 'clamp(60px, 10vw, 120px) 0', background: BG, scrollMarginTop: '64px' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-20">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left — header + contact */}
            <div data-animate-c>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.42em', textTransform: 'uppercase', color: SAGE, display: 'block', marginBottom: '20px' }}>
                {ru ? 'ОНЛАЙН БРОНИРОВАНИЕ' : 'ONLAÝN ZAKAZ'}
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, color: TEXT, lineHeight: 1.05, marginBottom: '4px' }}>
                {ru ? 'Зарезервируйте' : 'Stolyňyzy'}
              </h2>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, fontStyle: 'italic', color: SAGE, lineHeight: 1.05, marginBottom: '32px' }}>
                {ru ? 'ваш столик' : 'zakaz ediň'}
              </h2>

              <div className="space-y-3">
                {[
                  { icon: MapPin, labelRu: 'АДРЕС',       labelTk: 'SALGY',    valRu: 'Ашхабад, Туркменистан',    valTk: 'Aşgabat, Türkmenistan' },
                  { icon: Clock,  labelRu: 'ЧАСЫ РАБОТЫ', labelTk: 'IŞ WAGTY', valRu: 'Ежедневно 08:00 – 22:00', valTk: 'Her gün 08:00 – 22:00' },
                  { icon: Phone,  labelRu: 'ТЕЛЕФОН',     labelTk: 'TELEFON',  valRu: '+993 62 XXXXXX',           valTk: '+993 62 XXXXXX' },
                ].map(({ icon: Icon, labelRu, labelTk, valRu, valTk }, i) => (
                  <div key={i} className="flex items-center gap-5 px-5 py-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                    <div style={{ width: 36, height: 36, border: `1px solid rgba(107,125,104,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} style={{ color: SAGE }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: MUTED, marginBottom: '2px' }}>
                        {ru ? labelRu : labelTk}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 300, color: TEXT }}>
                        {ru ? valRu : valTk}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — booking form */}
            <div data-animate-c data-delay="0.1">
              {bId ? (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center text-center py-16 px-8"
                  style={{ background: SURFACE, border: `1px solid ${BORDER}`, minHeight: '380px' }}
                >
                  {bStatus === 'confirmed' ? (
                    <>
                      <CheckCircle size={48} style={{ color: SAGE, marginBottom: '20px' }} />
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 300, color: TEXT, marginBottom: '10px' }}>
                        {ru ? 'Бронирование подтверждено!' : 'Zakaz tassyklandy!'}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 300, color: MUTED }}>
                        {ru ? 'Детали отправлены по SMS' : 'Maglumatlar SMS arkaly iberildi'}
                      </p>
                    </>
                  ) : bStatus === 'cancelled' ? (
                    <>
                      <X size={48} style={{ color: '#ef4444', marginBottom: '20px' }} />
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 300, color: TEXT, marginBottom: '10px' }}>
                        {ru ? 'Заявка отклонена' : 'Arza ret edildi'}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 300, color: MUTED }}>
                        {ru ? 'Выберите другое время' : 'Başga wagt saýlaň'}
                      </p>
                      <button onClick={() => { setBId(null); setBStatus('pending') }}
                        style={{ marginTop: '24px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: SAGE, background: 'transparent', border: `1px solid ${SAGE}`, padding: '10px 24px', cursor: 'pointer' }}>
                        {ru ? 'ПОПРОБОВАТЬ СНОВА' : 'GAÝTADAN SYNANYŞ'}
                      </button>
                    </>
                  ) : (
                    <>
                      <Clock size={48} style={{ color: SAGE, marginBottom: '20px' }} className="animate-pulse" />
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 300, color: TEXT, marginBottom: '10px' }}>
                        {ru ? 'Заявка отправлена' : 'Arza iberildi'}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 300, color: MUTED }}>
                        {ru ? 'Ожидайте подтверждения...' : 'Tassyklamagy garaşyň...'}
                      </p>
                    </>
                  )}
                </motion.div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-8">

                  {/* Zone */}
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: MUTED, marginBottom: '10px' }}>
                      {ru ? 'ЗОНА' : 'ZONA'}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {coffeeZones.map(z => {
                        const Icon = z.icon
                        const sel = bZone === z.id
                        return (
                          <button key={z.id} type="button" onClick={() => setBZone(z.id)}
                            style={{
                              padding: '12px 8px', textAlign: 'center',
                              border: sel ? `1px solid ${SAGE}` : `1px solid ${BORDER}`,
                              background: sel ? `rgba(107,125,104,0.07)` : 'transparent',
                              cursor: 'pointer', transition: 'all 0.2s',
                            }}>
                            <Icon size={16} style={{ color: sel ? SAGE : MUTED, margin: '0 auto 6px' }} />
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, color: sel ? SAGE : MUTED }}>
                              {ru ? z.ru : z.tk}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '8px' }}>
                        {ru ? 'ДАТА' : 'SENESI'}
                      </label>
                      <input type="date" value={bDate} required min={new Date().toISOString().split('T')[0]}
                        onChange={e => setBDate(e.target.value)}
                        style={{ ...inputLight, colorScheme: 'light' }}
                        onFocus={e => (e.target.style.borderBottomColor = SAGE)}
                        onBlur={e => (e.target.style.borderBottomColor = BORDER)}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '8px' }}>
                        {ru ? 'ВРЕМЯ' : 'WAGTY'}
                      </label>
                      <select value={bTime} required onChange={e => setBTime(e.target.value)}
                        style={{ ...inputLight, colorScheme: 'light' }}
                        onFocus={e => (e.target.style.borderBottomColor = SAGE)}
                        onBlur={e => (e.target.style.borderBottomColor = BORDER)}
                      >
                        <option value="">{ru ? 'Выберите' : 'Saýlaň'}</option>
                        {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '10px' }}>
                      {ru ? 'КОЛИЧЕСТВО ГОСТЕЙ' : 'MYHMANLARYŇ SANY'}
                    </label>
                    <div className="flex items-center gap-5">
                      <button type="button" onClick={() => setBGuests(Math.max(1, bGuests - 1))}
                        style={{ width: 36, height: 36, border: `1px solid ${BORDER}`, color: MUTED, background: 'transparent', fontSize: '18px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = SAGE; (e.currentTarget as HTMLElement).style.color = SAGE }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.color = MUTED }}
                      >−</button>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 300, color: TEXT, minWidth: '28px', textAlign: 'center' }}>{bGuests}</span>
                      <button type="button" onClick={() => setBGuests(Math.min(20, bGuests + 1))}
                        style={{ width: 36, height: 36, border: `1px solid ${BORDER}`, color: MUTED, background: 'transparent', fontSize: '18px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = SAGE; (e.currentTarget as HTMLElement).style.color = SAGE }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.color = MUTED }}
                      >+</button>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 300, color: MUTED }}>{ru ? 'гостей' : 'myhmanlary'}</span>
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '8px' }}>
                        {ru ? 'ИМЯ' : 'ADY'}
                      </label>
                      <input type="text" value={bName} onChange={e => setBName(e.target.value)}
                        placeholder={ru ? 'Ваше имя' : 'Adyňyz'}
                        style={inputLight}
                        onFocus={e => (e.target.style.borderBottomColor = SAGE)}
                        onBlur={e => (e.target.style.borderBottomColor = BORDER)}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '8px' }}>
                        {ru ? 'ТЕЛЕФОН' : 'TELEFON'} *
                      </label>
                      <input type="tel" value={bPhone} required onChange={e => setBPhone(e.target.value)}
                        placeholder="+993 __ ______"
                        style={{ ...inputLight, fontSize: '16px' }}
                        onFocus={e => (e.target.style.borderBottomColor = SAGE)}
                        onBlur={e => (e.target.style.borderBottomColor = BORDER)}
                      />
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <label style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: MUTED, display: 'block', marginBottom: '8px' }}>
                      {ru ? 'ПОЖЕЛАНИЯ' : 'ISLEG'}
                    </label>
                    <textarea value={bNote} rows={2} onChange={e => setBNote(e.target.value)}
                      placeholder={ru ? 'Особые пожелания...' : 'Aýratyn islegler...'}
                      style={{ ...inputLight, resize: 'none' }}
                      onFocus={e => (e.target.style.borderBottomColor = SAGE)}
                      onBlur={e => (e.target.style.borderBottomColor = BORDER)}
                    />
                  </div>

                  <button type="submit" disabled={bLoading}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      background: SAGE, color: '#fff',
                      padding: '15px 32px',
                      fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase',
                      border: 'none', cursor: bLoading ? 'not-allowed' : 'pointer', transition: 'background 0.25s',
                      opacity: bLoading ? 0.65 : 1,
                    }}
                    onMouseEnter={e => { if (!bLoading) (e.currentTarget as HTMLElement).style.background = '#5a6b57' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = SAGE }}
                  >
                    {bLoading ? (ru ? 'Отправка...' : 'Iberilýär...') : (ru ? 'ЗАБРОНИРОВАТЬ СТОЛИК' : 'STOL ZAKAZ ET')}
                  </button>
                </form>
              )}
            </div>
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

    </div>
  )
}
