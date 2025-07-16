import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components'
import type { FilterType } from '../../../model'
import { useEffect, useState } from 'react'
import { tryCatch } from '@/utils'
import { getAllDepartment } from '@/features/assets/api'
import type { DepartmentType } from '@/features/assets/create-new-asset'

export const DepartmentsFilter = ({
  filteredAssets,
  setFilteredAssets,
}: {
  filteredAssets: FilterType
  setFilteredAssets: React.Dispatch<React.SetStateAction<FilterType>>
}) => {
  const [isPending, setIsPending] = useState(false)
  const [departments, setDepartments] = useState<DepartmentType[]>([])
  const getDepartments = async () => {
    setIsPending(true)
    const response = await tryCatch(getAllDepartment())
    if (response.error) {
      return
    }
    setDepartments(response.data.data)
    setIsPending(false)
  }
  useEffect(() => {
    getDepartments()
  }, [])
  return (
    <Select
      disabled={isPending}
      value={filteredAssets.departmentId || ''}
      onValueChange={(value) => setFilteredAssets({ ...filteredAssets, departmentId: value || null })}
    >
      <SelectTrigger
        value={filteredAssets.departmentId || ''}
        className='w-full md:w-[180px]'
      >
        <SelectValue placeholder='Department'>
          {filteredAssets.departmentId &&
            departments.find((department) => department.id.toString() === filteredAssets.departmentId)?.departmentName}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {departments.map((department) => (
            <SelectItem
              key={department.id}
              value={department.id.toString()}
            >
              {department.departmentName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
