import { Navbar } from '@/components/layout/Navbar'
import { CartProvider } from '@/components/providers/CartProvider'
import { CartDrawer } from '@/components/menu/CartDrawer'

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <main className="min-h-screen" style={{ background: 'var(--bg)', paddingTop: '64px' }}>
        {children}
      </main>
      <CartDrawer />
    </CartProvider>
  )
}
