'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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
          supabase.from('items').select('id', { count: 'exact' }).lte('current_stock', supabase.from('items').select('min_stock')),
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

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header with gradient */}
      <div className="relative overflow-hidden rounded-2xl p-8 text-white shadow-2xl" style={{background: 'linear-gradient(to bottom right, rgb(37 99 235), rgb(29 78 216), rgb(67 56 202))'}}>
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-blue-100 text-lg">Welcome back! Here&apos;s what&apos;s happening with your factory today.</p>
        </div>
      </div>

      {/* Modern Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200 hover:scale-105" style={{background: 'linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254))'}}>
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{background: 'linear-gradient(to bottom right, rgb(59 130 246 / 0), rgb(59 130 246 / 0.05))'}}></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-blue-700">Total Items</p>
              <div className="p-2 bg-blue-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">{stats.totalItems}</p>
            <p className="text-xs text-blue-600">↑ View inventory</p>
          </div>
        </div>
        
        <div className="group relative p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-200 hover:scale-105" style={{background: 'linear-gradient(to bottom right, rgb(254 252 232), rgb(254 243 199))'}}>
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{background: 'linear-gradient(to bottom right, rgb(245 158 11 / 0), rgb(245 158 11 / 0.05))'}}></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-amber-700">Low Stock Items</p>
              <div className="p-2 bg-amber-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">{stats.lowStockItems}</p>
            <p className="text-xs text-amber-600">↑ Needs attention</p>
          </div>
        </div>
        
        <div className="group relative p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200 hover:scale-105" style={{background: 'linear-gradient(to bottom right, rgb(250 245 255), rgb(243 232 255))'}}>
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{background: 'linear-gradient(to bottom right, rgb(168 85 247 / 0), rgb(168 85 247 / 0.05))'}}></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-purple-700">Pending Orders</p>
              <div className="p-2 bg-purple-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">{stats.pendingPurchaseOrders + stats.pendingSalesOrders}</p>
            <p className="text-xs text-purple-600">↑ View orders</p>
          </div>
        </div>
        
        <div className="group relative p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-200 hover:scale-105" style={{background: 'linear-gradient(to bottom right, rgb(236 253 245), rgb(209 250 229))'}}>
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{background: 'linear-gradient(to bottom right, rgb(16 185 129 / 0), rgb(16 185 129 / 0.05))'}}></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-emerald-700">Active Productions</p>
              <div className="p-2 bg-emerald-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">{stats.activeWorkOrders}</p>
            <p className="text-xs text-emerald-600">↑ View production</p>
          </div>
        </div>
      </div>

      {/* Modern Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <div className="w-1 h-8 rounded-full" style={{background: 'linear-gradient(to bottom, rgb(59 130 246), rgb(168 85 247))'}}></div>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/inventory" className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 overflow-hidden" style={{background: 'linear-gradient(to bottom right, rgb(255 255 255), rgb(249 250 251))'}}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{background: 'linear-gradient(to bottom right, rgb(59 130 246 / 0), rgb(59 130 246 / 0.05))'}}></div>
            <div className="relative">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="font-semibold text-lg mb-2 text-gray-900">Manage Inventory</p>
              <p className="text-sm text-gray-600">Add or update items</p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                <span>Go to inventory</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
          
          <Link href="/purchase" className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all duration-300 overflow-hidden" style={{background: 'linear-gradient(to bottom right, rgb(255 255 255), rgb(249 250 251))'}}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{background: 'linear-gradient(to bottom right, rgb(168 85 247 / 0), rgb(168 85 247 / 0.05))'}}></div>
            <div className="relative">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                <svg className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="font-semibold text-lg mb-2 text-gray-900">Purchase Order</p>
              <p className="text-sm text-gray-600">Order from suppliers</p>
              <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                <span>Create order</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
          
          <Link href="/sales" className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-lg transition-all duration-300 overflow-hidden" style={{background: 'linear-gradient(to bottom right, rgb(255 255 255), rgb(249 250 251))'}}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{background: 'linear-gradient(to bottom right, rgb(16 185 129 / 0), rgb(16 185 129 / 0.05))'}}></div>
            <div className="relative">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                <svg className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-semibold text-lg mb-2 text-gray-900">Sales Order</p>
              <p className="text-sm text-gray-600">Process customer orders</p>
              <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium">
                <span>Create order</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
          
          <Link href="/mrp" className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-amber-500 hover:shadow-lg transition-all duration-300 overflow-hidden" style={{background: 'linear-gradient(to bottom right, rgb(255 255 255), rgb(249 250 251))'}}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{background: 'linear-gradient(to bottom right, rgb(245 158 11 / 0), rgb(245 158 11 / 0.05))'}}></div>
            <div className="relative">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors">
                <svg className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="font-semibold text-lg mb-2 text-gray-900">MRP Planning</p>
              <p className="text-sm text-gray-600">Calculate requirements</p>
              <div className="mt-4 flex items-center text-amber-600 text-sm font-medium">
                <span>Start planning</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
