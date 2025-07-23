import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Button } from '@/components/ui'
import { Plus, Receipt } from 'lucide-react'
import { CreateBillForm } from './form/create-bill-form'
import type { BillType } from '../model/bill-types'

interface CreateBillModalProps {
  onBillCreated: (bill: BillType) => void
}

export const CreateBillModal = ({ onBillCreated }: CreateBillModalProps) => {
  const [open, setOpen] = useState(false)

  const handleBillCreated = (bill: BillType) => {
    onBillCreated(bill)
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
          <Plus className='h-4 w-4' />
          Create Bill
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-primary flex items-center gap-2'>
            <Receipt className='text-primary h-5 w-5' />
            Create New Bill
          </DialogTitle>
        </DialogHeader>

        <CreateBillForm
          onBillCreated={handleBillCreated}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
