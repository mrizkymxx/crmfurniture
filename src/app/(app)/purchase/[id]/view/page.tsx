'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { ArrowLeft, ShoppingCart, Pencil } from 'lucide-react'
import Link from 'next/link'

interface PurchaseItem {
  id: string
  quantity: number
  unit_price: number
  item: {
    item_code: string
    name: string
    unit: string
  }
}

interface PurchaseOrder {
  id: string
  po_number: string
  supplier_name: string
  supplier_contact: string | null
  order_date: string
  expected_delivery: string | null
  status: string
  total_amount: number
  notes: string | null
  created_at: string
}

export default function PurchaseOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<PurchaseOrder | null>(null)
  const [items, setItems] = useState<PurchaseItem[]>([])

  useEffect(() => {
    fetchOrderDetails()
  }, [])

  const fetchOrderDetails = async () => {
    try {
      // Fetch purchase order
      const { data: orderData, error: orderError } = await supabase
        .from('purchase_orders')
        .select('*')
        .eq('id', params.id)
        .single()

      if (orderError) throw orderError

      // Fetch purchase items with item details
      const { data: itemsData, error: itemsError } = await supabase
        .from('purchase_items')
        .select(`
          id,
          quantity,
          unit_price,
          item:item_id (
            item_code,
            name,
            unit
          )
        `)
        .eq('purchase_order_id', params.id)

      if (itemsError) throw itemsError

      setOrder(orderData)
      setItems(itemsData as any)
    } catch (error) {
      console.error('Error fetching order details:', error)
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading order details...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-red-600">Order not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/purchase')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <div className="p-2 rounded-lg" style={{background: 'linear-gradient(to bottom right, rgb(168 85 247), rgb(236 72 153))'}}>
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{order.po_number}</h1>
            <p className="text-gray-600">Purchase Order Details</p>
          </div>
        </div>
        <Link href={`/purchase/${order.id}/edit`}>
          <Button>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Order
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">PO Number</p>
              <p className="font-semibold">{order.po_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">
                {format(new Date(order.order_date), 'MMMM dd, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expected Delivery</p>
              <p className="font-semibold">
                {order.expected_delivery
                  ? format(new Date(order.expected_delivery), 'MMMM dd, yyyy')
                  : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created At</p>
              <p className="font-semibold">
                {format(new Date(order.created_at), 'MMMM dd, yyyy HH:mm')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Supplier Name</p>
              <p className="font-semibold">{order.supplier_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Contact</p>
              <p className="font-semibold">
                {order.supplier_contact || 'Not provided'}
              </p>
            </div>
            {order.notes && (
              <div>
                <p className="text-sm text-gray-600">Notes</p>
                <p className="font-semibold">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.item.item_code}
                  </TableCell>
                  <TableCell>{item.item.name}</TableCell>
                  <TableCell>{item.item.unit}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ${item.unit_price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${(item.quantity * item.unit_price).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="border-t mt-4 pt-4">
            <div className="flex justify-end items-center gap-4">
              <span className="text-xl font-semibold">Total Amount:</span>
              <span className="text-3xl font-bold text-purple-600">
                ${order.total_amount.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
