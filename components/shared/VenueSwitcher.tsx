'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export function VenueSwitcher() {
  const pathname = usePathname()
  const isCoffee = pathname.startsWith('/coffee')

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'stretch',
      background: 'rgba(6,6,6,0.95)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: '2px',
      overflow: 'hidden',
      flexShrink: 0,
    }}>

      {/* ── HOŞ LOUNGE ── */}
      <Link
        href="/"
        title="HOŞ Lounge"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '58px',
          height: '50px',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          background: !isCoffee ? 'rgba(201,168,76,0.1)' : 'transparent',
          textDecoration: 'none',
          transition: 'background 0.3s',
          gap: '3px',
          position: 'relative',
        }}
      >
        {/* Active gold underline */}
        {!isCoffee && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '15%',
            right: '15%',
            height: '2px',
            background: '#C9A84C',
          }} />
        )}
        <div style={{ position: 'relative', width: 34, height: 34, flexShrink: 0 }}>
          <Image
            src="/images/hoslounge.jpg"
            alt="HOŞ Lounge"
            fill
            sizes="34px"
            style={{
              objectFit: 'contain',
              mixBlendMode: 'screen',
              filter: !isCoffee
                ? 'brightness(1.15) contrast(1.05)'
                : 'brightness(0.4)',
              transition: 'filter 0.3s',
            }}
          />
        </div>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '6.5px',
          fontWeight: 600,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: !isCoffee ? 'rgba(201,168,76,0.8)' : 'rgba(255,255,255,0.2)',
          transition: 'color 0.3s',
          lineHeight: 1,
        }}>
          LOUNGE
        </span>
      </Link>

      {/* ── HOŞ COFFEE ── */}
      <Link
        href="/coffee"
        title="HOŞ Coffee"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '58px',
          height: '50px',
          background: isCoffee ? 'rgba(122,140,117,0.12)' : 'transparent',
          textDecoration: 'none',
          transition: 'background 0.3s',
          gap: '3px',
          position: 'relative',
        }}
      >
        {/* Active sage underline */}
        {isCoffee && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '15%',
            right: '15%',
            height: '2px',
            background: '#7a8c75',
          }} />
        )}
        <div style={{ position: 'relative', width: 34, height: 34, flexShrink: 0 }}>
          <Image
            src="/images/hoscoffee.webp"
            alt="HOŞ Coffee"
            fill
            sizes="34px"
            style={{
              objectFit: 'contain',
              mixBlendMode: 'screen',
              filter: isCoffee
                ? 'brightness(1.15) contrast(1.05)'
                : 'brightness(0.4)',
              transition: 'filter 0.3s',
            }}
          />
        </div>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '6.5px',
          fontWeight: 600,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: isCoffee ? 'rgba(122,140,117,0.85)' : 'rgba(255,255,255,0.2)',
          transition: 'color 0.3s',
          lineHeight: 1,
        }}>
          COFFEE
        </span>
      </Link>
    </div>
  )
}
