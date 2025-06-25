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
import { X } from 'lucide-react'
import { AvatarUpload } from './avatar-upload'
import { profileFormSchema, type ProfileFormType } from '../../model/profile-form'

interface ProfileFormProps {
  user: {
    firstName: string
    lastName: string
    email: string
    avatar?: string
    role: { slug: string }
    department?: { departmentName: string } | null
  }
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
    },
  })

  const userInitials = ((user.lastName?.[0] || '') + (user.firstName?.[0] || '')).toUpperCase()

  return (
    <Card className='relative mx-auto max-w-2xl'>
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
        <CardTitle>Edit Profile</CardTitle>
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

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <FormLabel>Role</FormLabel>
                <Input
                  value={user.role.slug}
                  disabled
                />
              </div>

              {user.department && (
                <div>
                  <FormLabel>Department</FormLabel>
                  <Input
                    value={user.department.departmentName}
                    disabled
                  />
                </div>
              )}
            </div>

            <div className='flex gap-4'>
              <Button
                type='button'
                variant='outline'
                className='flex-1'
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='outline'
                className='bg-primary hover:bg-primary/90 flex-1'
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
