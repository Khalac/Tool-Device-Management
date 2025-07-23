import { Button, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui'
import { Eye, Edit } from 'lucide-react'
import { BillPrintButton } from '../bill-print-button'
import type { BillType } from '../../model/bill-types'

interface BillActionsCellProps {
  bill: BillType
  onViewBill: (bill: BillType) => void
  onStatusUpdate: (bill: BillType) => void
}

export const BillActionsCell = ({ bill, onViewBill, onStatusUpdate }: BillActionsCellProps) => {
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
              onViewBill(bill)
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
                onClick={() => onStatusUpdate(bill)}
                disabled={isPaid}
                className={`border-primary text-primary hover:text-primary/80 ${
                  isPaid ? 'cursor-not-allowed opacity-50' : ''
                }`}
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
}
