import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { LangProvider } from '@/components/providers/LangProvider'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { ClientAuthProvider } from '@/components/providers/ClientAuthProvider'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HOŞ Coffee Lounge',
  description: 'Кофе-лаундж в Ашхабаде — авторский кофе, уютная атмосфера',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={cormorant.variable}>
      <body>
        <ThemeProvider>
          <LangProvider>
            <ClientAuthProvider>
              <SmoothScrollProvider />
              {children}
            </ClientAuthProvider>
          </LangProvider>
        </ThemeProvider>
        <Toaster
          position="bottom-center"
          richColors
          toastOptions={{ style: { fontFamily: 'var(--font-cormorant, Georgia, serif)', fontSize: '15px' } }}
        />
      </body>
    </html>
  )
}
