import { SessionProvider } from '@/components/providers/SessionProvider'
import { AdminShell } from '@/components/admin/AdminShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider session={null}>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  )
}
