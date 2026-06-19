import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Returns ALL promotions (active + inactive) for admin
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const promos = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(promos)
}
