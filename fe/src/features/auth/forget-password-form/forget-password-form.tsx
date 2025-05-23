import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  LoadingSpinner,
} from '@/components/ui'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { type ForgetPasswordFormType, forgetPasswordFormSchema } from './model'
import { sendResetPasswordEmail } from './action'
import { toast } from 'sonner'

const ForgetPasswordForm = () => {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ForgetPasswordFormType>({
    resolver: zodResolver(forgetPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgetPasswordFormType) => {
    startTransition(async () => {
      const response = await sendResetPasswordEmail(data.email)
      if (!response.success) {
        toast.error((response.error as any)?.data.msg)
        return
      }
      toast.success('Check your email for reset password link')
      setIsSuccess(true)
      return
    })
  }

  if (isSuccess) {
    return (
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>We've sent password reset instructions to your email.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground mb-4 text-sm'>
            If you don't see the email, check other places it might be, like your junk, spam, or other folders.
          </p>
          <Button
            variant='outline'
            asChild
            className='w-full'
          >
            <Link to='/login'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to login
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Enter your email address and we will send you a link to reset your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your email address'
                      type='email'
                      autoComplete='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full'
            >
              {isPending ? <LoadingSpinner className='mr-2 h-4 w-4 animate-spin' /> : 'Send'}
            </Button>
          </form>
        </Form>
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
