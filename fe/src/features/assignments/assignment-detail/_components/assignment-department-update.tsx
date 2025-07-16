import { FormSelect } from '@/components'
import type { DepartmentType } from '@/features/assets'
import type { AssignmentData } from '../../get-all-assignments/model'

export const AssignmentDepartmentUpdate = ({
  departments,
  assignmentDetail,
  setDepartmentId,
  isEmployee,
}: {
  departments: DepartmentType[]
  assignmentDetail: AssignmentData
  setDepartmentId: (departmentId: string) => void
  isEmployee?: boolean
}) => {
  return (
    <div className='grid grid-cols-1 gap-6'>
      <div className='space-y-2'>
        <p className='text-sm font-semibold'>Current Department</p>
        <p className='font-medium'>
          {assignmentDetail.department.departmentName}
          <span className='text-muted-foreground mt-1 block text-sm leading-relaxed break-words'>
            {assignmentDetail.department.location.locationAddress}
          </span>
        </p>
      </div>
      {!isEmployee && (
        <div className='new-department-form group space-y-2'>
          <FormSelect
            name='departmentId'
            label='Department'
            placeholder='Select a new department'
            data={departments}
            onChange={setDepartmentId}
          />
        </div>
      )}
    </div>
  )
}
