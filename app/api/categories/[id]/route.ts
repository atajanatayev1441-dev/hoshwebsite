export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

  const body = await req.json()
  const category = await prisma.category.update({
    where: { id: Number(params.id) },
    data: body,
  })
  return NextResponse.json(category)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {

  await prisma.category.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ ok: true })
}
