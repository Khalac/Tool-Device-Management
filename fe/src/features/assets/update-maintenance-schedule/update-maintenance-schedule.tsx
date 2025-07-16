import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Form,
  FormDatePicker,
} from '@/components/ui'
import { Check, Loader2, Undo } from 'lucide-react'
import { FormProvider, useForm, useFormState } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { type UpdateMaintenanceScheduleType, updateMaintenanceScheduleSchema } from './model/schema'
import { updateMaintenanceSchedule } from '../api'
import { toast } from 'sonner'
import { tryCatch } from '@/utils'

const UpdateMaintenanceSchedule = ({
  id,
  isDialogOpen,
  setIsDialogOpen,
  startDate,
  endDate,
  onSuccessUpdate,
}: {
  id: string
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  startDate: Date | undefined
  endDate: Date | undefined
  onSuccessUpdate: () => void
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const form = useForm<UpdateMaintenanceScheduleType>({
    resolver: zodResolver(updateMaintenanceScheduleSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: UpdateMaintenanceScheduleType) => {
    setIsProcessing(true)
    const startDate = new Date(data.startDate.getTime() + 25200000)
    const endDate = new Date(data.endDate?.getTime() + 25200000)
    const response = await tryCatch(updateMaintenanceSchedule(id, { ...data, startDate, endDate }))
    if (response.error) {
      toast.error(response.error.message || 'Failed to update maintenance schedule')
      setIsProcessing(false)
      return
    }
    toast.success('Maintenance schedule updated successfully')
    form.reset({
      startDate: undefined,
      endDate: undefined,
    })
    onSuccessUpdate()
    setIsDialogOpen(false)
    setIsProcessing(false)
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
  useEffect(() => {
    if (startDate && endDate) {
      const formattedStartDate = new Date(startDate)
      const formattedEndDate = new Date(endDate)
      form.reset({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
    }
  }, [startDate, endDate])
  const { isValid, isDirty } = useFormState({
    control: form.control,
  })

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    >
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Update Maintenance Schedule</DialogTitle>
          <DialogDescription>Set the start and end dates for maintenance schedule.</DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormDatePicker
                highlightOnValue={false}
                name='startDate'
                label='Start Date'
                fn={handleStartDateChange}
              />

              <FormDatePicker
                highlightOnValue={false}
                name='endDate'
                label='End Date'
              />

              <DialogFooter>
                <Button
                  className='border-primary text-primary hover:text-primary/80'
                  variant='outline'
                  type='button'
                  onClick={() => {
                    setIsDialogOpen(false)
                    form.reset({
                      startDate: undefined,
                      endDate: undefined,
                    })
                  }}
                  disabled={isProcessing}
                >
                  <Undo className='text-primary h-4 w-4' />
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={isProcessing || !isValid || !isDirty}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className='mr-1 h-4 w-4' />
                      Save Schedule
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateMaintenanceSchedule
