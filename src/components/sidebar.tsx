'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Inventory', href: '/inventory', icon: '📦' },
  { name: 'Purchase Orders', href: '/purchase', icon: '🛒' },
  { name: 'Sales Orders', href: '/sales', icon: '💰' },
  { name: 'MRP', href: '/mrp', icon: '⚙️' },
  { name: 'Reports', href: '/reports', icon: '📈' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen } = useAppStore()

  if (!sidebarOpen) return null

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r shadow-xl transition-transform duration-300" style={{background: 'linear-gradient(to bottom, rgb(249 250 251), rgb(255 255 255))'}}>
      <nav className="flex h-full flex-col overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
                  )}
                  style={isActive ? {background: 'linear-gradient(to right, rgb(37 99 235), rgb(79 70 229))'} : undefined}
                >
                  <span className={cn(
                    'text-xl transition-transform group-hover:scale-110',
                    isActive ? '' : ''
                  )}>{item.icon}</span>
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
