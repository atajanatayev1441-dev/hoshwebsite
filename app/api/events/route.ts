import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const today = new Date().toISOString().slice(0, 10)
  const events = await prisma.event.findMany({
    where: { active: true, date: { gte: today } },
    orderBy: { date: 'asc' },
  })
  return NextResponse.json(events)
}
