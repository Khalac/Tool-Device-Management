import { useEffect, useState } from 'react'
import { getDataAssetsFilter } from '../api'

import type { AssetsType, FilterType } from './model'
import { columnsAssetsTable } from './column-table'
import { DataTable, Card, CardHeader, CardTitle, CardDescription, CardContent, SkeletonForTable } from '@/components/ui'
import { Laptop } from 'lucide-react'
import {
  ButtonCreateNewAssets,
  ButtonViewType,
  CardStatusStatistic,
  FilterAssets,
  ViewCardsDataAssets,
} from './_components'
import { getData } from '@/utils'
import { useDebounce } from '@/hooks'
import { useSearchParams } from 'react-router-dom'

const ViewAllAssets = () => {
  const [searchParam, setSearchParam] = useSearchParams()
  const [isPending, setIspending] = useState(false)
  const [assets, setAssets] = useState<AssetsType[]>([])
  const [viewMode, setViewMode] = useState<string>('table')
  const [filteredAssets, setFilteredAssets] = useState<FilterType>({
    assetName: searchParam.get('assetName') || '',
    categoryId: searchParam.get('categoryId') || null,
    departmentId: searchParam.get('departmentId') || null,
    status: searchParam.get('status') || null,
  })
  const getAssetsData = async () => {
    setIspending(true)
    await getData(() => getDataAssetsFilter({ ...filterData }), setAssets)
    setIspending(false)
  }
  const filterData = useDebounce(filteredAssets, 1000)
  const handleRemoveFilter = (filterType: 'status' | 'category' | 'department') => {
    setFilteredAssets((prev) => {
      const newState = { ...prev }
      if (filterType === 'status') {
        newState.status = null
      } else if (filterType === 'category') {
        newState.categoryId = null
      } else if (filterType === 'department') {
        newState.departmentId = null
      }
      return newState
    })
  }
  useEffect(() => {
    getAssetsData()
  }, [])

  useEffect(() => {
    if (filteredAssets.assetName) {
      searchParam.set('assetName', filteredAssets.assetName)
    } else {
      searchParam.delete('assetName')
    }
    if (filteredAssets.categoryId) {
      searchParam.set('categoryId', filteredAssets.categoryId)
    } else {
      searchParam.delete('categoryId')
    }
    if (filteredAssets.departmentId) {
      searchParam.set('departmentId', filteredAssets.departmentId)
    } else {
      searchParam.delete('departmentId')
    }
    if (filteredAssets.status) {
      searchParam.set('status', filteredAssets.status)
    } else {
      searchParam.delete('status')
    }
    setSearchParam(searchParam)
    getAssetsData()
  }, [filterData])
  const handleStatClick = (filterType: 'total' | 'new' | 'in-use' | 'maintenance' | 'retired') => {
    const newFilter = { ...filteredAssets }

    switch (filterType) {
      case 'total':
        newFilter.status = null
        break
      case 'new':
        newFilter.status = 'New'
        break
      case 'in-use':
        newFilter.status = 'In Use'
        break
      case 'maintenance':
        newFilter.status = 'Under Maintenance'
        break
      case 'retired':
        newFilter.status = 'Disposed'
        break
    }

    setFilteredAssets(newFilter)
  }

  const handleCategoryClick = (categoryName: string) => {
    const category = assets.find((asset) => asset.category.categoryName === categoryName)
    if (category) {
      setFilteredAssets((prev) => ({
        ...prev,
        categoryId: category.category.id?.toString() || null,
      }))
    }
  }

  const handleDepartmentClick = (departmentName: string) => {
    const department = assets.find((asset) => asset.department.departmentName === departmentName)
    if (department) {
      setFilteredAssets((prev) => ({
        ...prev,
        departmentId: department.department.id?.toString() || null,
      }))
    }
  }
  return (
    <div className='space-y-6'>
      <ButtonViewType
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <Card>
        <CardHeader className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div>
            <CardTitle className='flex items-center text-2xl'>
              <Laptop className='mr-2 h-5 w-5' />
              Asset Management
            </CardTitle>
            <CardDescription>View and manage all company assets</CardDescription>
          </div>
          <ButtonCreateNewAssets />
        </CardHeader>
        <CardContent className='space-y-6'>
          <CardStatusStatistic
            isPending={isPending}
            assets={assets}
            currentFilter={filteredAssets}
            onRemoveFilter={handleRemoveFilter}
            onStatClick={handleStatClick}
            onCategoryClick={handleCategoryClick}
            onDepartmentClick={handleDepartmentClick}
          />

          <FilterAssets
            filteredAssets={filteredAssets}
            setFilteredAssets={setFilteredAssets}
            assets={assets}
            showExportButtons={true}
          />
          {isPending ? (
            <SkeletonForTable />
          ) : (
            <>
              {viewMode === 'table' ? (
                <DataTable
                  columns={columnsAssetsTable}
                  data={assets}
                />
              ) : (
                <ViewCardsDataAssets assets={assets || []} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ViewAllAssets
