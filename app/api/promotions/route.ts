import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const promos = await prisma.promotion.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(promos)
}

export async function POST(req: NextRequest) {

  const body = await req.json()
  const promo = await prisma.promotion.create({ data: body })
  return NextResponse.json(promo, { status: 201 })
}
