import { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Badge,
} from '@/components/ui'
import { getAllAssets } from '@/features/assets/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBillSchema, type CreateBillFormType } from '../model/create-bill-schema'
import type { BillType } from '../model/bill-types'
import { createBill } from '../api'
import { tryCatch } from '@/utils'
import { toast } from 'sonner'
import {
  Plus,
  Receipt,
  User,
  Phone,
  Mail,
  MapPin,
  File,
  Image,
  X,
  ChevronDown,
  Package,
  ImageIcon,
  FileText,
  CreditCard,
  Paperclip,
  Check,
  Undo,
} from 'lucide-react'
import Cookies from 'js-cookie'

interface CreateBillModalProps {
  onBillCreated: (bill: BillType) => void
}

export const CreateBillModal = ({ onBillCreated }: CreateBillModalProps) => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [assets, setAssets] = useState<any[]>([])
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<{
    fileAttachmentBill?: File
    imageUploadBill?: File
  }>({})

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    clearErrors,
    trigger,
  } = useForm<CreateBillFormType>({
    resolver: zodResolver(createBillSchema),
    defaultValues: {
      statusBill: 'Unpaid',
    },
  })

  const statusOptions = [
    { value: 'Unpaid', label: 'Unpaid' },
    { value: 'Paid', label: 'Paid' },
  ]

  const getCurrentUserId = () => {
    return parseInt(Cookies.get('id') || '1')
  }

  const fetchAssets = async () => {
    setIsLoading(true)
    const response = await tryCatch(getAllAssets())
    if (response.error) {
      toast.error('Failed to fetch assets')
    } else {
      setAssets(response.data?.data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (open) {
      fetchAssets()
    }
  }, [open])

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      reset()
      setSelectedFiles({})
      setSelectedAssets([])
      clearErrors()

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      if (imageInputRef.current) {
        imageInputRef.current.value = ''
      }
    }
  }

  const handleAssetSelect = async (assetId: string) => {
    if (!selectedAssets.includes(assetId)) {
      const newSelectedAssets = [...selectedAssets, assetId]
      setSelectedAssets(newSelectedAssets)

      setValue('assetId', newSelectedAssets)
      clearErrors('assetId')

      await trigger('assetId')
    }
  }

  const handleRemoveAsset = async (assetId: string) => {
    const newSelectedAssets = selectedAssets.filter((id) => id !== assetId)
    setSelectedAssets(newSelectedAssets)

    setValue('assetId', newSelectedAssets)

    if (newSelectedAssets.length > 0) {
      clearErrors('assetId')
    }

    await trigger('assetId')
  }

  const getSelectedAssetDetails = () => {
    return assets.filter((asset) => selectedAssets.includes(asset.id.toString()))
  }

  const getAvailableAssets = () => {
    return assets.filter((asset) => !selectedAssets.includes(asset.id.toString()))
  }

  const getTotalAmount = () => {
    return getSelectedAssetDetails().reduce((total, asset) => {
      return total + (asset?.cost || 0)
    }, 0)
  }

  const getAssetStatusColor = (status: string) => {
    const colors = {
      New: 'bg-green-100 text-green-800',
      'In Use': 'bg-blue-100 text-blue-800',
      'Under Maintenance': 'bg-amber-100 text-amber-800',
      Disposed: 'bg-red-100 text-red-800',
    } as const
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const AssetImage = ({ asset, size = 'sm' }: { asset: any; size?: 'sm' | 'md' }) => {
    const sizeClasses = {
      sm: 'w-6 h-6 object-cover',
      md: 'w-8 h-8 object-cover',
    }

    const imageUrl = asset.imageUpload || asset.fileAttachment

    return (
      <div className={`${sizeClasses[size]} flex-shrink-0 overflow-hidden rounded border bg-gray-100`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={asset.assetName || 'Asset'}
            className='h-full w-full object-cover'
          />
        ) : null}
        <div
          className={`flex h-full w-full items-center justify-center bg-gray-200 ${imageUrl ? 'hidden' : 'flex'}`}
          style={imageUrl ? { display: 'none' } : {}}
        >
          <ImageIcon className='h-4 w-4 text-gray-400' />
        </div>
      </div>
    )
  }

  const handleFileUpload = (field: 'fileAttachmentBill' | 'imageUploadBill', file: File | null) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [field]: file || undefined,
    }))
  }

  const removeFile = (field: 'fileAttachmentBill' | 'imageUploadBill') => {
    setSelectedFiles((prev) => {
      const newFiles = { ...prev }
      delete newFiles[field]
      return newFiles
    })

    if (field === 'fileAttachmentBill' && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (field === 'imageUploadBill' && imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: CreateBillFormType) => {
    console.log('🚀 ~ onSubmit ~ data:', data)
    console.log('🚀 ~ selectedAssets:', selectedAssets)

    if (selectedAssets.length === 0) {
      toast.error('Please select at least one asset')
      return
    }

    setIsSubmitting(true)

    try {
      const currentUserId = getCurrentUserId()
      console.log('🚀 ~ onSubmit ~ currentUserId:', currentUserId)

      const formData = new FormData()

      selectedAssets.forEach((assetId) => {
        formData.append('assetId', assetId)
      })

      formData.append('buyerName', data.buyerName.trim())
      formData.append('buyerPhone', data.buyerPhone.trim())
      formData.append('buyerEmail', data.buyerEmail.trim())
      formData.append('buyerAddress', data.buyerAddress.trim())

      formData.append('description', data.description.trim())
      formData.append('statusBill', data.statusBill)

      if (selectedFiles.fileAttachmentBill) {
        formData.append('file', selectedFiles.fileAttachmentBill)
      }
      if (selectedFiles.imageUploadBill) {
        formData.append('image', selectedFiles.imageUploadBill)
      }

      const response = await tryCatch(createBill(formData))

      if (response.error) {
        toast.error(response.error?.message || 'Failed to create bill')
      } else {
        const newBill: BillType = {
          id: response.data?.data?.id || Date.now(),
          billNumber: response.data?.data?.billNumber || `BILL-${Date.now()}`,
          assetId: selectedAssets.map((id) => parseInt(id)),
          amount: getTotalAmount(),
          description: data.description,
          statusBill: data.statusBill,
          companyId: response.data?.data?.companyId || 1,
          createdBy: response.data?.data?.createdBy || 1,
          createAt: response.data?.data?.createdAt || new Date().toISOString(),
          updateAt: response.data?.data?.updatedAt || new Date().toISOString(),
          fileAttachmentBill: response.data?.data?.fileAttachmentBill,
          imageUploadBill: response.data?.data?.imageUploadBill,
          buyer: {
            buyerName: data.buyerName,
            buyerPhone: data.buyerPhone,
            buyerEmail: data.buyerEmail,
            buyerAddress: data.buyerAddress,
          },
        }

        onBillCreated(newBill)
        setOpen(false)
        toast.success('Bill created successfully')
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
          <Plus className='h-4 w-4' />
          Create Bill
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-primary flex items-center gap-2'>
            <Receipt className='text-primary h-5 w-5' />
            Create New Bill
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <div className='space-y-4'>
            <Label className='flex items-center gap-2 text-base font-medium'>
              <Package className='h-5 w-5' />
              Select Assets *
            </Label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full justify-between'
                  disabled={isLoading || getAvailableAssets().length === 0}
                >
                  <span className='flex items-center gap-2'>
                    <Package className='h-4 w-4' />
                    {isLoading ? 'Loading assets...' : 'Add Asset'}
                  </span>
                  <ChevronDown className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='max-h-60 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto'
                align='start'
                sideOffset={4}
              >
                {getAvailableAssets().length === 0 ? (
                  <DropdownMenuItem disabled>No available assets</DropdownMenuItem>
                ) : (
                  getAvailableAssets().map((asset) => (
                    <DropdownMenuItem
                      key={asset.id}
                      onClick={() => handleAssetSelect(asset.id.toString())}
                      className='flex cursor-pointer items-start gap-3 p-3 hover:bg-gray-50'
                    >
                      <AssetImage
                        asset={asset}
                        size='sm'
                      />

                      <div className='min-w-0 flex-1'>
                        <div className='truncate font-medium'>{asset.assetName}</div>
                        <div className='mt-1 flex items-center gap-2 text-sm text-gray-600'>
                          <div className='truncate text-sm font-medium text-gray-500'>
                            {asset.category?.categoryName}
                          </div>
                          <Badge
                            variant='outline'
                            className={getAssetStatusColor(asset.status)}
                          >
                            {asset.status}
                          </Badge>
                          <span className='text-sm font-medium'>${asset.cost?.toLocaleString()}</span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedAssets.length > 0 && (
              <div className='space-y-3'>
                <div className='grid gap-2'>
                  {getSelectedAssetDetails().map((asset) => (
                    <div
                      key={asset.id}
                      className='dark:bg-background flex items-center gap-3 rounded-lg border bg-gray-50 p-3'
                    >
                      <AssetImage
                        asset={asset}
                        size='md'
                      />

                      <div className='min-w-0 flex-1 dark:text-white'>
                        <div className='truncate font-medium'>{asset.assetName}</div>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                          <Badge
                            variant='outline'
                            className={getAssetStatusColor(asset.status)}
                          >
                            {asset.status}
                          </Badge>
                          <span className='text-sm font-medium dark:text-white'>${asset.cost?.toLocaleString()}</span>
                          <span className='text-sm font-medium dark:text-white'>• {asset.category?.categoryName}</span>
                        </div>
                      </div>

                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => handleRemoveAsset(asset.id.toString())}
                        className='flex-shrink-0 text-red-600 hover:bg-red-50 hover:text-red-800'
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className='rounded-lg bg-blue-50 p-3 dark:bg-blue-950'>
                  <p className='text-sm font-medium'>
                    Selected: {selectedAssets.length} asset{selectedAssets.length > 1 ? 's' : ''}
                  </p>
                  <p className='text-sm font-medium text-gray-600 dark:text-white'>
                    Total Amount: ${getTotalAmount().toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {errors.assetId && <p className='text-sm text-red-600'>{errors.assetId.message}</p>}
          </div>

          <div className='border-t pt-6'>
            <h3 className='mb-4 flex items-center gap-2 text-base font-medium'>
              <User className='h-5 w-5' />
              Buyer Information
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label
                  htmlFor='buyerName'
                  className='flex items-center gap-2'
                >
                  <User className='h-4 w-4' />
                  Buyer Name *
                </Label>
                <Input
                  id='buyerName'
                  {...register('buyerName')}
                  placeholder='Enter buyer name'
                  className={`${errors.buyerName ? 'border-red-500' : ''} text-sm`}
                />
                {errors.buyerName && <p className='text-sm text-red-600'>{errors.buyerName.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='buyerPhone'
                  className='flex items-center gap-2'
                >
                  <Phone className='h-4 w-4' />
                  Phone Number *
                </Label>
                <Input
                  id='buyerPhone'
                  {...register('buyerPhone')}
                  placeholder='Enter phone number'
                  className={`${errors.buyerPhone ? 'border-red-500' : ''} text-sm`}
                />
                {errors.buyerPhone && <p className='text-sm text-red-600'>{errors.buyerPhone.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='buyerEmail'
                  className='flex items-center gap-2'
                >
                  <Mail className='h-4 w-4' />
                  Email Address *
                </Label>
                <Input
                  id='buyerEmail'
                  type='email'
                  {...register('buyerEmail')}
                  placeholder='Enter email address'
                  className={`${errors.buyerEmail ? 'border-red-500' : ''} text-sm`}
                />
                {errors.buyerEmail && <p className='text-sm text-red-600'>{errors.buyerEmail.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='buyerAddress'
                  className='flex items-center gap-2'
                >
                  <MapPin className='h-4 w-4' />
                  Address *
                </Label>
                <Input
                  id='buyerAddress'
                  {...register('buyerAddress')}
                  placeholder='Enter full address'
                  className={`${errors.buyerAddress ? 'border-red-500' : ''} overflow-x-auto text-sm`}
                  style={{ textOverflow: 'ellipsis' }}
                />
                {errors.buyerAddress && <p className='text-sm text-red-600'>{errors.buyerAddress.message}</p>}
              </div>
            </div>
          </div>

          <div className='border-t pt-6'>
            <h3 className='mb-4 flex items-center gap-2 text-base font-medium'>
              <FileText className='h-5 w-5' />
              Bill Details
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label
                  htmlFor='description'
                  className='flex items-center gap-2'
                >
                  <FileText className='h-4 w-4' />
                  Description *
                </Label>
                <Input
                  id='description'
                  {...register('description')}
                  placeholder='Enter bill description'
                  className={`${errors.description ? 'border-red-500' : ''} overflow-x-auto text-sm`}
                  style={{ textOverflow: 'ellipsis' }}
                />
                {errors.description && <p className='text-sm text-red-600'>{errors.description.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='statusBill'
                  className='flex items-center gap-2'
                >
                  <CreditCard className='h-4 w-4' />
                  Payment Status
                </Label>
                <Select
                  onValueChange={(value) => setValue('statusBill', value as 'Unpaid' | 'Paid')}
                  defaultValue='Unpaid'
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    {statusOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className='w-full'
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className='border-t pt-6'>
            <h3 className='mb-4 flex items-center gap-2 text-base font-semibold'>
              <Paperclip className='h-5 w-5' />
              Attachments
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label className='flex items-center gap-2'>
                  <File className='h-4 w-4' />
                  File Attachment
                </Label>
                <div className='flex items-center gap-2'>
                  <Input
                    type='file'
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload('fileAttachmentBill', e.target.files?.[0] || null)}
                    className='flex-1 cursor-pointer text-sm'
                    accept='.pdf,.doc,.docx,.txt'
                  />
                  {selectedFiles.fileAttachmentBill && (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => removeFile('fileAttachmentBill')}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
                {selectedFiles.fileAttachmentBill && (
                  <p className='truncate text-sm text-green-600'>Selected: {selectedFiles.fileAttachmentBill.name}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label className='flex items-center gap-2'>
                  <Image className='h-4 w-4' />
                  Image Upload
                </Label>
                <div className='flex items-center gap-2'>
                  <Input
                    type='file'
                    ref={imageInputRef}
                    onChange={(e) => handleFileUpload('imageUploadBill', e.target.files?.[0] || null)}
                    className='flex-1 cursor-pointer text-sm'
                    accept='image/*'
                  />
                  {selectedFiles.imageUploadBill && (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => removeFile('imageUploadBill')}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
                {selectedFiles.imageUploadBill && (
                  <p className='truncate text-sm text-green-600'>Selected: {selectedFiles.imageUploadBill.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex justify-end gap-3 border-t pt-6'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancel}
              disabled={isSubmitting}
              className='border-primary text-primary hover:text-primary/80 flex h-9 items-center justify-center gap-2 text-sm font-medium'
            >
              <Undo className='h-4 w-4' />
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='bg-primary text-primary-foreground hover:bg-primary/90'
            >
              <Check className='h-4 w-4' />
              {isSubmitting ? 'Creating...' : 'Create Bill'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
