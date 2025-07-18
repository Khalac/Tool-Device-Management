import { Eye, Calendar, Edit } from 'lucide-react'
import { Button, Badge, TooltipTrigger, TooltipContent, Tooltip } from '@/components/ui'
import { DataTable } from '@/components/ui/data-table-component'
import type { BillType } from '../model/bill-types'
import { toast } from 'sonner'
import { BillPrintLayout } from './bill-print-layout'
import { renderToString } from 'react-dom/server'
import { BillPrintButton } from './bill-print-button'
import { ConfirmStatusModal } from './confirm-status-modal'
import { useState } from 'react'
import { updateBillStatus } from '../api'
import { useNavigate } from 'react-router-dom'

interface BillsTableProps {
  bills: BillType[]
  onViewBill: (bill: BillType) => void
  isLoading: boolean
  onStatusChange?: (updatedBillNumber: string, billId: number, newStatus: 'Unpaid' | 'Paid') => void
}

export const BillsTable = ({ bills, isLoading, onStatusChange }: BillsTableProps) => {
  const navigate = useNavigate()
  const handleViewBill = (bill: BillType) => {
    navigate(`/bills/${bill.billNumber}`)
  }
  const [selectedBill, setSelectedBill] = useState<BillType | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  console.log('🚀 ~ BillsTable ~ updatingStatus:', updatingStatus)
  const handlePrintBill = (bill: BillType) => {
    try {
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Bill ${bill.billNumber}</title>
            <meta charset="UTF-8">
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @media print {
                .no-print { display: none !important; }
                body { margin: 0; padding: 0; }
              }
            </style>
          </head>
          <body>
            ${renderToString(<BillPrintLayout bill={bill} />)}
          </body>
        </html>
      `

      const newWindow = window.open('', '_blank')
      if (newWindow) {
        newWindow.document.write(printContent)
        newWindow.document.close()

        setTimeout(() => {
          newWindow.print()
        }, 500)

        toast.success('Print window opened')
      } else {
        toast.error('Please allow popups for printing')
      }
    } catch (error) {
      console.error('Print error:', error)
      toast.error('Print failed')
    }
  }
  console.log('🚀 ~ handlePrintBill ~ handlePrintBill:', handlePrintBill)

  const toggleBillStatus = (bill: BillType) => {
    const newStatus = bill.statusBill === 'Paid' ? 'Unpaid' : 'Paid'
    if (onStatusChange) {
      console.log(`Updating bill ${bill.id} from ${bill.statusBill} to ${newStatus}`)
      onStatusChange(bill.billNumber, bill.id, newStatus)
      toast.success(`Bill ${bill.billNumber || `BILL-${bill.id}`} marked as ${newStatus}`)
    }
  }
  console.log('🚀 ~ toggleBillStatus ~ toggleBillStatus:', toggleBillStatus)

  const getStatusBadge = (statusBill: string) => {
    const statusConfig = {
      Unpaid: {
        color: 'bg-red-100 text-red-800',
      },
      Paid: {
        color: 'bg-green-100 text-green-800',
      },
    } as const

    const config = statusConfig[statusBill as keyof typeof statusConfig] || statusConfig.Unpaid

    return (
      <Badge
        className={config.color}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {statusBill || 'Unpaid'}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) {
        return new Date().toLocaleDateString()
      }
      return new Date(dateString).toLocaleDateString()
    } catch {
      return new Date().toLocaleDateString()
    }
  }

  const formatCurrency = (amount: number) => {
    try {
      return `$${(amount || 0).toLocaleString()}`
    } catch {
      return '$0'
    }
  }

  const getAssetName = (bill: BillType) => {
    if (bill.assets?.assetName) {
      return bill.assets.assetName
    }
    return 'Unknown Asset'
  }

  const getCategoryName = (bill: BillType) => {
    if (bill.assets?.category?.categoryName) {
      return bill.assets.category.categoryName
    }
    return 'No Category'
  }

  const getAssetCost = (bill: BillType) => {
    if (bill.assets?.cost !== undefined && bill.assets.cost !== null) {
      return bill.assets.cost
    }
    return bill.amount || 0
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
  const columns = [
    {
      accessorKey: 'billNumber',
      header: 'Bill Number',
      cell: ({ row }: any) => <div className='font-medium'>{row.original.billNumber || `BILL-${row.original.id}`}</div>,
    },
    {
      accessorKey: 'assets.assetName',
      header: 'Asset Name',
      cell: ({ row }: any) => (
        <div
          className='max-w-[150px] truncate font-medium'
          title={getAssetName(row.original)}
        >
          {getAssetName(row.original)}
        </div>
      ),
    },
    {
      accessorKey: 'assets.category.categoryName',
      header: 'Category',
      cell: ({ row }: any) => <Badge variant='outline'>{getCategoryName(row.original)}</Badge>,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }: any) => (
        <div
          className='w-[100px] truncate'
          title={row.original.description}
        >
          {row.original.description || 'No description'}
        </div>
      ),
    },
    {
      accessorKey: 'assets.cost',
      header: 'Cost',
      cell: ({ row }: any) => (
        <div className='font-semibold text-green-600'>{formatCurrency(getAssetCost(row.original))}</div>
      ),
    },
    {
      accessorKey: 'statusBill',
      header: 'Status',
      cell: ({ row }: any) => getStatusBadge(row.original.statusBill),
    },
    {
      accessorKey: 'createAt',
      header: 'Created Date',
      cell: ({ row }: any) => (
        <div className='flex items-center gap-1 text-sm dark:text-white'>
          <Calendar className='h-3 w-3' />
          {formatDate(row.original.createAt)}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => {
        const bill = row.original
        const isPaid = bill.statusBill === 'Paid'

        return (
          <div className='flex items-center gap-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className='border-primary text-primary hover:text-primary/80'
                  variant='outline'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewBill(bill)
                  }}
                >
                  <Eye className='text-primary h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>
                <p>View details</p>
              </TooltipContent>
            </Tooltip>

            <div
              className='group relative'
              title={isPaid ? 'Bills that have been paid cannot be updated' : ''}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='inline-block'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        setSelectedBill(bill)
                        setShowConfirmModal(true)
                      }}
                      disabled={isPaid}
                      className={`border-primary text-primary hover:text-primary/80 ${isPaid ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <Edit className='text-primary h-4 w-4' />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  <p>Update status</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <BillPrintButton bill={bill} />
          </div>
        )
      },
    },
  ]

  return (
    <div className='rounded-md border'>
      <DataTable
        columns={columns}
        data={bills || []}
        isLoading={isLoading}
        emptyMessage='No bills found. Create your first bill to get started.'
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
