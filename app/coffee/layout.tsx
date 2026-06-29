import { LangProvider } from '@/components/providers/LangProvider'

export const metadata = {
  title: 'HOŞ Coffee',
  description: 'Кофейня HOŞ Coffee в Ашхабаде — третья волна кофе, уютная атмосфера',
}

export default function CoffeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      {children}
    </LangProvider>
  )
}
