import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { LangProvider } from '@/components/providers/LangProvider'

export const metadata: Metadata = {
  title: 'HOS Coffee Lounge',
  description: 'Авторский кофе, домашняя выпечка и уютная атмосфера',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LangProvider>
            {children}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
