'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { StatusUpdateDialog } from '@/components/status-update-dialog'

interface SalesOrder {
  id: string
  so_number: string
  customer_name: string
  order_date: string
  delivery_date: string | null
  status: string
  shipping_status: string
  total_amount: number
}

export default function SalesPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<SalesOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching sales orders:', error)
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
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleDelete = async (orderId: string, soNumber: string) => {
    if (!confirm(`Are you sure you want to delete Sales Order ${soNumber}?`)) {
      return
    }

    setDeleting(orderId)
    try {
      // Delete sales items first
      const { error: itemsError } = await supabase
        .from('sales_items')
        .delete()
        .eq('sales_order_id', orderId)

      if (itemsError) throw itemsError

      // Delete sales order
      const { error: orderError } = await supabase
        .from('sales_orders')
        .delete()
        .eq('id', orderId)

      if (orderError) throw orderError

      toast.success('Sales order deleted successfully')
      fetchOrders()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete sales order')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Orders</h1>
          <p className="text-gray-600">Manage your sales orders</p>
        </div>
        <Link href="/sales/new">
          <Button>+ Create Sales Order</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No sales orders found. Create your first order to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SO Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Shipping</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.so_number}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>
                      {format(new Date(order.order_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {order.delivery_date
                        ? format(new Date(order.delivery_date), 'MMM dd, yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{order.shipping_status}</span>
                    </TableCell>
                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusUpdateDialog
                          orderId={order.id}
                          orderNumber={order.so_number}
                          currentStatus={order.status}
                          orderType="sales"
                          onSuccess={fetchOrders}
                        />
                        <Link href={`/sales/${order.id}/view`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/sales/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(order.id, order.so_number)}
                          disabled={deleting === order.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
