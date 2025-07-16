import type { RequestTransferType } from '../../all-request-transfer/model'

export const AssetCategoryRequestInformation = ({ requestTransfer }: { requestTransfer: RequestTransferType }) => {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <div>
        <p className='text-muted-foreground text-sm font-medium'>Category Name</p>
        <p className='mt-1 font-medium'>{requestTransfer.category.categoryName}</p>
      </div>
      <div>
        <p className='text-muted-foreground text-sm font-medium'>Category ID</p>
        <p className='mt-1 font-medium'>#{requestTransfer.category.id}</p>
      </div>
    </div>
  )
}
