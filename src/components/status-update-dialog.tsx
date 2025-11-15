'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface StatusUpdateDialogProps {
  orderId: string
  orderNumber: string
  currentStatus: string
  orderType: 'purchase' | 'sales'
  onSuccess: () => void
}

export function StatusUpdateDialog({
  orderId,
  orderNumber,
  currentStatus,
  orderType,
  onSuccess,
}: StatusUpdateDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newStatus, setNewStatus] = useState(currentStatus)
  const supabase = createClient()

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'approved', label: 'Approved', color: 'blue' },
    { value: 'processing', label: 'Processing', color: 'purple' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
  ]

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const table = orderType === 'purchase' ? 'purchase_orders' : 'sales_orders'
      
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      toast.success(`${orderType === 'purchase' ? 'Purchase' : 'Sales'} order status updated to ${newStatus}`)
      setOpen(false)
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:text-blue-700"
      >
        Update Status
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Update the status of {orderType === 'purchase' ? 'Purchase Order' : 'Sales Order'} {orderNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Status</Label>
              <div className="p-2 bg-gray-100 rounded-md capitalize">
                {currentStatus}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-2">Status Flow:</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>Pending:</strong> Awaiting approval</li>
                <li>• <strong>Approved:</strong> Confirmed and ready</li>
                <li>• <strong>Processing:</strong> In progress</li>
                <li>• <strong>Completed:</strong> Finished</li>
                <li>• <strong>Cancelled:</strong> Order cancelled</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading || newStatus === currentStatus}>
              {loading ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
