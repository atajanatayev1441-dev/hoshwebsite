'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

const SAGE = '#6b7d68'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) { setError('Введите ваше имя'); return }
    if (!form.phone.trim()) { setError('Введите номер телефона'); return }
    if (form.password.length < 6) { setError('Пароль должен быть минимум 6 символов'); return }
    if (form.password !== form.confirm) { setError('Пароли не совпадают'); return }

    setLoading(true)
    try {
      const rawPhone = form.phone.trim()
      const phone = (rawPhone.startsWith('+') ? '+' : '') + rawPhone.replace(/\D/g, '')
      const res = await fetch('/api/client/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone, password: form.password }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Ошибка регистрации'); return }
      router.push('/auth/login?registered=1')
    } catch {
      setError('Ошибка сервера. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid rgba(0,0,0,0.12)',
    background: '#fff',
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    color: '#1c1c1c',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#6b7060',
    marginBottom: '8px',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'var(--font-body)' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 300, color: '#1c1c1c', margin: 0, letterSpacing: '0.05em' }}>
            HOŞ
          </h1>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8a857e', marginTop: '8px' }}>
            Создать аккаунт
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Name */}
          <div>
            <label style={labelStyle}>Имя</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ваше имя"
              autoComplete="name"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)')}
            />
          </div>

          {/* Phone */}
          <div>
            <label style={labelStyle}>Телефон</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+993 __ ___ ____"
              autoComplete="tel"
              style={{ ...inputStyle, fontSize: '16px' }}
              onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)')}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Пароль</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Минимум 6 символов"
                autoComplete="new-password"
                style={{ ...inputStyle, paddingRight: '48px' }}
                onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)')}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.3)', padding: 0 }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={labelStyle}>Подтвердить пароль</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Повторите пароль"
                autoComplete="new-password"
                style={{ ...inputStyle, paddingRight: '48px' }}
                onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)')}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(v => !v)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.3)', padding: 0 }}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: '#b91c1c', fontSize: '13px', textAlign: 'center', margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading ? 'rgba(107,125,104,0.6)' : SAGE,
              color: '#fff',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              transition: 'background 0.2s',
              marginTop: '4px',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#5a6b57' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = loading ? 'rgba(107,125,104,0.6)' : SAGE }}
          >
            {loading ? 'Регистрация...' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '13px', color: '#8a857e' }}>
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" style={{ color: SAGE, textDecoration: 'none', fontWeight: 500 }}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
