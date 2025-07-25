import { Button } from '@/components'
import { Undo } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const ButtonCancel = ({ isPending }: { isPending: boolean; Icon: React.ReactNode }) => {
  const navigate = useNavigate()
  return (
    <Button
      className='border-primary text-primary hover:text-primary/80'
      variant='outline'
      onClick={() => navigate(-1)}
      disabled={isPending}
    >
      <Undo className='h-4 w-4' />
      Cancel
    </Button>
  )
}
