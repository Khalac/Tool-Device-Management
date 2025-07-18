import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  FormInput,
  FormButtonSubmit,
} from '@/components/ui'
import { ArrowLeft, RefreshCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { type ForgetPasswordFormType, forgetPasswordFormSchema } from './model'
import { sendResetPasswordEmail } from '../api'
import { toast } from 'sonner'
import { tryCatch } from '@/utils'
import { SignUpSuccess } from './_components'
import { Mail } from 'lucide-react'

const ForgetPasswordForm = () => {
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ForgetPasswordFormType>({
    resolver: zodResolver(forgetPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgetPasswordFormType) => {
    const response = await tryCatch(sendResetPasswordEmail(data.email))
    if (response.error) {
      toast.error(response.error?.message || 'Failed to send reset password email')
      return
    }
    toast.success('Check your email for reset password link')
    setIsSuccess(true)
    return
    setIsPending(true)
  }

  if (isSuccess) {
    return <SignUpSuccess />
  }

  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <RefreshCcw className='h-5 w-5' />
          Reset password
        </CardTitle>
        <CardDescription>Enter your email address and we will send you a link to reset your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormInput
                Icon={Mail}
                name='email'
                type='email'
                label='Email Address'
                placeholder='Enter your email address'
              />

              <FormButtonSubmit
                className='bg-primary hover:bg-primary/90 mt-5 flex h-9 w-full items-center justify-center gap-1.5 text-sm font-medium sm:mt-6 sm:h-10 sm:gap-2 sm:text-base'
                isPending={isPending}
                type='Send'
                onSubmit={onSubmit}
              />
            </form>
          </Form>
        </FormProvider>
      </CardContent>
      <CardFooter className='flex justify-center border-t pt-4'>
        <Button
          variant='link'
          asChild
          size='sm'
        >
          <Link to='/login'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to login
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ForgetPasswordForm
