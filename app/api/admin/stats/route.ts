export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [pendingOrders, pendingBookings, confirmedToday, revenueToday, recentOrders, recentBookings] =
    await Promise.all([
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.order.count({
        where: { status: { in: ['confirmed', 'preparing', 'ready'] }, createdAt: { gte: today, lt: tomorrow } },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['confirmed', 'preparing', 'ready'] }, createdAt: { gte: today, lt: tomorrow } },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { menuItem: true } } },
      }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ])

  return NextResponse.json({
    pendingOrders,
    pendingBookings,
    confirmedToday,
    revenueToday: revenueToday._sum.totalAmount ?? 0,
    recentOrders,
    recentBookings,
  })
}
