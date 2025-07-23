import { Button, CardTitle, CardDescription } from '@/components/ui'
import { Receipt, Download } from 'lucide-react'
import { CreateBillModal } from '../create-bill-modal'
import type { BillType } from '../../model/bill-types'

interface BillsHeaderProps {
  billsCount: number
  onExport: () => void
  onBillCreated: (newBill: BillType) => void
}

export const BillsHeader = ({ billsCount, onExport, onBillCreated }: BillsHeaderProps) => {
  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <CardTitle className='text-primary flex items-center text-2xl font-bold'>
          <Receipt
            strokeWidth={2.5}
            className='text-primary mr-2 h-5 w-5'
          />
          Bills Management
        </CardTitle>
        <CardDescription className='text-primary'>Manage and track all bills for your assets</CardDescription>
      </div>
      <div className='flex gap-2'>
        <Button
          variant='outline'
          onClick={onExport}
          className='text-primary border-primary hover:bg-primary/10 hover:text-primary flex items-center gap-2'
          disabled={billsCount === 0}
        >
          <Download className='text-primary h-4 w-4' />
          Export Report
        </Button>
        <CreateBillModal onBillCreated={onBillCreated} />
      </div>
    </div>
  )
}
