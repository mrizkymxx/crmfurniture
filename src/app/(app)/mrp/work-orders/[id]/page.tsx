'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Factory, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const workOrderSchema = z.object({
  wo_number: z.string().min(1, 'WO number is required'),
  item_id: z.string().uuid('Select a valid item'),
  quantity_to_produce: z.number().min(1, 'Quantity must be at least 1'),
  quantity_produced: z.number().min(0, 'Quantity produced must be non-negative'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  status: z.string(),
  production_stage: z.string(),
  notes: z.string().optional(),
})

type WorkOrderFormData = z.infer<typeof workOrderSchema>

interface Item {
  id: string
  item_code: string
  name: string
  unit: string
  is_finished_good: boolean
}

export default function EditWorkOrderPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [finishedGoods, setFinishedGoods] = useState<Item[]>([])
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
  })

  const watchQuantityProduced = watch('quantity_produced')
  const watchQuantityToProduce = watch('quantity_to_produce')

  useEffect(() => {
    fetchFinishedGoods()
    fetchWorkOrder()
  }, [])

  const fetchFinishedGoods = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('id, item_code, name, unit, is_finished_good')
        .eq('is_finished_good', true)
        .order('name')

      if (error) throw error
      setFinishedGoods(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch finished goods')
    }
  }

  const fetchWorkOrder = async () => {
    try {
      const { data: woData, error: woError } = await supabase
        .from('work_orders')
        .select('*')
        .eq('id', params.id)
        .single()

      if (woError) throw woError

      setValue('wo_number', woData.wo_number)
      setValue('item_id', woData.item_id)
      setValue('quantity_to_produce', woData.quantity_to_produce)
      setValue('quantity_produced', woData.quantity_produced || 0)
      setValue('start_date', woData.start_date)
      setValue('end_date', woData.end_date || '')
      setValue('status', woData.status)
      setValue('production_stage', woData.production_stage)
      setValue('notes', woData.notes || '')
    } catch (err: any) {
      setError(err.message || 'Failed to fetch work order')
      toast.error('Failed to load work order')
    } finally {
      setFetching(false)
    }
  }

  const onSubmit = async (data: WorkOrderFormData) => {
    setLoading(true)
    setError(null)

    try {
      // Update work order
      const { error: woError } = await supabase
        .from('work_orders')
        .update({
          wo_number: data.wo_number,
          item_id: data.item_id,
          quantity_to_produce: data.quantity_to_produce,
          quantity_produced: data.quantity_produced,
          start_date: data.start_date,
          end_date: data.end_date,
          status: data.status,
          production_stage: data.production_stage,
          notes: data.notes,
        })
        .eq('id', params.id)

      if (woError) throw woError

      toast.success('Work order updated successfully!')
      router.push('/mrp/work-orders')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to update work order')
      toast.error(err.message || 'Failed to update work order')
    } finally {
      setLoading(false)
    }
  }

  const progressPercentage = watchQuantityToProduce > 0
    ? Math.round((watchQuantityProduced / watchQuantityToProduce) * 100)
    : 0

  if (fetching) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading work order...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{background: 'linear-gradient(to bottom right, rgb(249 115 22), rgb(234 88 12))'}}>
          <Factory className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Edit Work Order</h1>
          <p className="text-gray-600">Update work order details and track production</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Work Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="wo_number">WO Number *</Label>
                <Input id="wo_number" {...register('wo_number')} />
                {errors.wo_number && (
                  <p className="text-sm text-red-600">{errors.wo_number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="item_id">Item to Produce *</Label>
                <select
                  id="item_id"
                  {...register('item_id')}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select finished good...</option>
                  {finishedGoods.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.item_code} - {item.name} ({item.unit})
                    </option>
                  ))}
                </select>
                {errors.item_id && (
                  <p className="text-sm text-red-600">{errors.item_id.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quantity_to_produce">Quantity to Produce *</Label>
                <Input
                  id="quantity_to_produce"
                  type="number"
                  min="1"
                  {...register('quantity_to_produce', { valueAsNumber: true })}
                />
                {errors.quantity_to_produce && (
                  <p className="text-sm text-red-600">
                    {errors.quantity_to_produce.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity_produced">Quantity Produced *</Label>
                <Input
                  id="quantity_produced"
                  type="number"
                  min="0"
                  {...register('quantity_produced', { valueAsNumber: true })}
                />
                {errors.quantity_produced && (
                  <p className="text-sm text-red-600">
                    {errors.quantity_produced.message}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-900">
                  Production Progress
                </span>
                <span className="text-sm font-bold text-blue-900">
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  {...register('status')}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="production_stage">Production Stage *</Label>
                <select
                  id="production_stage"
                  {...register('production_stage')}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="quality_check">Quality Check</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input id="start_date" type="date" {...register('start_date')} />
                {errors.start_date && (
                  <p className="text-sm text-red-600">{errors.start_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input id="end_date" type="date" {...register('end_date')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Production notes..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                Production Stages
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Planning:</strong> Material allocation & preparation</li>
                <li>• <strong>In Progress:</strong> Active production work</li>
                <li>• <strong>Quality Check:</strong> Inspection & verification</li>
                <li>• <strong>Completed:</strong> Ready for inventory</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Work Order'}
          </Button>
        </div>
      </form>
    </div>
  )
}
