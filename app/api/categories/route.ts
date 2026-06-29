import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const venue = searchParams.get('venue') ?? 'lounge'
  const categories = await prisma.category.findMany({
    where: { visible: true, venue },
    orderBy: { position: 'asc' },
  })
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {

  const body = await req.json()
  const category = await prisma.category.create({ data: body })
  return NextResponse.json(category, { status: 201 })
}
