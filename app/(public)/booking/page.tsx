'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Users, Star, CheckCircle, Clock, X } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'
import { toast } from 'sonner'

const zones = [
  { id: 'main', icon: Users, ru: 'Основной зал', tk: 'Esasy zal', descRu: 'Уютная атмосфера',   descTk: 'Amatly atmosfera' },
  { id: 'vip',  icon: Star,  ru: 'VIP Зона',     tk: 'VIP Zona',  descRu: 'Для особых случаев', descTk: 'Aýratyn wakalar üçin' },
]

const timeSlots = Array.from({ length: 27 }, (_, i) => {
  const m = 10 * 60 + i * 30
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
})

const inputStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.2)',
  color: 'var(--white)',
  fontFamily: 'var(--font-body)',
  fontSize: '15px',
  fontWeight: 300,
  padding: '10px 0',
  outline: 'none',
  transition: 'border-color 0.2s',
}
const labelStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.3em',
  textTransform: 'uppercase' as const,
  color: 'var(--gold)',
  display: 'block',
  marginBottom: '8px',
}

export default function BookingPage() {
  const { lang } = useLang()
  const tr = translations[lang]
  const ru = lang === 'ru'

  const [zone,       setZone]       = useState('main')
  const [date,       setDate]       = useState('')
  const [time,       setTime]       = useState('')
  const [guestCount, setGuestCount] = useState(2)
  const [name,       setName]       = useState('')
  const [phone,      setPhone]      = useState('')
  const [note,       setNote]       = useState('')
  const [loading,    setLoading]    = useState(false)
  const [bookingId,  setBookingId]  = useState<number | null>(null)
  const [status,     setStatus]     = useState('pending')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  const pollStatus = (id: number) => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/bookings/${id}/status`)
      if (res.ok) {
        const d = await res.json()
        setStatus(d.status)
        if (d.status !== 'pending') {
          clearInterval(pollRef.current!)
          pollRef.current = null
        }
      }
    }, 5000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) { toast.error(ru ? 'Введите номер телефона' : 'Telefon belgisin giriziň'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone, date, time, guestCount, name, phone, note, clientLang: lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBookingId(data.id)
      pollStatus(data.id)
      toast.success(ru ? 'Заявка отправлена!' : 'Arza iberildi!')
    } catch {
      toast.error(ru ? 'Ошибка. Попробуйте снова.' : 'Ýalňyşlyk. Gaýtadan synanşyň.')
    } finally { setLoading(false) }
  }

  /* Success state */
  if (bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)', padding: '40px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="text-center" style={{ maxWidth: '400px' }}>
          {status === 'confirmed' ? (
            <>
              <CheckCircle size={56} style={{ color: 'var(--gold)', margin: '0 auto 24px' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 300, color: 'var(--white)', marginBottom: '12px' }}>
                {tr.bookingConfirmed}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--muted)' }}>
                {ru ? 'Детали отправлены по SMS' : 'Maglumatlar SMS arkaly iberildi'}
              </p>
            </>
          ) : status === 'cancelled' ? (
            <>
              <X size={56} style={{ color: '#ef4444', margin: '0 auto 24px' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 300, color: 'var(--white)', marginBottom: '12px' }}>
                {tr.bookingCancelled}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--muted)' }}>
                {ru ? 'Это время недоступно' : 'Bu wagt elýeterli däl'}
              </p>
            </>
          ) : (
            <>
              <Clock size={56} style={{ color: 'var(--gold)', margin: '0 auto 24px' }} className="animate-pulse" />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 300, color: 'var(--white)', marginBottom: '12px' }}>
                {ru ? 'Заявка отправлена' : 'Arza iberildi'}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--muted)' }}>
                {tr.bookingSubmitted}
              </p>
            </>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* LEFT — Form */}
        <div className="flex flex-col justify-center px-5 sm:px-8 md:px-16 py-14 md:py-24 lg:py-32">
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '16px' }}>
            {ru ? 'ОНЛАЙН БРОНИРОВАНИЕ' : 'ONLAÝN ZAKAZ'}
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.1, marginBottom: '48px' }}>
            {tr.bookingTitle}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Zone */}
            <div>
              <label style={labelStyle}>{ru ? 'ВЫБЕРИТЕ ЗОНУ' : 'ZONA SAÝLAŇ'}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                {zones.map(z => {
                  const Icon = z.icon
                  const sel = zone === z.id
                  return (
                    <button key={z.id} type="button" onClick={() => setZone(z.id)}
                      className="p-4 text-center transition-all duration-200"
                      style={{
                        border: sel ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                        background: sel ? 'rgba(201,168,76,0.06)' : 'transparent',
                      }}
                    >
                      <Icon size={18} style={{ color: sel ? 'var(--gold)' : 'var(--muted)', margin: '0 auto 8px' }} />
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, color: sel ? 'var(--gold)' : 'var(--muted)', letterSpacing: '0.05em' }}>
                        {ru ? z.ru : z.tk}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: sel ? 'var(--gold-dim)' : '#444', marginTop: '4px' }} className="hidden sm:block">
                        {ru ? z.descRu : z.descTk}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label style={labelStyle}>{tr.selectDate}</label>
                <input
                  type="date" value={date} required
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setDate(e.target.value)}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                  onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)')}
                />
              </div>
              <div>
                <label style={labelStyle}>{tr.selectTime}</label>
                <select value={time} required onChange={e => setTime(e.target.value)}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                  onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)')}
                >
                  <option value="" style={{ background: '#111' }}>{tr.selectTime}</option>
                  {timeSlots.map(s => <option key={s} value={s} style={{ background: '#111' }}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Guests */}
            <div>
              <label style={labelStyle}>{tr.guestCount}</label>
              <div className="flex items-center gap-6 mt-2">
                <button type="button" onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  style={{ width: 40, height: 40, border: '1px solid rgba(255,255,255,0.15)', color: 'var(--muted)', background: 'transparent', fontSize: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
                >−</button>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 300, color: 'var(--white)', minWidth: '32px', textAlign: 'center' }}>
                  {guestCount}
                </span>
                <button type="button" onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                  style={{ width: 40, height: 40, border: '1px solid rgba(255,255,255,0.15)', color: 'var(--muted)', background: 'transparent', fontSize: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
                >+</button>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)' }}>
                  {ru ? 'гостей' : 'myhmanlary'}
                </span>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label style={labelStyle}>{tr.yourName}</label>
                <input type="text" value={name} required onChange={e => setName(e.target.value)}
                  placeholder={tr.namePlaceholder}
                  style={{ ...inputStyle }}
                  onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                  onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)')}
                />
              </div>
              <div>
                <label style={labelStyle}>{tr.yourPhone}</label>
                <input type="tel" value={phone} required onChange={e => setPhone(e.target.value)}
                  placeholder={tr.phonePlaceholder}
                  style={{ ...inputStyle, fontSize: '16px' }}
                  onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                  onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)')}
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label style={labelStyle}>{tr.note}</label>
              <textarea value={note} rows={2} onChange={e => setNote(e.target.value)}
                placeholder={tr.notePlaceholder}
                style={{ ...inputStyle, resize: 'none' }}
                onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)')}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full justify-center disabled:opacity-50">
              {loading ? (ru ? 'Отправка...' : 'Iberilýär...') : tr.submitBooking}
            </button>
          </form>
        </div>

        {/* RIGHT — Photo */}
        <div className="relative hidden lg:block" style={{ minHeight: '600px' }}>
          <Image src="/images/hero.jpg" alt="HOŞ Lounge" fill className="object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.35)' }} />
        </div>
      </div>
    </div>
  )
}
