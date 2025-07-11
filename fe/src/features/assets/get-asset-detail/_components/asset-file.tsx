import { Button } from '@/components'
import { FileText } from 'lucide-react'
import type { AssetsType } from '../../view-all-assets/model'
import { getFileName } from '@/utils'

export const AssetFile = ({ asset }: { asset: AssetsType }) => {
  const handleViewDocument = () => {
    if (asset.fileAttachment) {
      window.open(asset.fileAttachment, '_blank')
    }
  }

  return asset.fileAttachment ? (
    <div className='flex flex-col items-center justify-between gap-5 rounded-md border p-3'>
      <div className='flex items-center'>
        <FileText className='text-primary mr-2 h-5 w-5' />
        <span className='block max-w-[200px] truncate'>{getFileName(asset.fileAttachment)}</span>
      </div>
      <Button
        variant='outline'
        size='sm'
        className='w-full'
        onClick={handleViewDocument}
      >
        View
      </Button>
    </div>
  ) : (
    <div className='flex h-[100px] w-full flex-col items-center justify-center rounded-md border border-dashed'>
      <FileText className='text-muted-foreground h-8 w-8' />
      <p className='text-muted-foreground mt-2 text-sm'>No documents available</p>
    </div>
  )
}
