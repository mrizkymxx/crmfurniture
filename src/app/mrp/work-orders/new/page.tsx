'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
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

interface BOMItem {
  raw_material_id: string
  quantity_required: number
  raw_material: {
    item_code: string
    name: string
    unit: string
    current_stock: number
  }
}

export default function NewWorkOrderPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [finishedGoods, setFinishedGoods] = useState<Item[]>([])
  const [bomItems, setBomItems] = useState<BOMItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loadingBOM, setLoadingBOM] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      wo_number: `WO-${Date.now().toString().slice(-8)}`,
      start_date: new Date().toISOString().split('T')[0],
      quantity_to_produce: 1,
    },
  })

  const watchItemId = watch('item_id')
  const watchQuantity = watch('quantity_to_produce')

  useEffect(() => {
    fetchFinishedGoods()
  }, [])

  useEffect(() => {
    if (watchItemId) {
      fetchBOM(watchItemId)
    } else {
      setBomItems([])
    }
  }, [watchItemId])

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

  const fetchBOM = async (itemId: string) => {
    setLoadingBOM(true)
    try {
      const { data, error } = await supabase
        .from('bom')
        .select(
          `
          raw_material_id,
          quantity_required,
          raw_material:items!bom_raw_material_id_fkey (
            item_code,
            name,
            unit,
            current_stock
          )
        `
        )
        .eq('finished_good_id', itemId)

      if (error) throw error

      if (!data || data.length === 0) {
        setError('No BOM found for this item. Please create a BOM first.')
        setBomItems([])
      } else {
        setError(null)
        setBomItems(data as any)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch BOM')
      setBomItems([])
    } finally {
      setLoadingBOM(false)
    }
  }

  const validateMaterialAvailability = () => {
    const insufficient: string[] = []

    bomItems.forEach((bom) => {
      const required = bom.quantity_required * (watchQuantity || 0)
      if (bom.raw_material.current_stock < required) {
        insufficient.push(
          `${bom.raw_material.name}: Need ${required}, Have ${bom.raw_material.current_stock}`
        )
      }
    })

    return insufficient
  }

  const onSubmit = async (data: WorkOrderFormData) => {
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // Validate BOM exists
      if (bomItems.length === 0) {
        throw new Error('Cannot create work order without BOM. Please create BOM first.')
      }

      // Validate material availability
      const insufficient = validateMaterialAvailability()
      if (insufficient.length > 0) {
        throw new Error(
          `Insufficient materials:\n${insufficient.join('\n')}`
        )
      }

      // Insert work order
      const { data: woData, error: woError } = await supabase
        .from('work_orders')
        .insert({
          wo_number: data.wo_number,
          item_id: data.item_id,
          quantity_to_produce: data.quantity_to_produce,
          quantity_produced: 0,
          start_date: data.start_date,
          end_date: data.end_date,
          status: 'pending',
          production_stage: 'planning',
          notes: data.notes,
          created_by: user.id,
        })
        .select()
        .single()

      if (woError) throw woError

      // Create initial production log
      const { error: logError } = await supabase
        .from('production_logs')
        .insert({
          work_order_id: woData.id,
          stage: 'planning',
          quantity_completed: 0,
          notes: 'Work order created',
          logged_by: user.id,
        })

      if (logError) throw logError

      // Reserve materials (create stock movements with negative quantity)
      const stockMovements = bomItems.map((bom) => ({
        item_id: bom.raw_material_id,
        quantity: -(bom.quantity_required * data.quantity_to_produce),
        movement_type: 'production_use' as const,
        reference_id: woData.id,
        notes: `Reserved for ${data.wo_number}`,
        created_by: user.id,
      }))

      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert(stockMovements)

      if (movementError) throw movementError

      // Update item stocks
      for (const bom of bomItems) {
        const newStock =
          bom.raw_material.current_stock -
          bom.quantity_required * data.quantity_to_produce

        const { error: updateError } = await supabase
          .from('items')
          .update({ current_stock: newStock })
          .eq('id', bom.raw_material_id)

        if (updateError) throw updateError
      }

      toast.success('Work order created successfully!')
      router.push('/mrp/work-orders')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to create work order')
      toast.error(err.message || 'Failed to create work order')
    } finally {
      setLoading(false)
    }
  }

  const selectedItem = finishedGoods.find((item) => item.id === watchItemId)
  const insufficient = validateMaterialAvailability()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{background: 'linear-gradient(to bottom right, rgb(249 115 22), rgb(234 88 12))'}}>
          <Factory className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Create Work Order</h1>
          <p className="text-gray-600">Schedule production and manage manufacturing</p>
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input id="start_date" type="date" {...register('start_date')} />
                {errors.start_date && (
                  <p className="text-sm text-red-600">{errors.start_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Target End Date</Label>
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

        {selectedItem && (
          <Card>
            <CardHeader>
              <CardTitle>Material Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingBOM ? (
                <div className="text-center py-4 text-gray-500">
                  Loading BOM...
                </div>
              ) : bomItems.length > 0 ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Material</th>
                          <th className="text-right py-2">Req/Unit</th>
                          <th className="text-right py-2">Total Needed</th>
                          <th className="text-right py-2">Available</th>
                          <th className="text-right py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bomItems.map((bom) => {
                          const required =
                            bom.quantity_required * (watchQuantity || 0)
                          const available = bom.raw_material.current_stock
                          const sufficient = available >= required

                          return (
                            <tr key={bom.raw_material_id} className="border-b">
                              <td className="py-2">
                                <div>
                                  <div className="font-medium">
                                    {bom.raw_material.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {bom.raw_material.item_code}
                                  </div>
                                </div>
                              </td>
                              <td className="text-right">
                                {bom.quantity_required} {bom.raw_material.unit}
                              </td>
                              <td className="text-right font-medium">
                                {required} {bom.raw_material.unit}
                              </td>
                              <td className="text-right">
                                {available} {bom.raw_material.unit}
                              </td>
                              <td className="text-right">
                                {sufficient ? (
                                  <span className="text-green-600 font-medium">
                                    ✓ OK
                                  </span>
                                ) : (
                                  <span className="text-red-600 font-medium">
                                    ✗ Short
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {insufficient.length > 0 && (
                    <div className="rounded-md bg-red-50 border border-red-200 p-4">
                      <div className="flex gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                        <div>
                          <h4 className="font-semibold text-red-900">
                            Insufficient Materials
                          </h4>
                          <ul className="text-sm text-red-700 mt-2 space-y-1">
                            {insufficient.map((msg, idx) => (
                              <li key={idx}>• {msg}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No BOM defined for this item. Please create a BOM first.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            🏭 Work Order Process
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Materials will be reserved from inventory when created</li>
            <li>• Production stages: Planning → In Progress → Quality Check → Completed</li>
            <li>• Track progress with production logs</li>
            <li>• Finished goods added to inventory upon completion</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || bomItems.length === 0 || insufficient.length > 0}
          >
            {loading ? 'Creating...' : 'Create Work Order'}
          </Button>
        </div>
      </form>
    </div>
  )
}
