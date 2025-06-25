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
import { Building2, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getData, tryCatch } from '@/utils'
import { assignDepartmentForUser, getUserDoNotHaveDepartment } from '../api'
import type { UserType } from '../model'
import type { DepartmentType } from './model'
import { type AssignDepartmentType, assignDepartmentSchema } from './model/schema'
import { toast } from 'sonner'
import { getAllDepartment } from '@/features/assets/api'

export const AssignDepartment = () => {
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [departments, setDepartments] = useState<DepartmentType[]>()
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType | null>(null)

  const form = useForm<AssignDepartmentType>({
    resolver: zodResolver(assignDepartmentSchema),
    defaultValues: {
      userId: '',
      departmentId: '',
    },
  })

  const fetchUsers = async () => {
    setIsLoadingUsers(true)
    await getData(getUserDoNotHaveDepartment, setUsers)
    setIsLoadingUsers(false)
  }
  const fetchDepartments = async () => {
    setIsLoadingDepartments(true)
    await getData(getAllDepartment, setDepartments)
    setIsLoadingDepartments(false)
  }

  useEffect(() => {
    fetchUsers()
    fetchDepartments()
  }, [])

  const onSubmit = async (values: AssignDepartmentType) => {
    setIsSubmitting(true)
    const data = await tryCatch(assignDepartmentForUser(values.departmentId, values.userId))
    if (data.error) {
      form.reset()
      toast.error(data.error.message || 'Failed to assign department to user')
      setIsSubmitting(false)
      return
    }
    const user = users.find((u) => u.id.toString() === values.userId)
    form.reset({ userId: undefined, departmentId: undefined })
    toast.success(
      `Department ${values.departmentId} assigned to user ${user?.firstName} ${user?.lastName} successfully`
    )
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

  useEffect(() => {
    const departmentId = form.watch('departmentId')
    if (departmentId) {
      const department = departments?.find((d) => d.id.toString() === departmentId) || null
      setSelectedDepartment(department)
    } else {
      setSelectedDepartment(null)
    }
  }, [form.watch('departmentId'), departments])

  return (
    <div className='container mx-auto px-4 py-6'>
      <Card className='mx-auto w-full max-w-2xl'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-2xl'>
            <Building2 className='h-6 w-6' />
            Assign User Department
          </CardTitle>
          <CardDescription>Select a user and assign them an appropriate department in the system</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <CardContent className='space-y-4'>
              {!isLoadingUsers && users.length === 0 ? (
                <div className='bg-muted rounded-md p-4 text-center font-medium text-white'>
                  All users already have a department assigned.
                </div>
              ) : (
                <>
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
                    <div className='bg-muted mt-4 rounded-md p-4'>
                      <h4 className='mb-1 text-sm font-semibold'>Selected User</h4>
                      <div className='flex flex-col items-start gap-2'>
                        <p className='font-medium'>
                          {selectedUser.firstName} {selectedUser.lastName}
                        </p>
                        <p className='text-muted-foreground text-sm'>{selectedUser.email}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              {isLoadingDepartments ? (
                <div className='flex items-center gap-2 py-2'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span>Loading departments...</span>
                </div>
              ) : (
                <FormSelect
                  name='departmentId'
                  label='Department'
                  placeholder='Select a department'
                  data={departments || []}
                />
              )}
              {selectedDepartment && (
                <div className='bg-muted mt-4 rounded-md p-4'>
                  <h4 className='mb-1 text-sm font-semibold'>Department Details</h4>
                  <div className='flex flex-col gap-1'>
                    <span className='font-medium'>{selectedDepartment.departmentName}</span>
                    <span className='text-muted-foreground text-sm'>
                      {selectedDepartment.location?.locationAddress || 'No location info'}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className='flex justify-end space-x-2 border-t pt-4'>
              <FormButtonSubmit
                isPending={isSubmitting}
                className='flex items-center gap-2'
                Icon={isSubmitting ? Loader2 : Building2}
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
