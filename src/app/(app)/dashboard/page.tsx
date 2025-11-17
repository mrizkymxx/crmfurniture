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
      {/* Header with subtle n8n gradient */}
      <div className="relative overflow-hidden rounded-xl p-8 bg-linear-to-br from-primary/10 via-secondary/10 to-primary/5 border border-primary/20">
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-muted-foreground text-base">Welcome back! Here&apos;s what&apos;s happening with your factory today.</p>
        </div>
      </div>

      {/* Modern Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/inventory" className="group relative p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Total Items</p>
            <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">{stats.totalItems}</p>
          <p className="text-xs text-primary flex items-center gap-1">
            <span>→</span> View inventory
          </p>
        </Link>
        
        <Link href="/inventory" className="group relative p-6 rounded-xl bg-card border border-border hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
            <div className="p-2.5 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">{stats.lowStockItems}</p>
          <p className="text-xs text-orange-500 flex items-center gap-1">
            <span>→</span> Needs attention
          </p>
        </Link>
        
        <Link href="/sales" className="group relative p-6 rounded-xl bg-card border border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
            <div className="p-2.5 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{stats.pendingPurchaseOrders + stats.pendingSalesOrders}</p>
            <p className="text-xs text-secondary flex items-center gap-1">
              <span>→</span> View orders
            </p>
          </Link>
        
        <Link href="/mrp" className="group relative p-6 rounded-xl bg-card border border-border hover:border-green-500/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Active Productions</p>
            <div className="p-2.5 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">{stats.activeWorkOrders}</p>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span>→</span> View production
          </p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-card p-8 rounded-xl border border-border">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-linear-to-b from-primary to-secondary"></div>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/inventory" className="group relative p-6 border border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="font-semibold text-base mb-1 text-foreground">Manage Inventory</p>
            <p className="text-sm text-muted-foreground mb-4">Add or update items</p>
            <div className="flex items-center text-primary text-sm font-medium">
              <span>Go to inventory</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
          
          <Link href="/purchase" className="group relative p-6 border border-border rounded-xl hover:border-secondary/50 transition-all duration-300 hover:shadow-lg bg-card">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="font-semibold text-base mb-1 text-foreground">Purchase Order</p>
            <p className="text-sm text-muted-foreground mb-4">Order from suppliers</p>
            <div className="flex items-center text-secondary text-sm font-medium">
              <span>Create order</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
          
          <Link href="/sales" className="group relative p-6 border border-border rounded-xl hover:border-green-500/50 transition-all duration-300 hover:shadow-lg bg-card">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-semibold text-base mb-1 text-foreground">Sales Order</p>
            <p className="text-sm text-muted-foreground mb-4">Process customer orders</p>
            <div className="flex items-center text-green-500 text-sm font-medium">
              <span>Create order</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
          
          <Link href="/mrp" className="group relative p-6 border border-border rounded-xl hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg bg-card">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="font-semibold text-base mb-1 text-foreground">MRP Planning</p>
            <p className="text-sm text-muted-foreground mb-4">Calculate requirements</p>
            <div className="flex items-center text-orange-500 text-sm font-medium">
              <span>Start planning</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
