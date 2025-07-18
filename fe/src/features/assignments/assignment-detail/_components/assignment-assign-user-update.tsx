import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { type UserType } from '@/features/user'
import { type AssignmentData } from '../../get-all-assignments/model/type'
import { Loader2 } from 'lucide-react'

interface AssignmentUserAssignUpdateProps {
  users: UserType[]
  assignmentDetail: AssignmentData
  isLoading?: boolean
  departmentId?: string
  isEmployee?: boolean
}

export const AssignmentUserAssignUpdate = ({
  users,
  assignmentDetail,
  isLoading = false,
  departmentId,
  isEmployee = false,
}: AssignmentUserAssignUpdateProps) => {
  const { control } = useFormContext()

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm'>Current Assigned To</p>
        <div className='flex items-center gap-2'>
          <span>
            {assignmentDetail.userAssigned.firstName} {assignmentDetail.userAssigned.lastName}
            <span className='text-muted-foreground block text-xs'>{assignmentDetail.userAssigned.email}</span>
          </span>
        </div>
      </div>

      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm'>Assigned By</p>
        <div className='flex items-center'>
          <span>
            {assignmentDetail.userAssign.firstName} {assignmentDetail.userAssign.lastName}
            <span className='text-muted-foreground block text-xs'>{assignmentDetail.userAssign.email}</span>
          </span>
        </div>
      </div>

      <div className='col-span-1 md:col-span-2'>
        <FormField
          control={control}
          name='userId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Change Assigned To</FormLabel>
              <FormControl>
                {isLoading ? (
                  <div className='flex h-10 items-center'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span className='text-muted-foreground text-sm'>Loading users...</span>
                  </div>
                ) : (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading || (!departmentId && !isEmployee)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a user' />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem
                          key={user.id}
                          value={user.id.toString()}
                        >
                          {user.firstName} {user.lastName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
