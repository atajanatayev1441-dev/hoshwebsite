export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone')?.trim()
  if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 })

  const orders = await prisma.order.findMany({
    where: { clientPhone: phone },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      items: {
        include: { menuItem: { select: { name_ru: true, name_tk: true } } },
      },
    },
  })

  return NextResponse.json(orders)
}
