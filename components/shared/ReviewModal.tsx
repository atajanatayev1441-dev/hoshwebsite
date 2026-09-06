'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star } from 'lucide-react'
import { toast } from 'sonner'
import { useLang } from '@/components/providers/LangProvider'

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
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  color: 'var(--gold)',
  display: 'block',
  marginBottom: '8px',
}

export function ReviewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useLang()
  const ru = lang === 'ru'

  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      toast.error(ru ? 'Напишите отзыв' : 'Pikiriňizi ýazyň')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, message, lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(ru ? 'Спасибо за отзыв!' : 'Pikiriňiz üçin sag boluň!')
      setName(''); setRating(5); setMessage('')
      onClose()
    } catch {
      toast.error(ru ? 'Ошибка. Попробуйте снова.' : 'Ýalňyşlyk. Gaýtadan synanşyň.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed z-[70] left-1/2 top-1/2 w-[92%]"
            style={{
              transform: 'translate(-50%, -50%)',
              maxWidth: '440px',
              background: '#0d0c09',
              border: '1px solid #1e1b16',
              padding: 'clamp(24px, 5vw, 36px)',
            }}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#5c5852] hover:text-[#f0ece3] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 300, color: 'var(--white)', marginBottom: '20px' }}>
              {ru ? 'Оставить отзыв' : 'Pikir goýuň'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label style={labelStyle}>{ru ? 'Оценка' : 'Baha'}</label>
                <div className="flex items-center gap-1.5 mt-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      aria-label={`${n}`}
                      className="p-0.5"
                    >
                      <Star
                        className="w-6 h-6 transition-colors"
                        style={{
                          color: n <= rating ? 'var(--gold)' : 'rgba(255,255,255,0.15)',
                          fill: n <= rating ? 'var(--gold)' : 'transparent',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>{ru ? 'Ваше имя (необязательно)' : 'Adyňyz (hökmany däl)'}</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={ru ? 'Например: Мурад' : 'Meselem: Myrat'}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderBottomColor = 'var(--gold)')}
                  onBlur={(e) => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)')}
                />
              </div>

              <div>
                <label style={labelStyle}>{ru ? 'Отзыв' : 'Pikir'}</label>
                <textarea
                  value={message} rows={4} onChange={(e) => setMessage(e.target.value)}
                  placeholder={ru ? 'Расскажите, как вам у нас' : 'Bize bolan pikiriňizi ýazyň'}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={(e) => (e.target.style.borderBottomColor = 'var(--gold)')}
                  onBlur={(e) => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)')}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-gold w-full justify-center disabled:opacity-50">
                {loading ? (ru ? 'Отправка...' : 'Iberilýär...') : (ru ? 'Отправить' : 'Iber')}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
