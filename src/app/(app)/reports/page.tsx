'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  ShoppingBag,
  Factory,
  AlertTriangle,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DashboardStats {
  totalInventoryValue: number
  lowStockItems: number
  totalPurchaseOrders: number
  totalPurchaseValue: number
  totalSalesOrders: number
  totalSalesValue: number
  activeWorkOrders: number
  completedWorkOrders: number
}

interface LowStockItem {
  id: string
  item_code: string
  name: string
  quantity: number
  reorder_level: number
  unit: string
}

interface RecentOrder {
  id: string
  order_number: string
  customer_supplier: string
  date: string
  amount: number
  status: string
}

interface TopProduct {
  item_code: string
  name: string
  total_quantity: number
  total_revenue: number
}

export default function ReportsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalInventoryValue: 0,
    lowStockItems: 0,
    totalPurchaseOrders: 0,
    totalPurchaseValue: 0,
    totalSalesOrders: 0,
    totalSalesValue: 0,
    activeWorkOrders: 0,
    completedWorkOrders: 0,
  })
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([])
  const [recentPurchases, setRecentPurchases] = useState<RecentOrder[]>([])
  const [recentSales, setRecentSales] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])

  useEffect(() => {
    fetchReportsData()
  }, [])

  const fetchReportsData = async () => {
    try {
      // Fetch inventory stats
      const { data: inventoryData } = await supabase
        .from('inventory_items')
        .select('quantity, unit_cost, reorder_level')

      const totalInventoryValue =
        inventoryData?.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0) || 0
      const lowStockCount =
        inventoryData?.filter((item) => item.quantity <= item.reorder_level).length || 0

      // Fetch low stock items
      const { data: lowStock } = await supabase
        .from('inventory_items')
        .select('id, item_code, name, quantity, reorder_level, unit')
        .order('quantity', { ascending: true })
        .limit(10)

      // Fetch purchase orders stats
      const { data: purchaseOrders } = await supabase
        .from('purchase_orders')
        .select('total_amount, status')

      const totalPurchaseOrders = purchaseOrders?.length || 0
      const totalPurchaseValue =
        purchaseOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0

      // Fetch recent purchases
      const { data: recentPurchase } = await supabase
        .from('purchase_orders')
        .select('id, po_number, supplier_name, order_date, total_amount, status')
        .order('order_date', { ascending: false })
        .limit(5)

      // Fetch sales orders stats
      const { data: salesOrders } = await supabase
        .from('sales_orders')
        .select('total_amount, status')

      const totalSalesOrders = salesOrders?.length || 0
      const totalSalesValue =
        salesOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0

      // Fetch recent sales
      const { data: recentSale } = await supabase
        .from('sales_orders')
        .select('id, so_number, customer_name, order_date, total_amount, status')
        .order('order_date', { ascending: false })
        .limit(5)

      // Fetch work orders stats
      const { data: workOrders } = await supabase.from('work_orders').select('status')

      const activeWorkOrders =
        workOrders?.filter((wo) => wo.status === 'in_progress').length || 0
      const completedWorkOrders =
        workOrders?.filter((wo) => wo.status === 'completed').length || 0

      // Fetch top selling products
      const { data: topSales } = await supabase
        .from('sales_items')
        .select(
          `
          quantity,
          unit_price,
          item:item_id (
            item_code,
            name
          )
        `
        )
        .limit(1000)

      // Aggregate top products
      const productMap = new Map<string, TopProduct>()
      topSales?.forEach((item: any) => {
        const key = item.item.item_code
        const existing = productMap.get(key)
        if (existing) {
          existing.total_quantity += item.quantity
          existing.total_revenue += item.quantity * item.unit_price
        } else {
          productMap.set(key, {
            item_code: item.item.item_code,
            name: item.item.name,
            total_quantity: item.quantity,
            total_revenue: item.quantity * item.unit_price,
          })
        }
      })

      const topProductsList = Array.from(productMap.values())
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, 10)

      setStats({
        totalInventoryValue,
        lowStockItems: lowStockCount,
        totalPurchaseOrders,
        totalPurchaseValue,
        totalSalesOrders,
        totalSalesValue,
        activeWorkOrders,
        completedWorkOrders,
      })

      setLowStockItems(lowStock || [])
      setRecentPurchases(
        recentPurchase?.map((p) => ({
          id: p.id,
          order_number: p.po_number,
          customer_supplier: p.supplier_name,
          date: p.order_date,
          amount: p.total_amount,
          status: p.status,
        })) || []
      )
      setRecentSales(
        recentSale?.map((s) => ({
          id: s.id,
          order_number: s.so_number,
          customer_supplier: s.customer_name,
          date: s.order_date,
          amount: s.total_amount,
          status: s.status,
        })) || []
      )
      setTopProducts(topProductsList)
    } catch (error) {
      console.error('Error fetching reports data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      in_progress: 'bg-blue-100 text-blue-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading reports...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{
            background: 'linear-gradient(to bottom right, rgb(59 130 246), rgb(37 99 235))',
          }}
        >
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Inventory Value
            </CardTitle>
            <Package className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalInventoryValue.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {stats.lowStockItems} items below reorder level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Purchase Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPurchaseOrders}</div>
            <p className="text-xs text-gray-600 mt-1">
              ${stats.totalPurchaseValue.toFixed(2)} total value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Sales Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSalesOrders}</div>
            <p className="text-xs text-gray-600 mt-1">
              ${stats.totalSalesValue.toFixed(2)} total revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Production
            </CardTitle>
            <Factory className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeWorkOrders}</div>
            <p className="text-xs text-gray-600 mt-1">
              {stats.completedWorkOrders} completed orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Tabs */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="purchase">Purchase</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockItems.length === 0 ? (
                <p className="text-center text-gray-600 py-4">
                  All items are adequately stocked
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead className="text-right">Current Stock</TableHead>
                      <TableHead className="text-right">Reorder Level</TableHead>
                      <TableHead className="text-right">Shortage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.item_code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right text-red-600 font-semibold">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.reorder_level} {item.unit}
                        </TableCell>
                        <TableCell className="text-right text-orange-600 font-semibold">
                          {item.reorder_level - item.quantity} {item.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Purchase Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold">{stats.totalPurchaseOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${stats.totalPurchaseValue.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Order Value</p>
                  <p className="text-xl font-semibold">
                    $
                    {stats.totalPurchaseOrders > 0
                      ? (stats.totalPurchaseValue / stats.totalPurchaseOrders).toFixed(2)
                      : '0.00'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Purchase Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPurchases.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-semibold">{order.order_number}</p>
                        <p className="text-sm text-gray-600">{order.customer_supplier}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.amount.toFixed(2)}</p>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Sales Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold">{stats.totalSalesOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${stats.totalSalesValue.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Order Value</p>
                  <p className="text-xl font-semibold">
                    $
                    {stats.totalSalesOrders > 0
                      ? (stats.totalSalesValue / stats.totalSalesOrders).toFixed(2)
                      : '0.00'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Profit Margin (Est.)</p>
                  <p className="text-xl font-semibold text-green-600">
                    $
                    {(stats.totalSalesValue - stats.totalPurchaseValue).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Sales Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSales.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-semibold">{order.order_number}</p>
                        <p className="text-sm text-gray-600">{order.customer_supplier}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          ${order.amount.toFixed(2)}
                        </p>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <p className="text-center text-gray-600 py-4">No sales data available</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="text-right">Units Sold</TableHead>
                      <TableHead className="text-right">Total Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product) => (
                      <TableRow key={product.item_code}>
                        <TableCell className="font-medium">{product.item_code}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {product.total_quantity}
                        </TableCell>
                        <TableCell className="text-right font-bold text-green-600">
                          ${product.total_revenue.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Active Work Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {stats.activeWorkOrders}
                </div>
                <p className="text-xs text-gray-600 mt-1">Currently in progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Completed Work Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {stats.completedWorkOrders}
                </div>
                <p className="text-xs text-gray-600 mt-1">Successfully finished</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats.activeWorkOrders + stats.completedWorkOrders > 0
                    ? Math.round(
                        (stats.completedWorkOrders /
                          (stats.activeWorkOrders + stats.completedWorkOrders)) *
                          100
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-gray-600 mt-1">Overall production efficiency</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
