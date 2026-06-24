import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Returns ALL promotions (active + inactive) for admin
export async function GET() {

  const promos = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(promos)
}
