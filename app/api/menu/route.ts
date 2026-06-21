import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get('categoryId')

  const items = await prisma.menuItem.findMany({
    where: {
      ...(categoryId ? { categoryId: Number(categoryId) } : {}),
    },
    include: { category: true },
    orderBy: [{ featured: 'desc' }, { id: 'asc' }],
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const item = await prisma.menuItem.create({ data: body })
  return NextResponse.json(item, { status: 201 })
}
