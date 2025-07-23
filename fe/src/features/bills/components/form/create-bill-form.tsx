import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Label } from '@/components/ui'
import { Package, Check, Undo } from 'lucide-react'
import { getAllAssets } from '@/features/assets/api'
import { createBill } from '../../api'
import { createBillSchema, type CreateBillFormType } from '../../model/create-bill-schema'
import type { BillType } from '../../model/bill-types'
import { tryCatch } from '@/utils'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

import { AssetSelectorDropdown } from './asset-selector-dropdown'
import { SelectedAssetsDisplay } from './selected-assets-display'
import { BuyerInformationSection } from './buyer-information-section'
import { BillDetailsSection } from './bill-details-section'
import { BillAttachmentsSection } from './bill-attachments-section'

interface CreateBillFormProps {
  onBillCreated: (bill: BillType) => void
  onCancel: () => void
}

export const CreateBillForm = ({ onBillCreated, onCancel }: CreateBillFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [assets, setAssets] = useState<any[]>([])
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<{
    fileAttachmentBill?: File
    imageUploadBill?: File
  }>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    trigger,
  } = useForm<CreateBillFormType>({
    resolver: zodResolver(createBillSchema),
    defaultValues: {
      statusBill: 'Unpaid',
    },
  })

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
    fetchAssets()
  }, [])

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
  }

  const getSelectedAssetDetails = () => {
    return assets.filter((asset) => selectedAssets.includes(asset.id.toString()))
  }

  const getTotalAmount = () => {
    return getSelectedAssetDetails().reduce((total, asset) => total + (asset?.cost || 0), 0)
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
        toast.success('Bill created successfully')
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6'
    >
      <div className='space-y-4'>
        <Label className='flex items-center gap-2 text-base font-medium'>
          <Package className='h-5 w-5' />
          Select Assets *
        </Label>

        <AssetSelectorDropdown
          assets={assets}
          selectedAssets={selectedAssets}
          isLoading={isLoading}
          onAssetSelect={handleAssetSelect}
        />

        <SelectedAssetsDisplay
          assets={assets}
          selectedAssets={selectedAssets}
          onRemoveAsset={handleRemoveAsset}
        />

        {errors.assetId && <p className='text-sm text-red-600'>{errors.assetId.message}</p>}
      </div>

      <BuyerInformationSection
        register={register}
        errors={errors}
      />

      <BillDetailsSection
        register={register}
        errors={errors}
        setValue={setValue}
      />

      <BillAttachmentsSection
        selectedFiles={selectedFiles}
        onFileUpload={handleFileUpload}
        onRemoveFile={removeFile}
      />

      <div className='flex justify-end gap-3 border-t pt-6'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
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
  )
}
