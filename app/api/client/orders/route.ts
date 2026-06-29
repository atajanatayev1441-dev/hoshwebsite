import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientFromRequest } from '@/lib/clientAuth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const client = await getClientFromRequest(req)
  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { clientPhone: client.phone },
    include: {
      items: {
        include: { menuItem: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return NextResponse.json(orders)
}
