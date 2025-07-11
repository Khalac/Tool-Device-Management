import { Laptop, Calendar, DollarSign, Tag, Building, User, Clock, FileText } from 'lucide-react'
import type { AssetsType } from '../../view-all-assets/model'
import { format } from 'date-fns'
import { Button } from '@/components'
export const AssetInformation = ({ asset }: { asset: AssetsType }) => {
  const handleViewDocument = () => {
    if (asset.fileAttachment) {
      window.open(asset.fileAttachment, '_blank')
    }
  }

  return (
    <div className='grid grid-cols-1 gap-y-6 sm:grid-cols-2'>
      <div className='space-y-1'>
        <h3 className='text-muted-foreground text-sm font-medium'>Asset Type</h3>
        <p className='flex items-center font-medium'>
          <Laptop className='text-primary mr-2 h-4 w-4' />
          {asset.category?.categoryName}
        </p>
      </div>

      <div className='space-y-1'>
        <h3 className='text-muted-foreground text-sm font-medium'>Serial Number</h3>
        <p className='flex items-center font-medium'>
          <Tag className='text-primary mr-2 h-4 w-4' />
          {asset.serialNumber}
        </p>
      </div>

      <div className='space-y-1'>
        <h3 className='text-muted-foreground text-sm font-medium'>Purchase Date</h3>
        <p className='flex items-center font-medium'>
          <Calendar className='text-primary mr-2 h-4 w-4' />
          {format(new Date(asset.purchaseDate), 'PPP')}
        </p>
      </div>

      <div className='space-y-1'>
        <h3 className='text-muted-foreground text-sm font-medium'>Warranty Expiry</h3>
        <p className='flex items-center font-medium'>
          <Clock className='text-primary mr-2 h-4 w-4' />
          {format(new Date(asset.warrantExpiry), 'PPP')}
        </p>
      </div>

      <div className='space-y-1'>
        <h3 className='text-muted-foreground text-sm font-medium'>Department</h3>
        <p className='flex items-center font-medium'>
          <Building className='text-primary mr-2 h-4 w-4' />
          {asset.department?.departmentName}
        </p>
      </div>

      <div className='space-y-1'>
        <h3 className='text-muted-foreground text-sm font-medium'>Cost</h3>
        <p className='flex items-center font-medium'>
          <DollarSign className='text-primary mr-2 h-4 w-4' />
          {asset.cost}
        </p>
      </div>

      <div className='flex h-30 flex-col justify-between space-y-1'>
        <div>
          <h3 className='text-muted-foreground text-sm font-medium'>Owner</h3>
          <p className='flex items-center font-medium'>
            <User className='text-primary mr-2 h-4 w-4' />
            {asset.owner?.firstName + ' ' + asset.owner?.lastName}
          </p>
        </div>

        <div>
          <h3 className='text-muted-foreground pb-1 text-sm font-medium'>Documents</h3>
          {asset.fileAttachment ? (
            <Button
              variant='outline'
              size='sm'
              onClick={handleViewDocument}
              className='w-fit'
            >
              <FileText className='mr-1 h-4 w-4' />
              View Documents
            </Button>
          ) : (
            <p className='text-muted-foreground text-sm'>No documents available</p>
          )}
        </div>
      </div>

      <div className='h-20 space-y-1'>
        <h3 className='text-muted-foreground text-sm font-medium'>QR Code</h3>
        <div className='h-16 w-16'>
          {asset.qrUrl ? (
            <img
              src={asset.qrUrl}
              alt={asset.assetName}
              className='h-full w-full rounded-md object-contain'
            />
          ) : (
            <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-dashed'>
              <span className='text-muted-foreground text-xs'>No QR</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
