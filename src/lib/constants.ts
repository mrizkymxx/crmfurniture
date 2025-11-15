export const ORDER_STATUSES = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export const MOVEMENT_TYPES = {
  IN: 'in',
  OUT: 'out',
  ADJUSTMENT: 'adjustment',
} as const

export const PRODUCTION_STAGES = {
  ASSEMBLING: 'assembling',
  FINISHING: 'finishing',
  PACKING: 'packing',
  COMPLETED: 'completed',
} as const

export const SHIPPING_STATUSES = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
} as const

export const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
} as const

export const CATEGORIES = [
  'Raw Materials',
  'Finished Goods',
  'Work in Progress',
  'Packaging',
  'Supplies',
  'Tools',
] as const

export const UNITS = [
  'pcs',
  'kg',
  'lbs',
  'm',
  'ft',
  'liters',
  'gallons',
  'box',
  'pallet',
] as const
