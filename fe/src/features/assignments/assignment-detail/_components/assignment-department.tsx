import type { AssignmentData } from '../../get-all-assignments/model'
import { MapPin } from 'lucide-react'

export const AssignmentDepartment = ({ assignmentDetail }: { assignmentDetail: AssignmentData }) => {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm'>Department</p>
        <p className='font-medium'>{assignmentDetail.department.departmentName}</p>
      </div>

      <div className='space-y-2 md:col-span-2'>
        <p className='text-muted-foreground text-sm'>Location</p>
        <p className='flex items-start gap-2 leading-relaxed font-medium'>
          <MapPin className='mt-0.5 h-4 w-4 flex-shrink-0' />
          <span className='break-words'>{assignmentDetail.department.location.locationAddress}</span>
        </p>
      </div>
    </div>
  )
}
