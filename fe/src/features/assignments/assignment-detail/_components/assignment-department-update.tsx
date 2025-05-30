import { FormSelect } from '@/components'
import type { DepartmentType } from '@/features/assets'
import type { AssignmentData } from '../../get-all-assignments/model'
import type React from 'react'

export const AssignmentDepartmentUpdate = ({
  departments,
  assignmentDetail,
  setDepartmentId,
}: {
  departments: DepartmentType[]
  assignmentDetail: AssignmentData
  setDepartmentId: (departmentId: string) => void
}) => {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm'>Current Department</p>
        <p className='font-medium'>
          {assignmentDetail.department.departmentName}
          <span className='text-muted-foreground block text-xs'>
            {assignmentDetail.department.location.locationAddress}
          </span>
        </p>
      </div>

      <div className='space-y-2'>
        <FormSelect
          name='departmentId'
          label='Department'
          placeholder='Select a new department'
          data={departments.filter((dept) => dept.id !== assignmentDetail.department.id)}
          onChange={setDepartmentId}
        />
      </div>
    </div>
  )
}
