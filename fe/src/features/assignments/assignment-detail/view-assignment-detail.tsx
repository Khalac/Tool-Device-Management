import { useEffect, useState, useTransition } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Separator, Form } from '@/components/ui'
import { ArrowLeft, MapPin, User, Package, Loader2 } from 'lucide-react'
import type { AssignmentData } from '../get-all-assignments/model/type'
import { getData, tryCatch } from '@/utils'
import { getAssignmentData, UpdateAssignment } from '../api'
import {
  AssignmentAssetFile,
  AssignmentAssetImage,
  AssignmentAssetName,
  AssignmentAssetStatus,
  AssignmentDepartment,
  AssignmentDepartmentUpdate,
  AssignmentError,
  AssignmentUserAssign,
  AssignmentUserAssignUpdate,
} from './_components'
import { getAllUsersOfDepartment, type UserType } from '@/features/user'
import { getAllDepartment } from '@/features/assets/api'
import type { DepartmentType } from '@/features/assets'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type UpdateAssignmentForm, updateAssignmentSchema } from './model'
import { toast } from 'sonner'

const ViewAssignmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(true)
  const [isUpdate, setIsUpdate] = useState(false)
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isSubmitting, startTransition] = useTransition()
  const [departments, setDepartments] = useState<DepartmentType[]>([])
  const [departmentId, setDepartmentId] = useState<string>('')
  const [assignmentDetail, setAssignmentDetail] = useState<AssignmentData>()

  const form = useForm<UpdateAssignmentForm>({
    resolver: zodResolver(updateAssignmentSchema),
    defaultValues: {
      departmentId: '',
      userId: '',
    },
  })

  const getAssignmentsDetailData = async () => {
    setIsPending(true)
    await getData(() => getAssignmentData(id || ''), setAssignmentDetail)
    setIsPending(false)
  }

  const getAllDepartments = async () => {
    await getData(getAllDepartment, setDepartments)
  }

  const getUserOfDepartment = async (id: string) => {
    setIsLoadingUsers(true)
    await getData(() => getAllUsersOfDepartment(id || ''), setUsers)
    setIsLoadingUsers(false)
  }

  useEffect(() => {
    const loadInitialData = async () => {
      setIsPending(true)
      await getAssignmentsDetailData()
      await getAllDepartments()
      setIsPending(false)
    }
    loadInitialData()
  }, [id])

  useEffect(() => {
    if (departmentId) {
      getUserOfDepartment(departmentId)
    }
  }, [departmentId])

  const onSubmit = (data: UpdateAssignmentForm) => {
    startTransition(async () => {
      const response = await tryCatch(UpdateAssignment(id || '', data))
      if (response.error) {
        toast.error(response.error.message || 'Failed to update assignment, please try again')
        return
      }
      toast.success('Assignment updated successfully')
      await getAssignmentsDetailData()
      setIsUpdate(false)
    })
  }
  const handleDepartmentChange = (newDepartmentId: string) => {
    setDepartmentId(newDepartmentId)
    form.setValue('userId', '')
  }
  if (isPending) {
    return (
      <div className='flex h-[70vh] items-center justify-center'>
        <Loader2 className='text-primary h-12 w-12 animate-spin' />
      </div>
    )
  }

  if (!assignmentDetail) {
    return <AssignmentError id={id || ''} />
  }
  return (
    <div className='container mx-auto px-4 py-6 md:px-6'>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
          <Button
            variant='ghost'
            onClick={() => navigate('/assignments')}
            className='w-fit'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Assignments
          </Button>
          <h1 className='text-3xl font-semibold'> Assignment #{assignmentDetail.id}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Assignment Details</CardTitle>
          </CardHeader>
          <FormProvider {...form}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                aria-disabled={isSubmitting}
              >
                <CardContent className='space-y-6'>
                  <div className='space-y-4'>
                    <h3 className='flex items-center text-lg font-semibold'>
                      <Package className='mr-2 h-5 w-5' />
                      Asset Information
                    </h3>
                    <Separator />

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <AssignmentAssetName assignmentDetail={assignmentDetail} />
                      <AssignmentAssetStatus assignmentDetail={assignmentDetail} />
                      <AssignmentAssetImage assignmentDetail={assignmentDetail} />
                      <AssignmentAssetFile assignmentDetail={assignmentDetail} />
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <h3 className='flex items-center text-lg font-semibold'>
                      <User className='mr-2 h-5 w-5' />
                      Assignment Users
                    </h3>
                    <Separator />
                    <div>
                      {isUpdate ? (
                        <AssignmentUserAssignUpdate
                          users={users}
                          assignmentDetail={assignmentDetail}
                          isLoading={isLoadingUsers}
                          departmentId={departmentId}
                        />
                      ) : (
                        <AssignmentUserAssign assignmentDetail={assignmentDetail} />
                      )}
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <h3 className='flex items-center text-lg font-semibold'>
                      <MapPin className='mr-2 h-5 w-5' />
                      Department Information
                    </h3>
                    <Separator />

                    {isUpdate ? (
                      <AssignmentDepartmentUpdate
                        departments={departments}
                        assignmentDetail={assignmentDetail}
                        setDepartmentId={handleDepartmentChange}
                      />
                    ) : (
                      <AssignmentDepartment assignmentDetail={assignmentDetail} />
                    )}
                  </div>
                </CardContent>
              </form>
            </Form>
          </FormProvider>
          {isUpdate ? (
            <CardFooter className='flex flex-col justify-end gap-3 sm:flex-row'>
              <Button
                variant='outline'
                onClick={() => {
                  setIsUpdate(false)
                  setDepartmentId('')
                  form.reset({
                    departmentId: undefined,
                    userId: undefined,
                  })
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting || !form.formState.isDirty}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  'Done'
                )}
              </Button>
            </CardFooter>
          ) : (
            <CardFooter className='flex flex-col justify-end gap-3 sm:flex-row'>
              <Button
                variant='outline'
                onClick={() => navigate('/assignments')}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsUpdate(true)
                  form.setValue('departmentId', '')
                  form.setValue('userId', '')
                }}
              >
                Edit Assignment
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

export default ViewAssignmentDetail
