import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const promos = await prisma.promotion.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(promos)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const promo = await prisma.promotion.create({ data: body })
  return NextResponse.json(promo, { status: 201 })
}
