import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' } })
  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const event = await prisma.event.create({ data })
  return NextResponse.json(event, { status: 201 })
}
