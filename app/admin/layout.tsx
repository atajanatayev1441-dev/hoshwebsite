import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { AdminShell } from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Auth redirect is handled by middleware.ts — layout just provides session to client components
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (err) {
    console.error('[AdminLayout] getServerSession error:', err)
  }

  return (
    <SessionProvider session={session}>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  )
}
