import { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/data-table-component'
import { ConfirmStatusModal } from '../confirm-status-modal'
import { updateBillStatus } from '../../api'
import { createBillColumns } from './table-column-definitions'
import { formatDate, formatCurrency, getBuyerName, getAssetCount, getAssetCost } from './table-utils'
import type { BillType } from '../../model/bill-types'

interface BillsTableProps {
  bills: BillType[]
  onViewBill: (bill: BillType) => void
  isLoading: boolean
  onStatusChange?: (updatedBillNumber: string, billId: number, newStatus: 'Unpaid' | 'Paid') => void
}

export const BillsTable = ({ bills, isLoading, onStatusChange }: BillsTableProps) => {
  const navigate = useNavigate()
  const [selectedBill, setSelectedBill] = useState<BillType | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  console.log('🚀 ~ BillsTable ~ updatingStatus:', updatingStatus)

  const handleViewBill = (bill: BillType) => {
    navigate(`/bills/${bill.billNumber}`)
  }

  const handleStatusUpdate = async () => {
    if (!selectedBill) return

    if (selectedBill.statusBill === 'Paid') {
      toast.error('Cannot update status of paid bills')
      setShowConfirmModal(false)
      setSelectedBill(null)
      return
    }

    setUpdatingStatus(true)
    try {
      await updateBillStatus(selectedBill.billNumber, 'Paid')
      toast.success(`Bill #${selectedBill.billNumber} has been marked as paid`)
      onStatusChange?.(selectedBill.billNumber, selectedBill.id, 'Paid')
    } catch (error) {
      toast.error('Failed to update bill status')
      console.error('Error updating bill status:', error)
    } finally {
      setUpdatingStatus(false)
      setShowConfirmModal(false)
      setSelectedBill(null)
    }
  }

  const onStatusUpdate = (bill: BillType) => {
    setSelectedBill(bill)
    setShowConfirmModal(true)
  }

  const columns = createBillColumns({
    formatDate,
    formatCurrency,
    getBuyerName,
    getAssetCount,
    getAssetCost,
    handleViewBill,
    onStatusUpdate,
  })

  return (
    <div className='rounded-md border'>
      <DataTable
        columns={columns}
        data={bills || []}
        isLoading={isLoading}
        emptyMessage='Try adjusting your filters to see more results.'
      />
      <ConfirmStatusModal
        open={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false)
          setSelectedBill(null)
        }}
        onConfirm={handleStatusUpdate}
        billNumber={selectedBill?.billNumber || ''}
      />
    </div>
  )
}
