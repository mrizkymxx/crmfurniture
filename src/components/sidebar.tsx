'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Package, ShoppingCart, DollarSign, Settings, TrendingUp } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Purchase Orders', href: '/purchase', icon: ShoppingCart },
  { name: 'Sales Orders', href: '/sales', icon: DollarSign },
  { name: 'MRP', href: '/mrp', icon: Settings },
  { name: 'Reports', href: '/reports', icon: TrendingUp },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen } = useAppStore()

  if (!sidebarOpen) return null

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-card shadow-xl transition-all duration-300">
      <nav className="flex h-full flex-col overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-linear-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30'
                      : 'text-foreground hover:bg-muted hover:translate-x-1'
                  )}
                >
                  <Icon className={cn(
                    'h-5 w-5 transition-transform group-hover:scale-110',
                    isActive ? '' : ''
                  )} />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
