'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Users, Star, Leaf, CheckCircle, Clock, X } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'

const zones = [
  { id: 'main',    icon: Users, ruName: 'Основной зал', tkName: 'Esasy zal',  ruDesc: 'Уютная атмосфера основного зала',               tkDesc: 'Esasy zalyň amatly atmosferasy' },
  { id: 'vip',     icon: Star,  ruName: 'VIP Зона',     tkName: 'VIP Zona',   ruDesc: 'Эксклюзивное пространство для особых случаев',  tkDesc: 'Aýratyn wakalar üçin eksklýuziw giňişlik' },
  { id: 'terrace', icon: Leaf,  ruName: 'Терраса',      tkName: 'Taras',      ruDesc: 'Открытая терраса с видом на улицу',             tkDesc: 'Köçä syn açyk taras' },
]

const timeSlots = Array.from({ length: 27 }, (_, i) => {
  const m = 10 * 60 + i * 30
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
})

/* shared dark-input style applied to both <input> and <select> */
const inputCls =
  'w-full px-4 py-3.5 bg-[#0d0c09] border border-[#2a2720] text-[#f0ece3] ' +
  'focus:outline-none focus:border-gold-500 transition-colors text-base ' +
  'placeholder:text-[#5c5852] font-body font-light'

export default function BookingPage() {
  const { lang } = useLang()
  const tr = translations[lang]
  const ru = lang === 'ru'

  const [zone, setZone]           = useState('main')
  const [date, setDate]           = useState('')
  const [time, setTime]           = useState('')
  const [guestCount, setGuestCount] = useState(2)
  const [name, setName]           = useState('')
  const [phone, setPhone]         = useState('')
  const [note, setNote]           = useState('')
  const [loading, setLoading]     = useState(false)
  const [bookingId, setBookingId] = useState<number | null>(null)
  const [status, setStatus]       = useState('pending')
  const [error, setError]         = useState('')

  const pollStatus = (id: number) => {
    const iv = setInterval(async () => {
      const res = await fetch(`/api/bookings/${id}/status`)
      if (res.ok) {
        const d = await res.json()
        setStatus(d.status)
        if (d.status !== 'pending') clearInterval(iv)
      }
    }, 5000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !time) {
      setError(ru ? 'Выберите дату и время' : 'Senäni we wagty saýlaň')
      return
    }
    if (!phone.trim()) {
      setError(ru ? 'Введите номер телефона' : 'Telefon belgisin giriziň')
      return
    }
    setError('')
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
    } catch {
      setError(ru ? 'Ошибка при отправке' : 'Ibermekde ýalňyşlyk')
    } finally {
      setLoading(false)
    }
  }

  /* ── Success / waiting state ── */
  if (bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#080705]">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 18 }}
          className="max-w-md w-full border border-[#1e1b16] bg-[#0d0c09] p-12 text-center"
        >
          {status === 'confirmed' ? (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, delay: 0.15 }}>
                <CheckCircle className="w-14 h-14 text-gold-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="font-display text-3xl font-light text-[#f0ece3] mb-3">{tr.bookingConfirmed}</h2>
              <p className="text-[#5c5852] text-sm font-body">
                {ru ? 'Детали отправлены по SMS' : 'Maglumatlar SMS arkaly iberildi'}
              </p>
            </>
          ) : status === 'cancelled' ? (
            <>
              <div className="w-14 h-14 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
                <X className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="font-display text-3xl font-light text-[#f0ece3] mb-3">{tr.bookingCancelled}</h2>
              <p className="text-[#5c5852] text-sm font-body">
                {ru ? 'К сожалению, это время недоступно' : 'Gynansak-da, bu wagt elýeterli däl'}
              </p>
            </>
          ) : (
            <>
              <Clock className="w-14 h-14 text-gold-500 mx-auto mb-6 animate-pulse" />
              <h2 className="font-display text-3xl font-light text-[#f0ece3] mb-3">
                {ru ? 'Заявка отправлена' : 'Arzaňyz iberildi'}
              </h2>
              <p className="text-[#5c5852] text-sm font-body mb-6">{tr.bookingSubmitted}</p>
              <div className="flex items-center justify-center gap-2 text-xs text-[#3e3830] font-body">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                {ru ? 'Ожидаем ответа администратора...' : 'Administrator jogabyna garaşylýar...'}
              </div>
            </>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative h-60 md:h-72 overflow-hidden">
        <Image
          src="/images/photo_2026-06-19_18-49-24.jpg"
          alt={ru ? 'Бронирование столика' : 'Stol zakaz etmek'}
          fill className="object-cover"
        />
        <div className="absolute inset-0 bg-[#080705]/75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="section-label mb-3">
            {ru ? 'Онлайн-бронирование' : 'Onlaýn zakaz'}
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-[#f0ece3]">
            {tr.bookingTitle}
          </h1>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-9"
        >

          {/* Zone selector */}
          <div>
            <label className="section-label mb-4 block">
              {ru ? 'Выберите зону' : 'Zona saýlaň'}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {zones.map(z => {
                const Icon = z.icon
                const selected = zone === z.id
                return (
                  <button
                    key={z.id} type="button" onClick={() => setZone(z.id)}
                    className={`p-4 text-center border transition-all duration-200 ${
                      selected
                        ? 'border-gold-500 bg-gold-500/10'
                        /* Bug 4 fix: always visible border, not just on hover */
                        : 'border-[#B8860B]/30 hover:border-[#B8860B]/70 bg-[#0d0c09]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-2.5 ${selected ? 'text-gold-400' : 'text-[#7a7570]'}`} />
                    <p className={`text-xs font-body font-medium tracking-wide ${selected ? 'text-gold-400' : 'text-[#9e9890]'}`}>
                      {ru ? z.ruName : z.tkName}
                    </p>
                    <p className={`text-[10px] font-body mt-1 hidden sm:block ${selected ? 'text-gold-500/70' : 'text-[#5c5852]'}`}>
                      {ru ? z.ruDesc : z.tkDesc}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date & Time
              Bug 3 fix: color-scheme:dark forces browser chrome to use dark styles;
              explicit color + background override remaining white flash */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="section-label mb-2 block">{tr.selectDate}</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className={inputCls}
                style={{ colorScheme: 'dark', fontSize: '16px' }}
              />
            </div>
            <div>
              <label className="section-label mb-2 block">{tr.selectTime}</label>
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                required
                className={inputCls}
                style={{ colorScheme: 'dark', fontSize: '16px' }}
              >
                <option value="" style={{ background: '#0d0c09' }}>{tr.selectTime}</option>
                {timeSlots.map(s => (
                  <option key={s} value={s} style={{ background: '#0d0c09' }}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Guest count */}
          <div>
            <label className="section-label mb-3 block">{tr.guestCount}</label>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="w-11 h-11 border border-[#2a2720] hover:border-gold-500 text-[#9e9890] hover:text-gold-400 transition-colors text-xl font-light"
              >
                −
              </button>
              <span
                className="w-10 text-center text-2xl font-light text-[#f0ece3]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {guestCount}
              </span>
              <button
                type="button"
                onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                className="w-11 h-11 border border-[#2a2720] hover:border-gold-500 text-[#9e9890] hover:text-gold-400 transition-colors text-xl font-light"
              >
                +
              </button>
              <span className="text-[#5c5852] text-sm font-body ml-2">
                {ru ? 'гостей' : 'myhmanlary'}
              </span>
            </div>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="section-label mb-2 block">{tr.yourName}</label>
              <input
                type="text" value={name}
                onChange={e => setName(e.target.value)}
                placeholder={tr.namePlaceholder}
                className={inputCls}
                style={{ colorScheme: 'dark', fontSize: '16px' }}
                required
              />
            </div>
            <div>
              <label className="section-label mb-2 block">{tr.yourPhone}</label>
              <input
                type="tel" value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={tr.phonePlaceholder}
                className={inputCls}
                style={{ colorScheme: 'dark', fontSize: '16px' }}
                required
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="section-label mb-2 block">{tr.note}</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={tr.notePlaceholder}
              rows={3}
              className={inputCls + ' resize-none'}
              style={{ colorScheme: 'dark', fontSize: '16px' }}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm font-body">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full justify-center disabled:opacity-50"
          >
            {loading
              ? (ru ? 'Отправка...' : 'Iberilýär...')
              : tr.submitBooking}
          </button>
        </motion.form>
      </div>
    </>
  )
}
