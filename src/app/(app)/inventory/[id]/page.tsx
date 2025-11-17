'use client'

import { useEffect, useState } from 'react'
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
import { UploadButton } from '@/components/upload-button'

const itemSchema = z.object({
  item_code: z.string().min(1, 'Item code is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  unit: z.string().min(1, 'Unit is required'),
  unit_price: z.number().min(0, 'Price must be positive'),
  current_stock: z.number().int().min(0, 'Stock must be non-negative'),
  min_stock: z.number().int().min(0, 'Min stock must be non-negative'),
  max_stock: z.number().int().min(0, 'Max stock must be non-negative').optional().nullable(),
  is_raw_material: z.boolean(),
  is_finished_good: z.boolean(),
})

type ItemFormData = z.infer<typeof itemSchema>

export default function EditItemPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      unit: 'pcs',
      is_raw_material: false,
      is_finished_good: false,
    }
  })

  useEffect(() => {
    fetchItem()
  }, [params.id])

  const fetchItem = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      if (data) {
        setValue('item_code', data.item_code)
        setValue('name', data.name)
        setValue('description', data.description || '')
        setValue('category', data.category || '')
        setValue('unit', data.unit)
        setValue('unit_price', data.unit_price)
        setValue('current_stock', data.current_stock)
        setValue('min_stock', data.min_stock)
        setValue('max_stock', data.max_stock)
        setValue('is_raw_material', data.is_raw_material)
        setValue('is_finished_good', data.is_finished_good)
        setImageUrl(data.image_url)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch item')
    } finally {
      setFetching(false)
    }
  }

  const onSubmit = async (data: ItemFormData) => {
    setLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('items')
        .update({
          ...data,
          image_url: imageUrl,
        })
        .eq('id', params.id)

      if (updateError) throw updateError

      router.push('/inventory')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to update item')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading item...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Item</h1>
        <p className="text-gray-600">Update inventory item details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="item_code">Item Code *</Label>
                <Input
                  id="item_code"
                  {...register('item_code')}
                  placeholder="ITM-001"
                />
                {errors.item_code && (
                  <p className="text-sm text-red-600">{errors.item_code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Item name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Item description..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  {...register('category')}
                  placeholder="e.g., Raw Materials, Finished Goods"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  {...register('unit')}
                  placeholder="pcs, kg, m, etc."
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="unit_price">Unit Price *</Label>
                <Input
                  id="unit_price"
                  type="number"
                  step="0.01"
                  {...register('unit_price', { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.unit_price && (
                  <p className="text-sm text-red-600">{errors.unit_price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_stock">Current Stock *</Label>
                <Input
                  id="current_stock"
                  type="number"
                  {...register('current_stock', { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.current_stock && (
                  <p className="text-sm text-red-600">{errors.current_stock.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_stock">Min Stock *</Label>
                <Input
                  id="min_stock"
                  type="number"
                  {...register('min_stock', { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.min_stock && (
                  <p className="text-sm text-red-600">{errors.min_stock.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_stock">Max Stock</Label>
              <Input
                id="max_stock"
                type="number"
                {...register('max_stock', { valueAsNumber: true })}
                placeholder="Optional"
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_raw_material"
                  {...register('is_raw_material')}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_raw_material">Raw Material</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_finished_good"
                  {...register('is_finished_good')}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_finished_good">Finished Good</Label>
              </div>
            </div>

            <div className="border-t pt-4">
              <UploadButton
                bucket="inventory"
                onUploadComplete={setImageUrl}
                onUploadError={(err) => setError(err)}
                accept="image/*"
                label="Upload Item Image"
              />
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-32 w-32 rounded object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Item'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
