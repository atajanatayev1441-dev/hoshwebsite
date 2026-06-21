import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Italiana } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { LangProvider } from '@/components/providers/LangProvider'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const italiana = Italiana({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-italiana',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HOS Coffee Lounge',
  description: 'Авторский кофе, домашняя выпечка и уютная атмосфера',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${cormorant.variable} ${dmSans.variable} ${italiana.variable}`}
    >
      <body>
        <ThemeProvider>
          <LangProvider>
            <SmoothScrollProvider />
            {children}
          </LangProvider>
        </ThemeProvider>
        <Toaster
          position="bottom-center"
          richColors
          toastOptions={{
            style: {
              fontFamily: "'Jost', system-ui, sans-serif",
              fontSize: '13px',
              letterSpacing: '0.02em',
            },
          }}
        />
      </body>
    </html>
  )
}
