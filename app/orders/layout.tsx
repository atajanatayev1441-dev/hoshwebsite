import { Navbar } from '@/components/layout/Navbar'

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-cream-100 dark:bg-sage-950">
        {children}
      </main>
    </>
  )
}
