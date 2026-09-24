export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const UPDATABLE_FIELDS = [
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

  const body = await req.json()
  const data = Object.fromEntries(
    UPDATABLE_FIELDS.filter((key) => key in body).map((key) => [key, body[key]])
  )
  const item = await prisma.menuItem.update({
    where: { id: Number(params.id) },
    data,
  })
  return NextResponse.json(item)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {

  await prisma.menuItem.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ ok: true })
}
