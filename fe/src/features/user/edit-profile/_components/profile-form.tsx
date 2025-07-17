import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui'
import { X, Pencil, User, Mail, Shield, Building2, Undo, Check } from 'lucide-react'
import { AvatarUpload } from './avatar-upload'
import { profileFormSchema, type ProfileFormType } from '../../model/profile-form'
import type { UserProfile } from '../../model/profile-form'

interface ProfileFormProps {
  user: UserProfile
  onSubmit: (data: ProfileFormType) => void
  onClose: () => void
  isLoading?: boolean
}

export const ProfileForm = ({ user, onSubmit, onClose, isLoading }: ProfileFormProps) => {
  const form = useForm<ProfileFormType>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: undefined,
    },
  })
  const { isDirty, isValid } = form.formState
  const isSubmitDisabled = !isDirty || !isValid || isLoading
  const userInitials = ((user.lastName?.[0] || '') + (user.firstName?.[0] || '')).toUpperCase()

  return (
    <Card className='relative mx-auto max-w-md'>
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='absolute top-2 right-2 h-8 w-8 p-0 hover:bg-gray-100'
        onClick={onClose}
      >
        <X className='h-4 w-4' />
      </Button>

      <CardHeader>
        <CardTitle className='text-primary flex items-center gap-2'>
          <Pencil className='text-primary h-5 w-5' />
          Edit Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <AvatarUpload
              form={form}
              currentAvatar={user.avatar}
              userInitials={userInitials}
            />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      <User className='h-4 w-4' />
                      First Name
                    </FormLabel>
                    <FormControl highlightOnValue={false}>
                      <Input
                        highlightOnValue={false}
                        {...field}
                        placeholder='Enter your first name'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      <User className='h-4 w-4' />
                      Last Name
                    </FormLabel>
                    <FormControl highlightOnValue={false}>
                      <Input
                        highlightOnValue={false}
                        {...field}
                        placeholder='Enter your last name'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <Mail className='h-4 w-4' />
                    Email
                  </FormLabel>
                  <FormControl highlightOnValue={false}>
                    <Input
                      highlightOnValue={false}
                      {...field}
                      disabled
                      placeholder='Email address'
                      className='text-foreground font-medium'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <FormLabel className='flex items-center gap-2'>
                  <Shield className='h-4 w-4' />
                  Role
                </FormLabel>
                <Input
                  highlightOnValue={false}
                  className='text-foreground mt-2 font-medium'
                  value={user.role.slug}
                  disabled
                />
              </div>

              {user.department && (
                <div>
                  <FormLabel className='flex items-center gap-2'>
                    <Building2 className='h-4 w-4' />
                    Department
                  </FormLabel>
                  <Input
                    highlightOnValue={false}
                    className='text-foreground mt-2 font-medium'
                    value={user.department.departmentName}
                    disabled
                  />
                </div>
              )}
            </div>

            <div className='mt-4 flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                className='text-primary border-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/10 dark:hover:text-primary w-auto'
                onClick={onClose}
                disabled={isLoading}
              >
                <Undo className='text-primary h-4 w-4' />
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isSubmitDisabled}
                size='sm'
                className='h-9 w-fit'
              >
                <Check className='h-4 w-4' />
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
