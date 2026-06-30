import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json()
  const event = await prisma.event.update({ where: { id: Number(params.id) }, data })
  return NextResponse.json(event)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.event.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ ok: true })
}
