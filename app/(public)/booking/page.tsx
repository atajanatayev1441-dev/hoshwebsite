'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Star, Leaf, CheckCircle, Clock } from 'lucide-react'
import { useLang } from '@/components/providers/LangProvider'
import { translations } from '@/lib/i18n'

const zones = [
  { id: 'main', iconRu: 'Основной зал', iconTk: 'Esasy zal', icon: Users, descKey: 'zoneMainDesc' as const },
  { id: 'vip', iconRu: 'VIP Зона', iconTk: 'VIP Zona', icon: Star, descKey: 'zoneVipDesc' as const },
  { id: 'terrace', iconRu: 'Терраса', iconTk: 'Taras', icon: Leaf, descKey: 'zoneTerraceDesc' as const },
]

const timeSlots = Array.from({ length: 27 }, (_, i) => {
  const totalMins = 10 * 60 + i * 30
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
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
  const [status, setStatus] = useState<string>('pending')
  const [error, setError] = useState('')

  // Poll status after submission
  const pollStatus = (id: number) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/bookings/${id}/status`)
      if (res.ok) {
        const data = await res.json()
        setStatus(data.status)
        if (data.status !== 'pending') clearInterval(interval)
      }
    }, 5000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !time) {
      setError(lang === 'ru' ? 'Выберите дату и время' : 'Senäni we wagty saýlaň')
      return
    }
    if (!phone.trim()) {
      setError(lang === 'ru' ? 'Введите номер телефона' : 'Telefon belgisin giriziň')
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
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setBookingId(data.id)
      pollStatus(data.id)
    } catch {
      setError(lang === 'ru' ? 'Ошибка при отправке' : 'Ibermekde ýalňyşlyk')
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="card p-10 text-center max-w-md w-full"
        >
          {status === 'confirmed' ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10, delay: 0.2 }}
              >
                <CheckCircle className="w-16 h-16 text-sage-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="font-playfair text-2xl font-semibold text-sage-800 dark:text-cream-100 mb-2">
                {tr.bookingConfirmed}
              </h2>
              <p className="text-sage-500 dark:text-sage-400 text-sm">
                {lang === 'ru' ? 'Детали отправлены по SMS' : 'Maglumatlar SMS arkaly iberildi'}
              </p>
            </>
          ) : status === 'cancelled' ? (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-red-500">×</span>
              </div>
              <h2 className="font-playfair text-2xl font-semibold text-sage-800 dark:text-cream-100 mb-2">
                {tr.bookingCancelled}
              </h2>
            </>
          ) : (
            <>
              <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
              <h2 className="font-playfair text-2xl font-semibold text-sage-800 dark:text-cream-100 mb-3">
                {lang === 'ru' ? 'Заявка отправлена' : 'Arzaňyz iberildi'}
              </h2>
              <p className="text-sage-500 dark:text-sage-400 text-sm">
                {tr.bookingSubmitted}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-sage-400">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {lang === 'ru' ? 'Ожидаем ответа...' : 'Jogaba garaşylýar...'}
              </div>
            </>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-playfair text-4xl font-semibold text-sage-800 dark:text-cream-100 mb-2">
          {tr.bookingTitle}
        </h1>
        <p className="text-sage-500 dark:text-sage-400">{tr.bookingSubtitle}</p>
        <div className="w-12 h-0.5 bg-sage-400 mt-3" />
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Zone selector */}
        <div>
          <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-3">
            {lang === 'ru' ? 'Выберите зону' : 'Zona saýlaň'}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {zones.map((z) => {
              const Icon = z.icon
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setZone(z.id)}
                  className={`card p-4 text-center transition-all ${
                    zone === z.id
                      ? 'border-2 border-sage-500 bg-sage-50 dark:bg-sage-800'
                      : 'border border-cream-200 dark:border-sage-700 hover:border-sage-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${zone === z.id ? 'text-sage-600' : 'text-sage-400'}`} />
                  <p className="text-xs font-medium text-sage-700 dark:text-sage-200">
                    {lang === 'ru' ? z.iconRu : z.iconTk}
                  </p>
                  <p className="text-xs text-sage-400 mt-0.5 hidden sm:block">
                    {tr[z.descKey]}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1.5">
              {tr.selectDate}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1.5">
              {tr.selectTime}
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input"
              required
            >
              <option value="">{tr.selectTime}</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Guest count */}
        <div>
          <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1.5">
            {tr.guestCount}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
              className="w-10 h-10 rounded-full border border-cream-300 dark:border-sage-600 flex items-center justify-center hover:bg-cream-200 dark:hover:bg-sage-700 transition-colors text-sage-700 dark:text-sage-200 text-lg"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold text-sage-800 dark:text-cream-100 text-lg">
              {guestCount}
            </span>
            <button
              type="button"
              onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
              className="w-10 h-10 rounded-full border border-cream-300 dark:border-sage-600 flex items-center justify-center hover:bg-cream-200 dark:hover:bg-sage-700 transition-colors text-sage-700 dark:text-sage-200 text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1.5">
              {tr.yourName}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tr.namePlaceholder}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1.5">
              {tr.yourPhone}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={tr.phonePlaceholder}
              className="input"
              required
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1.5">
            {tr.note}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={tr.notePlaceholder}
            rows={3}
            className="input resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? tr.loading : tr.submitBooking}
        </button>
      </motion.form>
    </div>
  )
}
