import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientFromRequest } from '@/lib/clientAuth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const payload = await getClientFromRequest(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await prisma.client.findUnique({ where: { id: payload.id } })
  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ id: client.id, phone: client.phone, name: client.name })
}
