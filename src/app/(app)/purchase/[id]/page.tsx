'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

const purchaseItemSchema = z.object({
  id: z.string().optional(),
  item_id: z.string().uuid('Select a valid item'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit_price: z.number().min(0, 'Price must be positive'),
})

const purchaseOrderSchema = z.object({
  po_number: z.string().min(1, 'PO number is required'),
  supplier_name: z.string().min(1, 'Supplier name is required'),
  supplier_contact: z.string().optional(),
  order_date: z.string().min(1, 'Order date is required'),
  expected_delivery: z.string().optional(),
  notes: z.string().optional(),
  status: z.string(),
  items: z.array(purchaseItemSchema).min(1, 'Add at least one item'),
})

type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>

interface Item {
  id: string
  item_code: string
  name: string
  unit_price: number
  unit: string
  is_raw_material: boolean
}

export default function EditPurchaseOrderPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      items: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchItems = watch('items')

  useEffect(() => {
    fetchItems()
    fetchPurchaseOrder()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('id, item_code, name, unit_price, unit, is_raw_material')
        .order('name')

      if (error) throw error
      setItems(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch items')
    }
  }

  const fetchPurchaseOrder = async () => {
    try {
      const { data: poData, error: poError } = await supabase
        .from('purchase_orders')
        .select('*')
        .eq('id', params.id)
        .single()

      if (poError) throw poError

      const { data: itemsData, error: itemsError } = await supabase
        .from('purchase_items')
        .select('id, item_id, quantity, unit_price')
        .eq('purchase_order_id', params.id)

      if (itemsError) throw itemsError

      setValue('po_number', poData.po_number)
      setValue('supplier_name', poData.supplier_name)
      setValue('supplier_contact', poData.supplier_contact || '')
      setValue('order_date', poData.order_date)
      setValue('expected_delivery', poData.expected_delivery || '')
      setValue('notes', poData.notes || '')
      setValue('status', poData.status)
      setValue('items', itemsData || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch purchase order')
      toast.error('Failed to load purchase order')
    } finally {
      setFetching(false)
    }
  }

  const handleItemSelect = (index: number, itemId: string) => {
    const selectedItem = items.find((item) => item.id === itemId)
    if (selectedItem) {
      setValue(`items.${index}.unit_price`, selectedItem.unit_price)
    }
  }

  const calculateTotal = () => {
    return watchItems.reduce((total, item) => {
      return total + (item.quantity || 0) * (item.unit_price || 0)
    }, 0)
  }

  const onSubmit = async (data: PurchaseOrderFormData) => {
    setLoading(true)
    setError(null)

    try {
      const totalAmount = calculateTotal()

      // Update purchase order
      const { error: poError } = await supabase
        .from('purchase_orders')
        .update({
          po_number: data.po_number,
          supplier_name: data.supplier_name,
          supplier_contact: data.supplier_contact,
          order_date: data.order_date,
          expected_delivery: data.expected_delivery,
          total_amount: totalAmount,
          notes: data.notes,
        })
        .eq('id', params.id)

      if (poError) throw poError

      // Delete existing purchase items
      const { error: deleteError } = await supabase
        .from('purchase_items')
        .delete()
        .eq('purchase_order_id', params.id)

      if (deleteError) throw deleteError

      // Insert new purchase items
      const purchaseItems = data.items.map((item) => ({
        purchase_order_id: params.id as string,
        item_id: item.item_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }))

      const { error: itemsError } = await supabase
        .from('purchase_items')
        .insert(purchaseItems)

      if (itemsError) throw itemsError

      toast.success('Purchase order updated successfully!')
      router.push('/purchase')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to update purchase order')
      toast.error(err.message || 'Failed to update purchase order')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading purchase order...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{background: 'linear-gradient(to bottom right, rgb(168 85 247), rgb(236 72 153))'}}>
          <ShoppingCart className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Edit Purchase Order</h1>
          <p className="text-gray-600">Update purchase order details</p>
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
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="po_number">PO Number *</Label>
                <Input id="po_number" {...register('po_number')} />
                {errors.po_number && (
                  <p className="text-sm text-red-600">{errors.po_number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier_name">Supplier Name *</Label>
                <Input
                  id="supplier_name"
                  {...register('supplier_name')}
                  placeholder="ABC Supplier Co."
                />
                {errors.supplier_name && (
                  <p className="text-sm text-red-600">{errors.supplier_name.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier_contact">Supplier Contact</Label>
              <Input
                id="supplier_contact"
                {...register('supplier_contact')}
                placeholder="Phone / Email"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order_date">Order Date *</Label>
                <Input id="order_date" type="date" {...register('order_date')} />
                {errors.order_date && (
                  <p className="text-sm text-red-600">{errors.order_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_delivery">Expected Delivery</Label>
                <Input
                  id="expected_delivery"
                  type="date"
                  {...register('expected_delivery')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order Items</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ item_id: '', quantity: 1, unit_price: 0 })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.items && (
              <p className="text-sm text-red-600">{errors.items.message}</p>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-4 md:grid-cols-12 items-start p-4 border rounded-lg"
              >
                <div className="md:col-span-5 space-y-2">
                  <Label>Item *</Label>
                  <select
                    {...register(`items.${index}.item_id`)}
                    onChange={(e) => handleItemSelect(index, e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="">Select item...</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.item_code} - {item.name} ({item.unit})
                      </option>
                    ))}
                  </select>
                  {errors.items?.[index]?.item_id && (
                    <p className="text-sm text-red-600">
                      {errors.items[index]?.item_id?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    min="1"
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="text-sm text-red-600">
                      {errors.items[index]?.quantity?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Unit Price *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register(`items.${index}.unit_price`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.items?.[index]?.unit_price && (
                    <p className="text-sm text-red-600">
                      {errors.items[index]?.unit_price?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Subtotal</Label>
                  <div className="p-2 bg-gray-50 rounded-md text-sm font-medium">
                    $
                    {(
                      (watchItems[index]?.quantity || 0) *
                      (watchItems[index]?.unit_price || 0)
                    ).toFixed(2)}
                  </div>
                </div>

                <div className="md:col-span-1 flex items-end">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-end items-center gap-4">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-purple-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Purchase Order'}
          </Button>
        </div>
      </form>
    </div>
  )
}
