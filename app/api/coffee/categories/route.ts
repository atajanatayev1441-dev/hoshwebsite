import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cats = await prisma.category.findMany({
    where: { visible: true, venue: 'coffee' },
    orderBy: { position: 'asc' },
    include: {
      items: {
        where: { available: true },
        orderBy: [{ featured: 'desc' }, { id: 'asc' }],
      },
    },
  })
  return NextResponse.json(cats)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const cat = await prisma.category.create({ data: { ...body, venue: 'coffee' } })
  return NextResponse.json(cat, { status: 201 })
}
