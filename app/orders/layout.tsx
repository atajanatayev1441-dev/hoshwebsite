import { Navbar } from '@/components/layout/Navbar'

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#080705]" style={{ paddingTop: '64px' }}>
        {children}
      </main>
    </>
  )
}
