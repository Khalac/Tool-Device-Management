import { Button } from '@/components'
import { Loader2, X } from 'lucide-react'

export const ButtonRejectRequest = ({
  isProcessing,
  handleReject,
}: {
  isProcessing: boolean
  handleReject: () => void
}) => {
  return (
    <Button
      variant='outline'
      className='border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500'
      onClick={handleReject}
      disabled={isProcessing}
    >
      {isProcessing ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <X className='mr-1 h-4 w-4' />}
      Reject Request
    </Button>
  )
}
