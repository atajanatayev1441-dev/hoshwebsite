export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [
    pendingOrders,
    pendingBookings,
    confirmedToday,
    loungeRevenueRaw,
    coffeeRevenueRaw,
    recentOrders,
    recentBookings,
    topItemsRaw,
  ] = await Promise.all([
    // pending orders across all venues
    prisma.order.count({ where: { status: 'pending' } }),
    // pending bookings across all venues
    prisma.booking.count({ where: { status: 'pending' } }),
    // confirmed/preparing/ready orders today (all venues)
    prisma.order.count({
      where: {
        status: { in: ['confirmed', 'preparing', 'ready'] },
        createdAt: { gte: today, lt: tomorrow },
      },
    }),
    // lounge revenue today
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        venue: 'lounge',
        status: { in: ['confirmed', 'preparing', 'ready'] },
        createdAt: { gte: today, lt: tomorrow },
      },
    }),
    // coffee revenue today
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        venue: 'coffee',
        status: { in: ['confirmed', 'preparing', 'ready'] },
        createdAt: { gte: today, lt: tomorrow },
      },
    }),
    // last 10 orders from both venues
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { menuItem: true } } },
    }),
    // last 5 bookings
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    // top 5 menu items by total quantity ordered
    prisma.orderItem.groupBy({
      by: ['menuItemId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ])

  // Resolve menu item names for top items
  const topItemIds = topItemsRaw.map((t) => t.menuItemId)
  const topMenuItems = await prisma.menuItem.findMany({
    where: { id: { in: topItemIds } },
    select: { id: true, name_ru: true, name_tk: true },
  })
  const menuItemMap = new Map(topMenuItems.map((m) => [m.id, m]))

  const topItems = topItemsRaw.map((t) => ({
    name_ru: menuItemMap.get(t.menuItemId)?.name_ru ?? '—',
    name_tk: menuItemMap.get(t.menuItemId)?.name_tk ?? '—',
    count: t._sum.quantity ?? 0,
  }))

  const loungeRevenueToday = loungeRevenueRaw._sum.totalAmount ?? 0
  const coffeeRevenueToday = coffeeRevenueRaw._sum.totalAmount ?? 0

  return NextResponse.json({
    pendingOrders,
    pendingBookings,
    confirmedToday,
    revenueToday: loungeRevenueToday + coffeeRevenueToday,
    loungeRevenueToday,
    coffeeRevenueToday,
    recentOrders,
    recentBookings,
    topItems,
  })
}
