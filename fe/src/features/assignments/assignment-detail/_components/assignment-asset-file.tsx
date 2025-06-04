import type { AssignmentData } from '../../get-all-assignments/model'
import { Button } from '@/components/ui'
import { Download } from 'lucide-react'
import { Link } from 'react-router-dom'

export const AssignmentAssetFile = ({ assignmentDetail }: { assignmentDetail: AssignmentData }) => {
  return (
    <div className='col-span-1 space-y-2 md:col-span-2'>
      <p className='text-muted-foreground text-sm'>Attachments</p>
      <Link
        to={assignmentDetail.asset.fileAttachment}
        download={true}
        className='w-full'
      >
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='flex items-center gap-2'
        >
          <Download className='h-4 w-4' />
          Download Attachment
        </Button>
      </Link>
    </div>
  )
}
