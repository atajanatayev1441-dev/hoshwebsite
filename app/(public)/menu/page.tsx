'use client'

import { useLang } from '@/components/providers/LangProvider'

export default function MenuPage() {
  const { lang } = useLang()
  const ru = lang === 'ru'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '28px' }}>
        {ru ? 'МЕНЮ' : 'MENÝU'}
      </span>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(48px, 8vw, 100px)', fontWeight: 300, color: 'var(--white)', lineHeight: 0.9, letterSpacing: '-0.02em', margin: 0 }}>
        {ru ? 'Скоро' : 'Yakynda'}
      </h1>
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 4vw, 48px)', fontStyle: 'italic', color: 'var(--gold)', marginTop: '12px', marginBottom: '40px' }}>
        {ru ? 'появится' : 'peýda bolar'}
      </p>
      <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '0 auto 32px' }} />
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 300, color: 'var(--muted)', maxWidth: '320px', lineHeight: 1.8 }}>
        {ru ? 'Мы обновляем меню. Совсем скоро здесь появятся все позиции.' : 'Menýumyzy täzeläp durys. Ýakyn wagtda ähli pozisiýalar peýda bolar.'}
      </p>
    </div>
  )
}
