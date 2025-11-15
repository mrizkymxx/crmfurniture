import { z } from 'zod'

export const itemSchema = z.object({
  item_code: z.string().min(1, 'Item code is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  unit: z.string().default('pcs'),
  unit_price: z.number().min(0, 'Price must be positive'),
  current_stock: z.number().int().min(0, 'Stock must be non-negative'),
  min_stock: z.number().int().min(0, 'Min stock must be non-negative'),
  max_stock: z.number().int().min(0, 'Max stock must be non-negative').optional().nullable(),
  is_raw_material: z.boolean().default(false),
  is_finished_good: z.boolean().default(false),
})

export const purchaseOrderSchema = z.object({
  po_number: z.string().min(1, 'PO number is required'),
  supplier_name: z.string().min(1, 'Supplier name is required'),
  supplier_contact: z.string().optional(),
  order_date: z.string(),
  expected_date: z.string().optional(),
  notes: z.string().optional(),
})

export const salesOrderSchema = z.object({
  so_number: z.string().min(1, 'SO number is required'),
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_contact: z.string().optional(),
  customer_address: z.string().optional(),
  order_date: z.string(),
  delivery_date: z.string().optional(),
  notes: z.string().optional(),
})

export const workOrderSchema = z.object({
  wo_number: z.string().min(1, 'WO number is required'),
  item_id: z.string().uuid('Invalid item'),
  quantity_to_produce: z.number().int().min(1, 'Quantity must be at least 1'),
  start_date: z.string().optional(),
  target_date: z.string().optional(),
  notes: z.string().optional(),
})

export const bomSchema = z.object({
  finished_good_id: z.string().uuid('Invalid finished good'),
  raw_material_id: z.string().uuid('Invalid raw material'),
  quantity_required: z.number().min(0.001, 'Quantity must be greater than 0'),
  unit: z.string().optional(),
  notes: z.string().optional(),
})

export type ItemFormData = z.infer<typeof itemSchema>
export type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>
export type SalesOrderFormData = z.infer<typeof salesOrderSchema>
export type WorkOrderFormData = z.infer<typeof workOrderSchema>
export type BOMFormData = z.infer<typeof bomSchema>
