import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartProvider } from '@/components/providers/CartProvider'
import { CartDrawer } from '@/components/menu/CartDrawer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <main className="min-h-screen" style={{ paddingTop: '64px' }}>
        {children}
      </main>
      <CartDrawer />
      <Footer />
    </CartProvider>
  )
}
