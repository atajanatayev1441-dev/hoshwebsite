export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Returns ALL categories including hidden ones — for admin menu management
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const venue = searchParams.get('venue') ?? 'lounge'
  const categories = await prisma.category.findMany({
    where: { venue },
    orderBy: { position: 'asc' },
  })
  return NextResponse.json(categories)
}
