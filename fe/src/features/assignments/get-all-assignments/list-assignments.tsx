import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, DataTable, SkeletonForTable } from '@/components/ui'
import { ClipboardList } from 'lucide-react'
import type { AssignmentData } from './model'
import { getData } from '@/utils'
import { getAssignments, getAssignmentsWithFilter } from '../api'
import { columnsAssignmentsTable } from './column-table'
import { useDebounce } from '@/hooks'
import { useSearchParams } from 'react-router-dom'
import { ButtonClearFilter, AssetNameFilter, AssignedToFilter, AssignedByFilter } from './_components'

const ListAssignments = () => {
  const [searchParam, setSearchParam] = useSearchParams()
  const [assignments, setAssignments] = useState<AssignmentData[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    assetName: '',
    emailAssign: '',
    emailAssigned: '',
  })

  const filterData = useDebounce(filters, 1000)

  const fetchData = async () => {
    setIsLoading(true)
    await getData(getAssignments, setAssignments)
    setIsLoading(false)
  }
  const getAssetsFilterData = async () => {
    setIsLoading(true)
    await getData(() => getAssignmentsWithFilter(filterData), setAssignments)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])
  useEffect(() => {
    if (filters.assetName) {
      searchParam.set('assetName', filters.assetName)
    } else {
      searchParam.delete('assetName')
    }
    if (filters.emailAssign) {
      searchParam.set('emailAssign', filters.emailAssign)
    } else {
      searchParam.delete('emailAssign')
    }
    if (filters.emailAssigned) {
      searchParam.set('emailAssigned', filters.emailAssigned)
    } else {
      searchParam.delete('emailAssigned')
    }
    setSearchParam(searchParam)
    getAssetsFilterData()
  }, [filterData])

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex items-center space-x-4'>
          <div className='flex-1 space-y-1'>
            <CardTitle className='text-primary flex items-center gap-2 text-2xl'>
              <ClipboardList className='text-primary h-6 w-6' />
              Asset Assignments
            </CardTitle>
            <CardDescription className='text-primary'>View and manage all asset assignments</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='flex flex-col gap-4 md:flex-row'>
            <AssetNameFilter
              filters={filters}
              setFilters={setFilters}
            />
            <AssignedByFilter
              filters={filters}
              setFilters={setFilters}
            />
            <AssignedToFilter
              filters={filters}
              setFilters={setFilters}
            />
            <ButtonClearFilter
              filters={filters}
              setFilters={setFilters}
            />
          </div>

          {isLoading ? (
            <SkeletonForTable />
          ) : (
            <DataTable
              columns={columnsAssignmentsTable}
              data={assignments || []}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ListAssignments
