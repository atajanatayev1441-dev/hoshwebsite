import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Returns ALL categories including hidden ones — for admin menu management
export async function GET() {

  const categories = await prisma.category.findMany({
    orderBy: { position: 'asc' },
  })
  return NextResponse.json(categories)
}
