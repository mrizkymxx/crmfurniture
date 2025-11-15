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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, FileText } from 'lucide-react'
import { toast } from 'sonner'

const bomItemSchema = z.object({
  raw_material_id: z.string().uuid('Select a valid raw material'),
  quantity_required: z.number().min(0.01, 'Quantity must be positive'),
})

const bomSchema = z.object({
  finished_good_id: z.string().uuid('Select a finished good'),
  materials: z.array(bomItemSchema).min(1, 'Add at least one raw material'),
})

type BOMFormData = z.infer<typeof bomSchema>

interface Item {
  id: string
  item_code: string
  name: string
  unit: string
  is_raw_material: boolean
  is_finished_good: boolean
}

export default function NewBOMPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [finishedGoods, setFinishedGoods] = useState<Item[]>([])
  const [rawMaterials, setRawMaterials] = useState<Item[]>([])
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BOMFormData>({
    resolver: zodResolver(bomSchema),
    defaultValues: {
      finished_good_id: '',
      materials: [{ raw_material_id: '', quantity_required: 1 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'materials',
  })

  const watchFinishedGood = watch('finished_good_id')

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('id, item_code, name, unit, is_raw_material, is_finished_good')
        .order('name')

      if (error) throw error

      const items = data || []
      setFinishedGoods(items.filter((item) => item.is_finished_good))
      setRawMaterials(items.filter((item) => item.is_raw_material))
    } catch (err: any) {
      setError(err.message || 'Failed to fetch items')
    }
  }

  const onSubmit = async (data: BOMFormData) => {
    setLoading(true)
    setError(null)

    try {
      // Validate that finished good is not in raw materials
      const hasFinishedGoodInMaterials = data.materials.some(
        (material) => material.raw_material_id === data.finished_good_id
      )

      if (hasFinishedGoodInMaterials) {
        throw new Error('A finished good cannot be its own raw material')
      }

      // Check for existing BOM
      const { data: existingBOM } = await supabase
        .from('bom')
        .select('id')
        .eq('finished_good_id', data.finished_good_id)

      if (existingBOM && existingBOM.length > 0) {
        throw new Error('BOM already exists for this finished good. Please edit the existing one.')
      }

      // Insert BOM entries
      const bomEntries = data.materials.map((material) => ({
        finished_good_id: data.finished_good_id,
        raw_material_id: material.raw_material_id,
        quantity_required: material.quantity_required,
      }))

      const { error: bomError } = await supabase.from('bom').insert(bomEntries)

      if (bomError) throw bomError

      toast.success('BOM created successfully!')
      router.push('/mrp/bom')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to create BOM')
      toast.error(err.message || 'Failed to create BOM')
    } finally {
      setLoading(false)
    }
  }

  const getItemInfo = (itemId: string, itemList: Item[]) => {
    const item = itemList.find((i) => i.id === itemId)
    return item ? `${item.item_code} - ${item.name} (${item.unit})` : ''
  }

  const selectedFinishedGood = finishedGoods.find(
    (item) => item.id === watchFinishedGood
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{background: 'linear-gradient(to bottom right, rgb(59 130 246), rgb(147 51 234))'}}>
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Create Bill of Materials</h1>
          <p className="text-gray-600">Define raw materials needed for production</p>
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
            <CardTitle>Finished Good</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="finished_good_id">Select Finished Good *</Label>
              <select
                id="finished_good_id"
                {...register('finished_good_id')}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">Choose finished good...</option>
                {finishedGoods.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.item_code} - {item.name} ({item.unit})
                  </option>
                ))}
              </select>
              {errors.finished_good_id && (
                <p className="text-sm text-red-600">
                  {errors.finished_good_id.message}
                </p>
              )}
            </div>

            {selectedFinishedGood && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Selected: {selectedFinishedGood.name}
                </h3>
                <p className="text-sm text-blue-700">
                  Unit: {selectedFinishedGood.unit}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Raw Materials Required</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ raw_material_id: '', quantity_required: 1 })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.materials && (
              <p className="text-sm text-red-600">{errors.materials.message}</p>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-4 md:grid-cols-12 items-start p-4 border rounded-lg"
              >
                <div className="md:col-span-8 space-y-2">
                  <Label>Raw Material *</Label>
                  <select
                    {...register(`materials.${index}.raw_material_id`)}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="">Select raw material...</option>
                    {rawMaterials
                      .filter((item) => item.id !== watchFinishedGood)
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.item_code} - {item.name} ({item.unit})
                        </option>
                      ))}
                  </select>
                  {errors.materials?.[index]?.raw_material_id && (
                    <p className="text-sm text-red-600">
                      {errors.materials[index]?.raw_material_id?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-3 space-y-2">
                  <Label>Quantity Required *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    {...register(`materials.${index}.quantity_required`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.materials?.[index]?.quantity_required && (
                    <p className="text-sm text-red-600">
                      {errors.materials[index]?.quantity_required?.message}
                    </p>
                  )}
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

            {fields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No raw materials added yet. Click "Add Material" to get started.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">
            📋 BOM Definition Guide
          </h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Select one finished good that will be produced</li>
            <li>
              • Add all raw materials needed to produce 1 unit of the finished good
            </li>
            <li>
              • Specify the exact quantity of each raw material required
            </li>
            <li>• Example: 1 Chair needs 4 Legs + 1 Seat + 2 Armrests</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create BOM'}
          </Button>
        </div>
      </form>
    </div>
  )
}
