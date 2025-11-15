'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'

const salesItemSchema = z.object({
  item_id: z.string().uuid('Select a valid item'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit_price: z.number().min(0, 'Price must be positive'),
})

const salesOrderSchema = z.object({
  so_number: z.string().min(1, 'SO number is required'),
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_contact: z.string().optional(),
  customer_address: z.string().optional(),
  order_date: z.string().min(1, 'Order date is required'),
  delivery_date: z.string().optional(),
  shipping_address: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(salesItemSchema).min(1, 'Add at least one item'),
})

type SalesOrderFormData = z.infer<typeof salesOrderSchema>

interface Item {
  id: string
  item_code: string
  name: string
  unit_price: number
  unit: string
  current_stock: number
  is_finished_good: boolean
}

export default function NewSalesOrderPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SalesOrderFormData>({
    resolver: zodResolver(salesOrderSchema),
    defaultValues: {
      so_number: `SO-${Date.now().toString().slice(-8)}`,
      order_date: new Date().toISOString().split('T')[0],
      items: [{ item_id: '', quantity: 1, unit_price: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchItems = watch('items')

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('id, item_code, name, unit_price, unit, current_stock, is_finished_good')
        .order('name')

      if (error) throw error
      setItems(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch items')
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

  const onSubmit = async (data: SalesOrderFormData) => {
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // Validate stock availability
      for (const item of data.items) {
        const selectedItem = items.find((i) => i.id === item.item_id)
        if (selectedItem && selectedItem.current_stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${selectedItem.name}. Available: ${selectedItem.current_stock}, Requested: ${item.quantity}`
          )
        }
      }

      // Calculate total
      const totalAmount = calculateTotal()

      // Insert sales order
      const { data: soData, error: soError } = await supabase
        .from('sales_orders')
        .insert({
          so_number: data.so_number,
          customer_name: data.customer_name,
          customer_contact: data.customer_contact,
          customer_address: data.customer_address,
          order_date: data.order_date,
          delivery_date: data.delivery_date,
          shipping_address: data.shipping_address,
          total_amount: totalAmount,
          status: 'pending',
          notes: data.notes,
          created_by: user.id,
        })
        .select()
        .single()

      if (soError) throw soError

      // Insert sales items
      const salesItems = data.items.map((item) => ({
        sales_order_id: soData.id,
        item_id: item.item_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }))

      const { error: itemsError } = await supabase
        .from('sales_items')
        .insert(salesItems)

      if (itemsError) throw itemsError

      toast.success('Sales order created successfully!')
      router.push('/sales')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to create sales order')
      toast.error(err.message || 'Failed to create sales order')
    } finally {
      setLoading(false)
    }
  }

  const getAvailableStock = (itemId: string) => {
    const item = items.find((i) => i.id === itemId)
    return item ? item.current_stock : 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{background: 'linear-gradient(to bottom right, rgb(34 197 94), rgb(16 185 129))'}}>
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Create Sales Order</h1>
          <p className="text-gray-600">Record customer orders and sales</p>
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
                <Label htmlFor="so_number">SO Number *</Label>
                <Input id="so_number" {...register('so_number')} />
                {errors.so_number && (
                  <p className="text-sm text-red-600">{errors.so_number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_name">Customer Name *</Label>
                <Input
                  id="customer_name"
                  {...register('customer_name')}
                  placeholder="John Doe"
                />
                {errors.customer_name && (
                  <p className="text-sm text-red-600">{errors.customer_name.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer_contact">Customer Contact</Label>
                <Input
                  id="customer_contact"
                  {...register('customer_contact')}
                  placeholder="Phone / Email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_address">Customer Address</Label>
                <Input
                  id="customer_address"
                  {...register('customer_address')}
                  placeholder="Full address"
                />
              </div>
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
                <Label htmlFor="delivery_date">Delivery Date</Label>
                <Input
                  id="delivery_date"
                  type="date"
                  {...register('delivery_date')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipping_address">Shipping Address</Label>
              <Textarea
                id="shipping_address"
                {...register('shipping_address')}
                placeholder="Delivery address if different from customer address..."
                rows={2}
              />
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

            {fields.map((field, index) => {
              const selectedItemId = watchItems[index]?.item_id
              const availableStock = getAvailableStock(selectedItemId)

              return (
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
                          {item.item_code} - {item.name} (Stock: {item.current_stock} {item.unit})
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
                      max={availableStock}
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                    {availableStock > 0 && (
                      <p className="text-xs text-gray-500">
                        Available: {availableStock}
                      </p>
                    )}
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
              )
            })}

            <div className="border-t pt-4">
              <div className="flex justify-end items-center gap-4">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">
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
            {loading ? 'Creating...' : 'Create Sales Order'}
          </Button>
        </div>
      </form>
    </div>
  )
}
