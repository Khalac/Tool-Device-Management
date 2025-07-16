import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Form,
  FormSelect,
  FormButtonSubmit,
} from '@/components/ui'
import { ArrowLeft, Send, Loader2, Undo } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tryCatch, getData } from '@/utils'
import { useEffect } from 'react'
import { getAllCategories } from '@/features/assets/api'
import { type FormCreateRequestTransfer, formCreateRequestTransferSchema } from './model'
import { FormDescriptionField } from './_components'
import { createNewRequestTransfer } from '../api'
import { toast } from 'sonner'

const CreateTransferRequest = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

  const form = useForm<FormCreateRequestTransfer>({
    resolver: zodResolver(formCreateRequestTransferSchema),
    defaultValues: {
      categoryId: '',
      description: '',
    },
  })

  const loadCategories = async () => {
    setIsLoadingCategories(true)
    await getData(getAllCategories, setCategories)
    setIsLoadingCategories(false)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const onSubmit = async (values: FormCreateRequestTransfer) => {
    setIsSubmitting(true)
    const data = await tryCatch(createNewRequestTransfer(values))

    if (data.error) {
      toast.error(data.error.message || 'Failed to create transfer request')
      setIsSubmitting(false)
      return
    }
    toast.success('Transfer request created successfully')
    form.reset({
      categoryId: '',
      description: '',
    })
    setIsSubmitting(false)
  }

  return (
    <div className='container mx-auto px-4 py-6'>
      <div className='flex flex-col space-y-6'>
        <div className='flex items-center'>
          <Button
            variant='ghost'
            onClick={() => navigate('/transfers')}
            className='w-fit'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Requests
          </Button>
        </div>

        <Card className='w-full'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-2xl'>
              <Send className='h-6 w-6' />
              Create New Transfer Request
            </CardTitle>
          </CardHeader>
          <FormProvider {...form}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <CardContent className='space-y-6'>
                  {isLoadingCategories ? (
                    <div className='flex items-center gap-2 py-2'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      <span>Loading categories...</span>
                    </div>
                  ) : (
                    <FormSelect
                      name='categoryId'
                      label='Asset Category'
                      placeholder='Select asset category'
                      data={categories}
                    />
                  )}

                  <FormDescriptionField form={form} />
                </CardContent>

                <CardFooter className='flex justify-between border-t pt-6'>
                  <Button
                    className='border-primary text-primary hover:text-primary/80'
                    type='button'
                    variant='outline'
                    onClick={() => navigate('/transfers')}
                    disabled={isSubmitting}
                  >
                    <Undo className='h-4 w-4' />
                    Cancel
                  </Button>
                  <FormButtonSubmit
                    isPending={isSubmitting}
                    className='flex items-center gap-2'
                    Icon={isSubmitting ? Loader2 : Send}
                    type='Submit Request'
                    onSubmit={onSubmit}
                  />
                </CardFooter>
              </form>
            </Form>
          </FormProvider>
        </Card>
      </div>
    </div>
  )
}

export default CreateTransferRequest
