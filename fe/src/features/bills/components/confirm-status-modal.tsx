import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle, Check, Undo } from 'lucide-react'

interface ConfirmStatusModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  billNumber: string
}

export const ConfirmStatusModal = ({ open, onClose, onConfirm, billNumber }: ConfirmStatusModalProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className='mb-2 flex items-center justify-center'>
              <div className='rounded-full border-2 border-amber-200 bg-amber-100 p-3'>
                <AlertCircle className='animate-amber-pulse h-8 w-8 text-amber-500' />
              </div>
            </div>
            <span className='mt-1 block text-center text-xl font-semibold'>Confirm Status Change</span>{' '}
          </DialogTitle>
          <DialogDescription className='mt-2 text-center text-gray-600'>
            Are you sure you want to mark bill #{billNumber} as paid? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='mt-1 flex justify-center gap-2'>
          <Button
            className='border-primary text-primary hover:text-primary/80'
            variant='outline'
            onClick={onClose}
          >
            <Undo className='h-4 w-4' />
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className='bg-primary hover:bg-primary/80 flex items-center gap-1 text-white'
          >
            <Check className='h-4 w-4' />
            Confirm Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
