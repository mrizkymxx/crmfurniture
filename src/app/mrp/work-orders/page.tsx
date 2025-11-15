'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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

interface WorkOrder {
  id: string
  wo_number: string
  quantity_to_produce: number
  quantity_produced: number
  production_stage: string
  status: string
  target_date: string | null
  item: {
    name: string
    item_code: string
  }
}

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchWorkOrders()
  }, [])

  const fetchWorkOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .select(`
          *,
          item:item_id(name, item_code)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWorkOrders(data as any || [])
    } catch (error) {
      console.error('Error fetching work orders:', error)
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

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      assembling: 'bg-blue-50 text-blue-700',
      finishing: 'bg-purple-50 text-purple-700',
      packing: 'bg-orange-50 text-orange-700',
      completed: 'bg-green-50 text-green-700',
    }
    return colors[stage] || 'bg-gray-50 text-gray-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <p className="text-gray-600">Manage production work orders</p>
        </div>
        <Link href="/mrp/work-orders/new">
          <Button>+ Create Work Order</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : workOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No work orders found. Create your first work order to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>WO Number</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Target Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.map((wo) => (
                  <TableRow key={wo.id}>
                    <TableCell className="font-medium">{wo.wo_number}</TableCell>
                    <TableCell>
                      {wo.item?.name} ({wo.item?.item_code})
                    </TableCell>
                    <TableCell>
                      {wo.quantity_produced} / {wo.quantity_to_produce}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{
                              width: `${
                                (wo.quantity_produced / wo.quantity_to_produce) * 100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {Math.round(
                            (wo.quantity_produced / wo.quantity_to_produce) * 100
                          )}
                          %
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStageColor(
                          wo.production_stage
                        )}`}
                      >
                        {wo.production_stage}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                          wo.status
                        )}`}
                      >
                        {wo.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {wo.target_date
                        ? format(new Date(wo.target_date), 'MMM dd, yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Link href={`/mrp/work-orders/${wo.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
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
