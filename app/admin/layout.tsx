import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { AdminShell } from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session
  try {
    session = await getServerSession(authOptions)
  } catch (err) {
    console.error('[AdminLayout] getServerSession failed:', err)
    throw err
  }

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <SessionProvider session={session}>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  )
}
