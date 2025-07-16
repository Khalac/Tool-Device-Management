import type { RequestTransferType } from '../../all-request-transfer/model'

export const UserRequestInformation = ({ requestTransfer }: { requestTransfer: RequestTransferType }) => {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <div className='flex flex-col gap-3'>
        <p className='text-muted-foreground text-sm font-medium'>User Name</p>
        <p className='text-sm font-medium'>
          {requestTransfer.user.firstName} {requestTransfer.user.lastName} <p>({requestTransfer.user.email})</p>
        </p>
      </div>
      <div className='flex flex-col gap-3'>
        <p className='text-muted-foreground text-sm font-medium'>Department ID</p>
        <p className='font-medium'>#{requestTransfer.user.departmentId}</p>
      </div>
    </div>
  )
}
