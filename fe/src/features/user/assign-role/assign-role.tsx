import { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
  Form,
  FormSelect,
  FormButtonSubmit,
} from '@/components/ui'
import { Shield, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getData, tryCatch } from '@/utils'
import { assignRoleForUser, getAllRoles, getAllUsers } from '../api'
import type { UserType } from '../model'
import type { Roles } from './model'
import { type AssignRoleType, assignRoleSchema } from './model/schema'
import { toast } from 'sonner'

export const AssignRole = () => {
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isLoadingRoles, setIsLoadingRoles] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [roles, setRoles] = useState<Roles[]>()
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)

  const form = useForm<AssignRoleType>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: {
      userId: '',
      role: '',
    },
  })

  const fetchUsers = async () => {
    setIsLoadingUsers(true)
    await getData(getAllUsers, setUsers)
    setIsLoadingUsers(false)
  }
  const fetchRoles = async () => {
    setIsLoadingRoles(true)
    await getData(getAllRoles, setRoles)
    setIsLoadingRoles(false)
  }

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const onSubmit = async (values: AssignRoleType) => {
    setIsSubmitting(true)
    const data = await tryCatch(assignRoleForUser(values.role, values.userId))
    if (data.error) {
      form.reset()
      toast.error(data.error.message || 'Failed to assign role to user')
      setIsSubmitting(false)
      return
    }
    const user = users.find((u) => u.id.toString() === values.userId)
    form.reset({ userId: undefined, role: undefined })
    toast.success(`Role ${values.role} assigned to user ${user?.firstName} ${user?.lastName} successfully`)
    setIsSubmitting(false)
  }
  useEffect(() => {
    const userId = form.watch('userId')
    if (userId) {
      const user = users.find((u) => u.id.toString() === userId) || null
      setSelectedUser(user)
    } else {
      setSelectedUser(null)
    }
  }, [form.watch('userId'), users])
  return (
    <div className='container mx-auto px-4 py-6'>
      <Card className='mx-auto w-full max-w-2xl'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-2xl'>
            <Shield className='h-6 w-6' />
            Assign User Role
          </CardTitle>
          <CardDescription>Select a user and assign them an appropriate role in the system</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <CardContent className='space-y-4'>
              {isLoadingUsers ? (
                <div className='flex items-center gap-2 py-2'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span>Loading users...</span>
                </div>
              ) : (
                <FormSelect
                  name='userId'
                  label='User'
                  placeholder='Select a user'
                  data={users}
                />
              )}
              {selectedUser && (
                <div className='bg-muted rounded-md p-4'>
                  <h3 className='mb-2 text-sm font-medium'>Selected User</h3>
                  <div className='flex flex-col items-start gap-3'>
                    <p className='font-medium'>
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                    <p className='text-muted-foreground text-sm'>{selectedUser.email}</p>
                  </div>
                </div>
              )}
              {isLoadingRoles ? (
                <div className='flex items-center gap-2 py-2'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span>Loading roles...</span>
                </div>
              ) : (
                <div>
                  <FormSelect
                    name='role'
                    label='Role'
                    placeholder='Select a role'
                    data={roles || []}
                  />
                  {form.watch('role') && (
                    <div className='text-muted-foreground mt-2 flex items-center gap-2 text-sm'>
                      {roles?.find((r) => r.slug === form.watch('role'))?.description || 'No description available'}
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className='flex justify-end space-x-2 border-t pt-4'>
              <FormButtonSubmit
                isPending={isSubmitting}
                className='flex items-center gap-2'
                Icon={isSubmitting ? Loader2 : Shield}
                type='Submit'
                onSubmit={onSubmit}
              />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
