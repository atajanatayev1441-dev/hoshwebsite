import { CartProvider } from '@/components/providers/CartProvider'
import { CoffeeNavbar } from '@/components/coffee/CoffeeNavbar'
import { CoffeeCartDrawer } from '@/components/coffee/CoffeeCartDrawer'

export const metadata = {
  title: 'HOŞ Coffee — Кофейня в Ашхабаде',
  description: 'HOŞ Coffee — третья волна кофе, уютная атмосфера, свежие зёрна. Ашхабад, Туркменистан.',
}

export default function CoffeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <CoffeeNavbar />
      {children}
      <CoffeeCartDrawer />
    </CartProvider>
  )
}
