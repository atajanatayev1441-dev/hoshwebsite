'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  UtensilsCrossed,
  Tag,
  Coffee,
  ExternalLink,
} from 'lucide-react'

interface AdminSidebarProps {
  pendingOrders: number
  pendingBookings: number
}

const navItems = [
  { href: '/admin/dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Заказы', icon: ShoppingBag, badgeKey: 'orders' },
  { href: '/admin/bookings', label: 'Бронирования', icon: CalendarDays, badgeKey: 'bookings' },
  { href: '/admin/menu', label: 'Меню', icon: UtensilsCrossed },
  { href: '/admin/promotions', label: 'Акции', icon: Tag },
]

export function AdminSidebar({ pendingOrders, pendingBookings }: AdminSidebarProps) {
  const pathname = usePathname()

  const getBadgeCount = (key?: string) => {
    if (key === 'orders') return pendingOrders
    if (key === 'bookings') return pendingBookings
    return 0
  }

  return (
    <aside className="w-60 flex-shrink-0 bg-sage-900 dark:bg-sage-950 min-h-screen flex flex-col border-r border-sage-800">
      {/* Logo */}
      <div className="p-5 border-b border-sage-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sage-600 flex items-center justify-center">
            <Coffee className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-cream-100 font-playfair font-semibold text-sm leading-none">HOS Coffee</p>
            <p className="text-sage-400 text-xs mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const badgeCount = getBadgeCount(item.badgeKey)
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative ${
                isActive
                  ? 'bg-sage-700 text-cream-100'
                  : 'text-sage-300 hover:text-cream-100 hover:bg-sage-800'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {badgeCount > 0 && (
                <span className="ml-auto min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-badge-pulse">
                  {badgeCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: view site */}
      <div className="p-3 border-t border-sage-800">
        <a
          href={process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://hoshwebsite-production.up.railway.app'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sage-400 hover:text-cream-100 hover:bg-sage-800 transition-colors w-full"
        >
          <ExternalLink className="w-4 h-4" />
          На сайт
        </a>
      </div>
    </aside>
  )
}
