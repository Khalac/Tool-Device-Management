import { Trash2, Undo, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  DialogClose,
} from '@/components/ui'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  itemName?: string
  isLoading?: boolean
}

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Delete Asset',
  description,
  itemName,
  isLoading = false,
}: ConfirmDeleteModalProps) => {
  const defaultDescription = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : 'Are you sure you want to delete this item? This action cannot be undone.'

  const finalDescription = description || defaultDescription

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent
        className='sm:max-w-md'
        showCloseButton={false}
      >
        <DialogClose className='ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none'>
          <X className='h-4 w-4 cursor-pointer border-none' />
          <span className='sr-only'>Close</span>
        </DialogClose>
        <DialogHeader className='text-center'>
          <div className='mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 dark:bg-red-500/30'>
              <Trash2 className='animate-shake-trash h-5 w-5 text-red-600 dark:text-red-400' />
            </div>
          </div>

          <DialogTitle className='text-center text-xl font-semibold text-gray-900 dark:text-gray-100'>
            {title}
          </DialogTitle>

          <DialogDescription className='text-center text-gray-600 dark:text-gray-300'>
            {finalDescription}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='flex gap-3 sm:gap-3'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
            className='border-primary text-primary hover:text-primary/80 flex-1 sm:flex-initial'
          >
            <Undo className='text-primary h-4 w-4' />
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            disabled={isLoading}
            className='flex-1 sm:flex-initial'
          >
            {isLoading ? (
              <>
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className='mr-0 h-4 w-4' />
                Delete Asset
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
