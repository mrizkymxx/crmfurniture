'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    pendingPurchaseOrders: 0,
    pendingSalesOrders: 0,
    activeWorkOrders: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [items, lowStock, purchaseOrders, salesOrders, workOrders] = await Promise.all([
          supabase.from('items').select('id', { count: 'exact' }),
          supabase.from('items').select('id', { count: 'exact' }).lt('current_stock', 'min_stock'),
          supabase.from('purchase_orders').select('id', { count: 'exact' }).eq('status', 'pending'),
          supabase.from('sales_orders').select('id', { count: 'exact' }).eq('status', 'pending'),
          supabase.from('work_orders').select('id', { count: 'exact' }).in('status', ['pending', 'processing']),
        ])

        setStats({
          totalItems: items.count || 0,
          lowStockItems: lowStock.count || 0,
          pendingPurchaseOrders: purchaseOrders.count || 0,
          pendingSalesOrders: salesOrders.count || 0,
          activeWorkOrders: workOrders.count || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  const statCards = [
    { title: 'Total Items', value: stats.totalItems, icon: '📦' },
    { title: 'Low Stock Items', value: stats.lowStockItems, icon: '⚠️', color: 'text-red-600' },
    { title: 'Pending Purchase Orders', value: stats.pendingPurchaseOrders, icon: '🛒' },
    { title: 'Pending Sales Orders', value: stats.pendingSalesOrders, icon: '💰' },
    { title: 'Active Work Orders', value: stats.activeWorkOrders, icon: '⚙️' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to your factory management system</p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <span className="text-2xl">{stat.icon}</span>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color || ''}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <a
              href="/inventory/new"
              className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400"
            >
              <span className="text-sm font-medium">+ Add New Item</span>
            </a>
            <a
              href="/purchase/new"
              className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400"
            >
              <span className="text-sm font-medium">+ Create Purchase Order</span>
            </a>
            <a
              href="/sales/new"
              className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400"
            >
              <span className="text-sm font-medium">+ Create Sales Order</span>
            </a>
            <a
              href="/mrp/work-orders/new"
              className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400"
            >
              <span className="text-sm font-medium">+ Create Work Order</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
