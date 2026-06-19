'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Users, Star, Leaf, CheckCircle, Clock, X } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'

const zones = [
  { id: 'main', ru: 'Основной зал', tk: 'Esasy zal', icon: Users, descKey: 'zoneMainDesc' as const },
  { id: 'vip', ru: 'VIP Зона', tk: 'VIP Zona', icon: Star, descKey: 'zoneVipDesc' as const },
  { id: 'terrace', ru: 'Терраса', tk: 'Taras', icon: Leaf, descKey: 'zoneTerraceDesc' as const },
]

const timeSlots = Array.from({ length: 27 }, (_, i) => {
  const m = 10 * 60 + i * 30
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
})

export default function BookingPage() {
  const { lang } = useLang()
  const tr = translations[lang]
  const [zone, setZone] = useState('main')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guestCount, setGuestCount] = useState(2)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState<number | null>(null)
  const [status, setStatus] = useState('pending')
  const [error, setError] = useState('')

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
    if (!date || !time) { setError(lang === 'ru' ? 'Выберите дату и время' : 'Senäni we wagty saýlaň'); return }
    if (!phone.trim()) { setError(lang === 'ru' ? 'Введите номер телефона' : 'Telefon belgisin giriziň'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone, date, time, guestCount, name, phone, note, clientLang: lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBookingId(data.id); pollStatus(data.id)
    } catch { setError(lang === 'ru' ? 'Ошибка при отправке' : 'Ibermekde ýalňyşlyk') }
    finally { setLoading(false) }
  }

  if (bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-carbon-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="max-w-md w-full bg-carbon-900 border border-carbon-800 p-10 text-center"
        >
          {status === 'confirmed' ? (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, delay: 0.2 }}>
                <CheckCircle className="w-16 h-16 text-gold-500 mx-auto mb-5" />
              </motion.div>
              <h2 className="font-playfair text-2xl text-concrete-100 mb-2">{tr.bookingConfirmed}</h2>
              <p className="text-concrete-500 text-sm">{lang === 'ru' ? 'Детали отправлены по SMS' : 'Maglumatlar SMS arkaly iberildi'}</p>
            </>
          ) : status === 'cancelled' ? (
            <>
              <div className="w-16 h-16 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="font-playfair text-2xl text-concrete-100 mb-2">{tr.bookingCancelled}</h2>
            </>
          ) : (
            <>
              <Clock className="w-16 h-16 text-gold-500 mx-auto mb-5 animate-pulse" />
              <h2 className="font-playfair text-2xl text-concrete-100 mb-3">{lang === 'ru' ? 'Заявка отправлена' : 'Arzaňyz iberildi'}</h2>
              <p className="text-concrete-500 text-sm mb-6">{tr.bookingSubmitted}</p>
              <div className="flex items-center justify-center gap-2 text-xs text-concrete-600">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                {lang === 'ru' ? 'Ожидаем ответа...' : 'Jogaba garaşylýar...'}
              </div>
            </>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <div className="relative h-64 md:h-72 overflow-hidden">
        <Image src="/images/photo_2026-06-19_18-49-24.jpg" alt="Booking" fill className="object-cover" />
        <div className="absolute inset-0 bg-carbon-950/75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="section-label mb-3">{lang === 'ru' ? 'Онлайн-бронирование' : 'Onlaýn zakaz'}</p>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-concrete-100">{tr.bookingTitle}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Zone */}
          <div>
            <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-concrete-400 mb-4">
              {lang === 'ru' ? 'Выберите зону' : 'Zona saýlaň'}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {zones.map(z => {
                const Icon = z.icon
                return (
                  <button key={z.id} type="button" onClick={() => setZone(z.id)}
                    className={`p-4 text-center border transition-all ${
                      zone === z.id
                        ? 'border-gold-500 bg-gold-500/10'
                        : 'border-carbon-700 hover:border-carbon-500 bg-carbon-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-2 ${zone === z.id ? 'text-gold-400' : 'text-concrete-500'}`} />
                    <p className={`text-xs font-semibold tracking-wide ${zone === z.id ? 'text-gold-400' : 'text-concrete-400'}`}>
                      {lang === 'ru' ? z.ru : z.tk}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-concrete-400 mb-2">{tr.selectDate}</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input" required />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-concrete-400 mb-2">{tr.selectTime}</label>
              <select value={time} onChange={e => setTime(e.target.value)} className="input" required>
                <option value="">{tr.selectTime}</option>
                {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-concrete-400 mb-3">{tr.guestCount}</label>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="w-10 h-10 border border-carbon-700 hover:border-gold-500 text-concrete-300 hover:text-gold-400 transition-colors text-lg">−</button>
              <span className="w-8 text-center font-playfair text-2xl text-concrete-100">{guestCount}</span>
              <button type="button" onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                className="w-10 h-10 border border-carbon-700 hover:border-gold-500 text-concrete-300 hover:text-gold-400 transition-colors text-lg">+</button>
            </div>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-concrete-400 mb-2">{tr.yourName}</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={tr.namePlaceholder} className="input" required />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-concrete-400 mb-2">{tr.yourPhone}</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder={tr.phonePlaceholder} className="input" required />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-concrete-400 mb-2">{tr.note}</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder={tr.notePlaceholder} rows={3} className="input resize-none" />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-gold w-full justify-center disabled:opacity-50">
            {loading ? tr.loading : tr.submitBooking}
          </button>
        </motion.form>
      </div>
    </>
  )
}
