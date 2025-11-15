import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Calculate material requirements for a work order
export async function POST(request: Request) {
  const supabase = await createClient()
  const { item_id, quantity } = await request.json()

  try {
    // Get BOM for the item
    const { data: bom, error: bomError } = await supabase
      .from('bom')
      .select(`
        *,
        raw_material:raw_material_id(*)
      `)
      .eq('finished_good_id', item_id)

    if (bomError) throw bomError

    if (!bom || bom.length === 0) {
      return NextResponse.json(
        { error: 'No BOM found for this item' },
        { status: 404 }
      )
    }

    // Calculate requirements
    const requirements = bom.map((bomItem: any) => ({
      raw_material: bomItem.raw_material,
      required_quantity: bomItem.quantity_required * quantity,
      unit: bomItem.unit,
      current_stock: bomItem.raw_material.current_stock,
      shortage:
        bomItem.raw_material.current_stock < bomItem.quantity_required * quantity
          ? bomItem.quantity_required * quantity - bomItem.raw_material.current_stock
          : 0,
    }))

    return NextResponse.json({ requirements })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
