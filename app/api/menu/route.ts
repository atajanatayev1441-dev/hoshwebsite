import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

const CREATABLE_FIELDS = [
  'categoryId',
  'name_ru',
  'name_tk',
  'description_ru',
  'description_tk',
  'price',
  'imageUrl',
  'available',
  'featured',
] as const

export async function POST(req: NextRequest) {

  const body = await req.json()
  const data = Object.fromEntries(
    CREATABLE_FIELDS.filter((key) => key in body).map((key) => [key, body[key]])
  ) as { categoryId: number; name_ru: string; name_tk: string; price: number }
  const item = await prisma.menuItem.create({ data })
  return NextResponse.json(item, { status: 201 })
}
