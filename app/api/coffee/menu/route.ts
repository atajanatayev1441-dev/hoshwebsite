import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cats = await prisma.category.findMany({
    where: { venue: 'coffee' },
    select: { id: true },
  })
  const ids = cats.map((c) => c.id)
  const items = await prisma.menuItem.findMany({
    where: { categoryId: { in: ids } },
    include: { category: true },
    orderBy: [{ featured: 'desc' }, { id: 'asc' }],
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const item = await prisma.menuItem.create({ data: body })
  return NextResponse.json(item, { status: 201 })
}
