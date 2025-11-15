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
import { Progress } from '@/components/ui/progress'
import { format } from 'date-fns'
import { ArrowLeft, Factory, Pencil } from 'lucide-react'
import Link from 'next/link'

interface BOMComponent {
  id: string
  quantity_required: number
  item: {
    item_code: string
    name: string
    unit: string
  }
}

interface ProductionLog {
  id: string
  log_date: string
  quantity_produced: number
  notes: string | null
}

interface WorkOrder {
  id: string
  wo_number: string
  production_date: string
  status: string
  quantity_ordered: number
  quantity_produced: number
  production_stage: string
  notes: string | null
  created_at: string
  finished_good: {
    item_code: string
    name: string
    unit: string
  }
  bom: {
    bom_number: string
    finished_good: {
      item_code: string
      name: string
    }
  }
}

export default function WorkOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [components, setComponents] = useState<BOMComponent[]>([])
  const [productionLogs, setProductionLogs] = useState<ProductionLog[]>([])

  useEffect(() => {
    fetchWorkOrderDetails()
  }, [])

  const fetchWorkOrderDetails = async () => {
    try {
      // Fetch work order with finished good and BOM details
      const { data: woData, error: woError } = await supabase
        .from('work_orders')
        .select(`
          *,
          finished_good:finished_good_id (
            item_code,
            name,
            unit
          ),
          bom:bom_id (
            bom_number,
            finished_good:finished_good_id (
              item_code,
              name
            )
          )
        `)
        .eq('id', params.id)
        .single()

      if (woError) throw woError

      // Fetch BOM components
      const { data: componentsData, error: componentsError } = await supabase
        .from('bom_components')
        .select(`
          id,
          quantity_required,
          item:item_id (
            item_code,
            name,
            unit
          )
        `)
        .eq('bom_id', woData.bom_id)

      if (componentsError) throw componentsError

      // Fetch production logs
      const { data: logsData, error: logsError } = await supabase
        .from('production_logs')
        .select('*')
        .eq('work_order_id', params.id)
        .order('log_date', { ascending: false })

      if (logsError) throw logsError

      setWorkOrder(woData as any)
      setComponents(componentsData as any)
      setProductionLogs(logsData || [])
    } catch (error) {
      console.error('Error fetching work order details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      quality_check: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
    }
    return colors[stage] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading work order details...</div>
      </div>
    )
  }

  if (!workOrder) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-red-600">Work order not found</div>
      </div>
    )
  }

  const progressPercentage = Math.round(
    (workOrder.quantity_produced / workOrder.quantity_ordered) * 100
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/mrp/work-orders')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <div className="p-2 rounded-lg" style={{background: 'linear-gradient(to bottom right, rgb(249 115 22), rgb(234 88 12))'}}>
            <Factory className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{workOrder.wo_number}</h1>
            <p className="text-gray-600">Work Order Details</p>
          </div>
        </div>
        <Link href={`/mrp/work-orders/${workOrder.id}/edit`}>
          <Button>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Work Order
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">WO Number</p>
              <p className="font-semibold">{workOrder.wo_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                  workOrder.status
                )}`}
              >
                {workOrder.status.replace('_', ' ')}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Production Stage</p>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStageColor(
                  workOrder.production_stage
                )}`}
              >
                {workOrder.production_stage.replace('_', ' ')}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Production Date</p>
              <p className="font-semibold">
                {format(new Date(workOrder.production_date), 'MMMM dd, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created At</p>
              <p className="font-semibold">
                {format(new Date(workOrder.created_at), 'MMMM dd, yyyy HH:mm')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Progress</p>
              <Progress value={progressPercentage} className="mb-2" />
              <p className="text-sm font-semibold">
                {workOrder.quantity_produced} / {workOrder.quantity_ordered}{' '}
                {workOrder.finished_good.unit} ({progressPercentage}%)
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quantity Ordered</p>
              <p className="text-2xl font-bold">
                {workOrder.quantity_ordered} {workOrder.finished_good.unit}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quantity Produced</p>
              <p className="text-2xl font-bold text-blue-600">
                {workOrder.quantity_produced} {workOrder.finished_good.unit}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Finished Good</p>
              <p className="font-semibold">{workOrder.finished_good.name}</p>
              <p className="text-sm text-gray-500">
                {workOrder.finished_good.item_code}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">BOM Number</p>
              <p className="font-semibold">{workOrder.bom.bom_number}</p>
            </div>
            {workOrder.notes && (
              <div>
                <p className="text-sm text-gray-600">Notes</p>
                <p className="font-semibold">{workOrder.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Required Components (BOM)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Component Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Qty per Unit</TableHead>
                <TableHead className="text-right">Total Required</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.map((component) => {
                const totalRequired =
                  component.quantity_required * workOrder.quantity_ordered
                return (
                  <TableRow key={component.id}>
                    <TableCell className="font-medium">
                      {component.item.item_code}
                    </TableCell>
                    <TableCell>{component.item.name}</TableCell>
                    <TableCell>{component.item.unit}</TableCell>
                    <TableCell className="text-right">
                      {component.quantity_required}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {totalRequired.toFixed(2)} {component.item.unit}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {productionLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Production History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Quantity Produced</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productionLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.log_date), 'MMMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {log.quantity_produced} {workOrder.finished_good.unit}
                    </TableCell>
                    <TableCell>{log.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
