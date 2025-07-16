import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  Button,
  FormDatePicker,
  FormSelect,
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { Calendar, Loader2, Undo } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import type { AssetsType } from '../view-all-assets'
import { createMaintenanceSchedule, getAssetNoSchedule } from '../api'
import { getData, tryCatch } from '@/utils'
import { type CreateMaintenanceScheduleType, createMaintenanceScheduleSchema } from './model/schema'
import { useFormState } from 'react-hook-form'

const CreateMaintenanceSchedule = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assets, setAssets] = useState<AssetsType[]>([])
  const [isPending, setIsPending] = useState(false)
  const navigate = useNavigate()

  const getAssetsData = async () => {
    setIsPending(true)
    await getData(getAssetNoSchedule, setAssets)
    setIsPending(false)
  }
  useEffect(() => {
    getAssetsData()
  }, [])

  const form = useForm<CreateMaintenanceScheduleType>({
    resolver: zodResolver(createMaintenanceScheduleSchema),
    defaultValues: {
      assetId: '',
      startDate: undefined,
      endDate: undefined,
    },
    mode: 'onChange',
  })
  const { isValid, isDirty } = useFormState({
    control: form.control,
  })
  const onSubmit = async (data: CreateMaintenanceScheduleType) => {
    setIsSubmitting(true)
    const startDate = new Date(data.startDate.getTime() + 25200000)
    const endDate = new Date(data.endDate?.getTime() + 25200000)
    const response = await tryCatch(createMaintenanceSchedule({ ...data, startDate, endDate }))
    if (response.error) {
      toast.error(response.error.message || 'Failed to create maintenance schedule')
      setIsSubmitting(false)
      return
    }
    toast.success('Maintenance schedule created successfully')
    form.reset({
      assetId: '',
      startDate: undefined,
      endDate: undefined,
    })
    setIsSubmitting(false)
  }
  const handleStartDateChange = (value: Date) => {
    form.setValue('startDate', value, { shouldDirty: true })
    const endDate = form.getValues('endDate')

    if (endDate) {
      form.trigger('endDate')
    } else {
      form.clearErrors('endDate')
    }
  }

  return (
    <div className='container mx-auto py-10'>
      <Card className='mx-auto max-w-2xl'>
        <CardHeader>
          <CardTitle className='text-primary flex items-center gap-2'>
            <Calendar className='text-primary h-5 w-5' />
            Create Maintenance Schedule
          </CardTitle>
          <CardDescription className='text-primary'>
            Schedule maintenance for an asset by selecting dates and the asset to maintain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='create-maintenance-schedule group space-y-6'
              >
                <div>
                  {isPending ? (
                    <div className='flex'>
                      <Loader2 className='text-muted-foreground h-6 w-6 animate-spin' />
                    </div>
                  ) : (
                    <FormSelect
                      name='assetId'
                      label='Select Asset'
                      placeholder='Select an asset'
                      data={assets}
                    />
                  )}
                </div>

                <div className='flex flex-col gap-4 sm:flex-row sm:gap-6'>
                  <div className='flex-1'>
                    <FormDatePicker
                      name='startDate'
                      label='Start Date'
                      fn={handleStartDateChange}
                    />
                  </div>
                  <div className='flex-1'>
                    <FormDatePicker
                      name='endDate'
                      label='End Date'
                    />
                  </div>
                </div>

                <div className='flex justify-end space-x-4'>
                  <Button
                    variant='outline'
                    onClick={() => navigate('/assets/maintenance-schedule')}
                    type='button'
                    className='border-primary text-primary hover:text-primary/80'
                  >
                    <Undo className='h-4 w-4' />
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={isSubmitting || !isValid || !isDirty}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Creating...
                      </>
                    ) : (
                      'Create Schedule'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateMaintenanceSchedule
