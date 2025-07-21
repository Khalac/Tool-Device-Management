import type { AssignmentData } from '../../get-all-assignments/model'
import { Button } from '@/components/ui'
import { Download } from 'lucide-react'
import { forceDownloadFile, extractFilename } from '@/utils/download-file'
export const AssignmentAssetFile = ({ assignmentDetail }: { assignmentDetail: AssignmentData }) => {
  const handleDownload = async () => {
    if (assignmentDetail.asset.fileAttachment) {
      const filename = extractFilename(assignmentDetail.asset.fileAttachment)
      await forceDownloadFile(assignmentDetail.asset.fileAttachment, filename)
    }
  }

  return (
    <div className='col-span-1 space-y-2 md:col-span-2'>
      <p className='text-muted-foreground text-sm'>Attachments</p>
      <Button
        type='button'
        variant='outline'
        size='sm'
        className='flex items-center gap-2'
        onClick={handleDownload}
      >
        <Download className='h-4 w-4' />
        Download Attachment
      </Button>
    </div>
  )
}
