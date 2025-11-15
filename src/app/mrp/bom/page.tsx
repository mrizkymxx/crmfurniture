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

interface BOM {
  id: string
  finished_good_id: string
  raw_material_id: string
  quantity_required: number
  unit: string | null
  finished_good: {
    name: string
    item_code: string
  }
  raw_material: {
    name: string
    item_code: string
  }
}

export default function BOMPage() {
  const [boms, setBoms] = useState<BOM[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchBOMs()
  }, [])

  const fetchBOMs = async () => {
    try {
      const { data, error } = await supabase
        .from('bom')
        .select(`
          *,
          finished_good:finished_good_id(name, item_code),
          raw_material:raw_material_id(name, item_code)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBoms(data as any || [])
    } catch (error) {
      console.error('Error fetching BOMs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this BOM entry?')) return

    try {
      const { error } = await supabase.from('bom').delete().eq('id', id)
      if (error) throw error
      fetchBOMs()
    } catch (error) {
      console.error('Error deleting BOM:', error)
      alert('Failed to delete BOM entry')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bill of Materials (BOM)</h1>
          <p className="text-gray-600">Define product structures and material requirements</p>
        </div>
        <Link href="/mrp/bom/new">
          <Button>+ Add BOM Entry</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : boms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No BOM entries found. Create your first BOM to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Finished Good</TableHead>
                  <TableHead>Raw Material</TableHead>
                  <TableHead>Quantity Required</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boms.map((bom) => (
                  <TableRow key={bom.id}>
                    <TableCell className="font-medium">
                      {bom.finished_good?.name} ({bom.finished_good?.item_code})
                    </TableCell>
                    <TableCell>
                      {bom.raw_material?.name} ({bom.raw_material?.item_code})
                    </TableCell>
                    <TableCell>
                      {bom.quantity_required} {bom.unit || 'units'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/mrp/bom/${bom.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(bom.id)}
                        >
                          Delete
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
