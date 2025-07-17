import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Form,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  FormInput,
  FormSelect,
  FormDatePicker,
  FormButtonSubmit,
} from '@/components/ui'
import { DollarSign, Laptop, Save, Undo } from 'lucide-react'
import { getAllDepartment, getAllCategories, createNewAsset } from '../api'
import { type CreateAssetFormType, createAssetFormSchema } from './model/schema'
import { getData, tryCatch } from '@/utils'
import { FileField, ImageField, ButtonCancel } from './_components'
import type { CategoryType, DepartmentType } from './model'

const CreateNewAsset = () => {
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const [departments, setDepartments] = useState<DepartmentType[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [isPendingGetData, setIsPendingGetData] = useState(false)
  const [imageName, setImageName] = useState<string>('')

  const getAllInformation = async () => {
    setIsPendingGetData(true)
    await getData(getAllDepartment, setDepartments)
    await getData(getAllCategories, setCategories)
    setIsPendingGetData(false)
  }

  useEffect(() => {
    getAllInformation()
  }, [])
  const form = useForm<CreateAssetFormType>({
    resolver: zodResolver(createAssetFormSchema),
    defaultValues: {
      assetName: '',
      purchaseDate: undefined,
      warrantExpiry: undefined,
      cost: 0,
      serialNumber: '',
      categoryId: '',
      departmentId: '',
      file: '',
      image: '',
    },
    mode: 'onChange',
  })
  const onSubmit = async (data: CreateAssetFormType) => {
    setIsPending(true)
    const purchaseDate = new Date(data.purchaseDate.getTime() + 25200000)
    const warrantExpiry = new Date(data.warrantExpiry.getTime() + 25200000)
    const response = await tryCatch(createNewAsset({ ...data, purchaseDate, warrantExpiry }))
    if (response.error) {
      toast.error(response.error?.message || 'Failed to create asset')
      return
    }
    console.log('🚀 ~ onSubmit ~ data:', data)
    toast.success('Asset created successfully')
    navigate('/assets')
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

  return (
    <div className='container mx-auto max-w-3xl py-6'>
      <Card>
        <FormProvider {...form}>
          <CardHeader>
            <CardTitle className='text-primary flex items-center text-2xl'>
              <Laptop className='text-primary mr-2 h-6 w-6' />
              Create New Asset
            </CardTitle>
            <CardDescription className='text-primary'>Add a new asset to the inventory system</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='create-asset-form group space-y-6'
                aria-disabled={isPendingGetData}
              >
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <FormInput
                    highlightOnValue={false}
                    name='assetName'
                    type='text'
                    label='Asset Name'
                    placeholder='Enter asset name'
                  />
                  <FormInput
                    highlightOnValue={false}
                    name='serialNumber'
                    type='text'
                    label='Serial Number'
                    placeholder='Enter serial number'
                  />

                  <FormInput
                    highlightOnValue={false}
                    name='cost'
                    type='number'
                    label='Cost'
                    placeholder='Enter asset cost'
                    Icon={DollarSign}
                  />

                  <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                    <FormSelect
                      highlightOnValue={false}
                      name='departmentId'
                      label='Department'
                      placeholder='Select a department'
                      data={departments}
                    />
                    <FormSelect
                      highlightOnValue={false}
                      name='categoryId'
                      label='Category'
                      placeholder='Select a category'
                      data={categories}
                    />
                  </div>

                  <FormDatePicker
                    highlightOnValue={false}
                    name='purchaseDate'
                    label='Purchase Date'
                    fn={handlePurchaseDateChange}
                  />

                  <FormDatePicker
                    highlightOnValue={false}
                    name='warrantExpiry'
                    label='Warranty Expiry'
                  />
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <FileField
                    highlightOnValue={false}
                    form={form}
                    fileName={fileName}
                    setFileName={setFileName}
                  />
                  <ImageField
                    highlightOnValue={false}
                    form={form}
                    imageName={imageName}
                    setImageName={setImageName}
                  />
                </div>
              </form>
            </Form>
          </CardContent>

          <CardFooter className='flex justify-end gap-2'>
            <ButtonCancel
              isPending={isPending}
              Icon={<Undo className='h-4 w-4' />}
            />
            <FormButtonSubmit
              className='w-fit sm:w-auto'
              isPending={isPending}
              Icon={Save}
              type='Create Asset'
              onSubmit={onSubmit}
            />
          </CardFooter>
        </FormProvider>
      </Card>
    </div>
  )
}

export default CreateNewAsset
