import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Badge } from '@/components/ui'
import { ArrowLeft, User, FileText, Loader2, Box } from 'lucide-react'
import type { RequestTransferType } from '../all-request-transfer/model/type'
import { toast } from 'sonner'
import { getData, tryCatch } from '@/utils'
import { approveRequestTransfer, denyRequestTransfer, getRequestTransferInformation } from '../api'
import type { ApproveFormValues } from './dialog-select-asset/model'
import {
  AssetCategoryRequestInformation,
  ButtonApproveRequest,
  ButtonRejectRequest,
  ComponentGetInformationError,
  RequestDescription,
  UserRequestInformation,
} from './_components'
import { DialogSelectAsset } from './dialog-select-asset'

const RequestTransferInformation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [requestTransfer, setTransferRequest] = useState<RequestTransferType>()
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getTransferRequestData = async () => {
    setIsLoading(true)
    await getData(() => getRequestTransferInformation(id || ''), setTransferRequest)
    setIsLoading(false)
  }

  useEffect(() => {
    getTransferRequestData()
  }, [id])

  const handleReject = async () => {
    setIsProcessing(true)
    const data = await tryCatch(denyRequestTransfer(id || ''))
    if (data.error) {
      toast.error(data.error.message || 'Failed to deny transfer request')
      setIsProcessing(false)
      return
    }
    toast.success(`Transfer request #${id} has been denied`)
    getTransferRequestData()
    setIsProcessing(false)
  }

  const handleApprove = async (values: ApproveFormValues) => {
    setIsProcessing(true)
    const data = await tryCatch(approveRequestTransfer(values.assetId, id || ''))
    if (data.error) {
      toast.error(data.error.message || 'Failed to approve transfer request')
      setIsDialogOpen(false)
      setIsProcessing(false)
      return
    }
    toast.success(`Transfer request #${id} has been approved`)
    getTransferRequestData()
    setIsDialogOpen(false)
    setIsProcessing(false)
  }

  if (isLoading) {
    return (
      <div className='flex h-[70vh] items-center justify-center'>
        <Loader2 className='text-primary h-12 w-12 animate-spin' />
      </div>
    )
  }

  if (!requestTransfer) {
    return <ComponentGetInformationError />
  }

  return (
    <div className='container mx-auto max-w-2xl px-4 py-2'>
      <DialogSelectAsset
        categoryId={requestTransfer.category.id.toString()}
        departmentId={requestTransfer.user.departmentId.toString()}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        handleApprove={handleApprove}
        isProcessing={isProcessing}
      />

      <div className='mb-4 flex items-center justify-between'>
        <Button
          variant='link'
          onClick={() => navigate('/transfers')}
          className='text-muted-foreground px-0'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Requests
        </Button>
        <div className='flex items-center gap-3 text-sm'>
          <span className='text-black'>Request ID:</span>
          <span className='text-primary font-medium'>#{id}</span>
          <Badge
            variant='outline'
            className='border-yellow-400 bg-yellow-100 text-yellow-700'
          >
            {requestTransfer.status}
          </Badge>
        </div>
      </div>

      <Card className='gap-2 shadow-sm'>
        <CardHeader>
          <CardTitle className='flex items-center text-xl'>
            <FileText className='mr-2 h-5 w-5' /> Transfer Request Details
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='bg-muted/20 mt-0 rounded-md border p-4'>
            <h3 className='text-muted-foreground text-primary mb-2 flex items-center text-base font-semibold'>
              <User className='text-primary mr-2 h-4 w-4' />
              Requester Information
            </h3>
            <UserRequestInformation requestTransfer={requestTransfer} />
          </div>

          <div className='bg-muted/20 rounded-md border p-4'>
            <h3 className='text-muted-foreground text-primary mb-2 flex items-center text-base font-semibold'>
              <Box className='text-primary mr-2 h-4 w-4' />
              Category
            </h3>
            <AssetCategoryRequestInformation requestTransfer={requestTransfer} />
          </div>

          <div className='bg-muted/20 rounded-md border p-4'>
            <h3 className='text-muted-foreground text-primary mb-2 flex items-center text-base font-semibold'>
              <FileText className='text-primary mr-2 h-4 w-4' />
              Request Details
            </h3>
            <RequestDescription requestTransfer={requestTransfer} />
          </div>
        </CardContent>

        <CardFooter className='pt-3'>
          {requestTransfer.status === 'Pending' ? (
            <div className='grid w-full grid-cols-2 gap-3'>
              <div className='justify-self-start'>
                <ButtonApproveRequest
                  isProcessing={isProcessing}
                  openApprovalDialog={() => setIsDialogOpen(true)}
                />
              </div>

              <div className='justify-self-end'>
                <ButtonRejectRequest
                  isProcessing={isProcessing}
                  handleReject={handleReject}
                />
              </div>
            </div>
          ) : (
            <div className='flex w-full justify-end'>
              <Button
                variant='outline'
                onClick={() => navigate('/transfers')}
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to All Requests
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default RequestTransferInformation
