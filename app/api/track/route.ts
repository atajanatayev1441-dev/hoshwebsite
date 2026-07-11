export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, clientIp } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone')?.trim()
  if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 })

  // Anyone who knows/guesses a phone number can see that customer's recent
  // orders here (no ownership check) — rate limit slows down enumeration.
  const { allowed } = await rateLimit(`track:${clientIp(req.headers)}`, 20, 60)
  if (!allowed) {
    return NextResponse.json({ error: 'Слишком много запросов, попробуйте позже' }, { status: 429 })
  }

  const orders = await prisma.order.findMany({
    where: { clientPhone: phone },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      items: {
        include: { menuItem: { select: { name_ru: true, name_tk: true } } },
      },
    },
  })

  return NextResponse.json(orders)
}
