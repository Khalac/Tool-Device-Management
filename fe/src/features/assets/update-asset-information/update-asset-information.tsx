import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Form,
  FormInput,
  FormSelect,
  FormDatePicker,
  FormButtonSubmit,
} from '@/components/ui'
import { Save, DollarSign, Settings, Image, FileText, Undo } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { getData, tryCatch, urlToFile } from '@/utils'
import { getAssetInformation, getAllCategories, getAllDepartment, updateAssetInformation } from '../api'
import type { AssetsType } from '../view-all-assets/model/type'
import {
  type CategoryType,
  type CreateAssetFormType,
  type DepartmentType,
  createAssetFormSchema,
} from '../create-new-asset'
import { STATUS } from './data/status'
import { FieldFile, FieldImage, IsError, IsGettingData } from './_components'

const UpdateAssetInformation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const [isGetDataPending, setIsGetDataPending] = useState<boolean>(false)
  const [asset, setAsset] = useState<AssetsType>()
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [departments, setDepartments] = useState<DepartmentType[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fileAttachmentName, setFileAttachmentName] = useState<string | null>(null)

  const form = useForm({
    resolver: zodResolver(createAssetFormSchema),
    defaultValues: {
      assetName: '',
      serialNumber: '',
      status: '',
      categoryId: '',
      departmentId: '',
      purchaseDate: undefined,
      cost: 0,
      warrantExpiry: undefined,
      image: '',
      file: '',
    },
    mode: 'onChange',
  })

  const getAssetData = async () => {
    setIsGetDataPending(true)
    if (!id) return
    const data = await getData(() => getAssetInformation(id), setAsset)
    if (data?.imageUpload) {
      setImagePreview(data.imageUpload)
    }
    if (data?.fileAttachment) {
      setFileAttachmentName(data.fileAttachment)
    }
    await getData(getAllCategories, setCategories)
    await getData(getAllDepartment, setDepartments)
    setIsGetDataPending(false)
  }
  useEffect(() => {
    getAssetData()
  }, [id])
  useEffect(() => {
    if (!asset) return
    form.reset({
      assetName: asset?.assetName,
      serialNumber: asset?.serialNumber,
      status: asset?.status,
      categoryId: asset?.category?.id?.toString(),
      departmentId: asset?.department?.id?.toString(),
      purchaseDate: asset?.purchaseDate ? new Date(asset?.purchaseDate) : undefined,
      cost: asset?.cost ? asset?.cost : 0,
      warrantExpiry: asset?.warrantExpiry ? new Date(asset?.warrantExpiry) : undefined,
      image: asset?.imageUpload ? asset?.imageUpload : '',
      file: asset?.fileAttachment ? asset?.fileAttachment : '',
    })
  }, [asset])

  const onSubmit = async (values: CreateAssetFormType) => {
    setIsPending(true)
    if (typeof values.image === 'string') {
      const image = await urlToFile(values.image)
      values.image = image
    }
    if (typeof values.file === 'string') {
      const file = await urlToFile(values.file)
      values.file = file
    }
    const purchaseDate = new Date(values.purchaseDate.getTime() + 25200000)
    const warrantExpiry = new Date(values.warrantExpiry.getTime() + 25200000)

    const { error } = await tryCatch(updateAssetInformation(id || '', { ...values, purchaseDate, warrantExpiry }))

    if (error) {
      toast.error(error?.message || 'Failed to update asset')
      return
    }
    toast.success('Asset updated successfully')
    navigate(`/assets/${id}`)
    setIsPending(false)
  }

  const handlePurchaseDateChange = (value: Date) => {
    form.setValue('purchaseDate', value)
    const endDate = form.getValues('warrantExpiry')

    if (endDate) {
      form.trigger('warrantExpiry')
    } else {
      form.clearErrors('warrantExpiry')
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  if (isGetDataPending) {
    return <IsGettingData />
  }

  if (!asset) {
    return <IsError id={id || ' '} />
  }

  return (
    <div className='container mx-auto w-5/9 px-4'>
      <FormProvider {...form}>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center text-xl'>
              <Settings className='mr-2 h-5 w-5' />
              Update Asset Information
            </CardTitle>
            <CardDescription>Update all asset details and information</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='space-y-4'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center'>
                        <FileText className='mr-2 h-5 w-5' />
                        Basic Information
                      </CardTitle>
                      <CardDescription>Update the primary details of this asset</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4 lg:grid-cols-2'>
                          <FormInput
                            name='assetName'
                            type='text'
                            label='Asset Name'
                            placeholder='Enter asset name'
                          />
                          <FormInput
                            name='serialNumber'
                            type='text'
                            label='Serial Number'
                            placeholder='Enter serial number'
                          />
                        </div>

                        <div className='update-asset-information group grid grid-cols-1 gap-4 lg:grid-cols-3'>
                          <FormSelect
                            name='categoryId'
                            label='Category'
                            placeholder='Select category'
                            data={categories}
                          />
                          <FormSelect
                            name='departmentId'
                            label='Department'
                            placeholder='Select department'
                            data={departments}
                          />
                          <FormSelect
                            name='status'
                            label='Status'
                            placeholder='Select status'
                            data={STATUS}
                          />
                        </div>

                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                          <FormInput
                            name='cost'
                            type='number'
                            label='Cost'
                            placeholder='Enter asset cost'
                            Icon={DollarSign}
                          />
                          <FormDatePicker
                            name='purchaseDate'
                            label='Purchase Date'
                            fn={handlePurchaseDateChange}
                          />
                          <FormDatePicker
                            name='warrantExpiry'
                            label='Warranty Expiry'
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center'>
                          <Image className='mr-2 h-5 w-5' />
                          Asset Image
                        </CardTitle>
                        <CardDescription>Upload an image of this asset</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <FieldImage
                          setImagePreview={setImagePreview}
                          imagePreview={imagePreview || ''}
                          form={form}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center'>
                          <FileText className='mr-2 h-5 w-5' />
                          Attachments
                        </CardTitle>
                        <CardDescription>Add documentation for this asset</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <FieldFile
                          form={form}
                          fileAttachmentName={fileAttachmentName || ''}
                          setFileAttachmentName={setFileAttachmentName}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div className='mt-2 flex justify-between'>
                    <FormButtonSubmit
                      onSubmit={onSubmit}
                      className='bg-primary hover:bg-primary/90 flex h-8 items-center justify-center gap-2 text-sm font-medium'
                      isPending={isPending}
                      Icon={Save}
                      type='Save Changes'
                    />

                    <Button
                      type='button'
                      variant='outline'
                      onClick={handleCancel}
                      className='flex h-8 items-center justify-center gap-2 text-sm font-medium'
                    >
                      <Undo className='h-4 w-4' />
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </FormProvider>
    </div>
  )
}

export default UpdateAssetInformation
