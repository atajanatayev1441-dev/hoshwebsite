import { LangProvider } from '@/components/providers/LangProvider'
import { CoffeeNavbar } from '@/components/coffee/CoffeeNavbar'

export const metadata = {
  title: 'HOŞ Coffee — Кофейня в Ашхабаде',
  description: 'HOŞ Coffee — третья волна кофе, уютная атмосфера, свежие зёрна. Ашхабад, Туркменистан.',
}

export default function CoffeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <CoffeeNavbar />
      {children}
    </LangProvider>
  )
}
