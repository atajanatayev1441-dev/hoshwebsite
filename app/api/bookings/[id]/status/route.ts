import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(params.id) },
    select: { id: true, status: true, zone: true, date: true, time: true, guestCount: true },
  })
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(booking)
}
