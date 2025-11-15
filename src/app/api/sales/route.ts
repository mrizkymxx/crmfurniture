import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  const supabase = await createClient()

  try {
    if (id) {
      const { data, error } = await supabase
        .from('sales_orders')
        .select(`
          *,
          sales_items(
            *,
            item:item_id(*)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('sales_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { items, ...orderData } = body

  try {
    // Insert sales order
    const { data: order, error: orderError } = await supabase
      .from('sales_orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) throw orderError

    // Insert sales items if provided
    if (items && items.length > 0) {
      const itemsWithOrderId = items.map((item: any) => ({
        ...item,
        sales_order_id: order.id,
      }))

      const { error: itemsError } = await supabase
        .from('sales_items')
        .insert(itemsWithOrderId)

      if (itemsError) throw itemsError
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { id, ...updates } = body

  try {
    const { data, error } = await supabase
      .from('sales_orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
