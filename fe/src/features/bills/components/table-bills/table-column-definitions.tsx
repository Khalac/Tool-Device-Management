import { Calendar } from 'lucide-react'
import { Badge } from '@/components/ui'
import { BillStatusBadge } from './bill-status-badge'
import { BillActionsCell } from './bill-actions-cell'
import type { BillType } from '../../model/bill-types'

interface ColumnHelpers {
  formatDate: (dateString: string) => string
  formatCurrency: (amount: number) => string
  getBuyerName: (bill: BillType) => string
  getAssetCount: (bill: BillType) => number
  getAssetCost: (bill: BillType) => number
  handleViewBill: (bill: BillType) => void
  onStatusUpdate: (bill: BillType) => void
}

export const createBillColumns = ({
  formatDate,
  formatCurrency,
  getBuyerName,
  getAssetCount,
  getAssetCost,
  handleViewBill,
  onStatusUpdate,
}: ColumnHelpers) => [
  {
    accessorKey: 'billNumber',
    header: 'Bill Number',
    cell: ({ row }: any) => <div className='font-medium'>{row.original.billNumber || `BILL-${row.original.id}`}</div>,
  },
  {
    accessorKey: 'assets.buyerName',
    header: 'Buyer Name',
    cell: ({ row }: any) => (
      <div
        className='max-w-[150px] truncate font-medium'
        title={getBuyerName(row.original)}
      >
        {getBuyerName(row.original)}
      </div>
    ),
  },
  {
    accessorKey: 'assets.totalCount',
    header: 'Total Count',
    cell: ({ row }: any) => {
      const count = getAssetCount(row.original)
      return (
        <Badge
          variant='outline'
          className='border-none text-sm'
        >
          {count} {count === 1 ? 'Asset' : 'Assets'}
        </Badge>
      )
    },
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
    cell: ({ row }: any) => <BillStatusBadge status={row.original.statusBill} />,
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
    cell: ({ row }: any) => (
      <BillActionsCell
        bill={row.original}
        onViewBill={handleViewBill}
        onStatusUpdate={onStatusUpdate}
      />
    ),
  },
]
