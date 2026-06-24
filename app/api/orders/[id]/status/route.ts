export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public endpoint — no auth required, used for client-side polling
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: Number(params.id) },
    include: {
      items: {
        include: { menuItem: { select: { name_ru: true, name_tk: true } } },
      },
    },
  })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    id: order.id,
    status: order.status,
    tableNumber: order.tableNumber,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    items: order.items,
  })
}
