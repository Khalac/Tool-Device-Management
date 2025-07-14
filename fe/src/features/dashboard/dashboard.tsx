import { useEffect, useState } from 'react'
import { useAppSelector, useDebounce } from '@/hooks'
import type { FilterType, AssetsType } from '../assets/view-all-assets'
import { DashboardFilter } from './components/dashboard-filter'
import { DashboardStats } from './components/dashboard-stats'
import { getAllAssets, getDataAssetsFilter } from '../assets/api'
import { tryCatch } from '@/utils'
import type { DashboardData } from './api/type'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AreaChart, FileText } from 'lucide-react'
import { Button, CardDescription, CardTitle } from '@/components/ui'

export const Dashboard = () => {
  const [searchParam, setSearchParam] = useSearchParams()
  const navigate = useNavigate()
  const [filteredAssets, setFilteredAssets] = useState<FilterType>({
    assetName: searchParam.get('assetName') || '',
    categoryId: searchParam.get('categoryId') || null,
    departmentId: searchParam.get('departmentId') || null,
    status: searchParam.get('status') || null,
  })

  const [assets, setAssets] = useState<AssetsType[]>([])
  const [stats, setStats] = useState<DashboardData>({
    total_assets: 0,
    assigned: 0,
    under_maintenance: 0,
    retired: 0,
  })
  const [isPending, setIsPending] = useState(false)

  const filterData = useDebounce(filteredAssets, 1000)
  const user = useAppSelector((state) => state.auth.user)
  const role = user.role.slug
  const isAdmin = role === 'admin'

  const calculateStats = (assets: AssetsType[]) => {
    const newStats: DashboardData = {
      total_assets: assets.length,
      assigned: assets.filter((asset) => asset.status === 'In Use').length,
      under_maintenance: assets.filter((asset) => asset.status === 'Under Maintenance').length,
      retired: assets.filter((asset) => asset.status === 'Retired').length,
    }
    setStats(newStats)
  }

  const fetchAssets = async () => {
    setIsPending(true)
    try {
      if (Object.values(filterData).some((value) => value !== null && value !== '')) {
        const response = await tryCatch(getDataAssetsFilter(filterData))
        if (!response.error) {
          setAssets(response.data.data)
          calculateStats(response.data.data)
        }
      } else {
        const response = await tryCatch(getAllAssets())
        if (!response.error) {
          setAssets(response.data.data)
          calculateStats(response.data.data)
        }
      }
    } finally {
      setIsPending(false)
    }
  }

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
  }, [filterData])

  useEffect(() => {
    fetchAssets()
  }, [filterData])

  const handleNavigateToReports = () => {
    navigate('/statistics-reports')
  }

  const views = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: AreaChart,
      onClick: () => {},
    },
    ...(isAdmin
      ? [
          {
            key: 'reports',
            label: 'Statistical Reports',
            icon: FileText,
            onClick: handleNavigateToReports,
          },
        ]
      : []),
  ]

  return (
    <div className='space-y-4 p-4 sm:space-y-6 sm:p-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <CardTitle className='flex items-center text-2xl'>
            <AreaChart className='mr-2 h-5 w-5' />
            Dashboard
          </CardTitle>
          <CardDescription>Overview of key metrics and recent activity</CardDescription>
        </div>
        {views.length > 1 && (
          <div className='flex gap-2'>
            {views.map((view) => (
              <Button
                key={view.key}
                variant={view.key === 'dashboard' ? 'default' : 'outline'}
                onClick={view.onClick}
                className='flex items-center gap-2'
              >
                <view.icon className='h-4 w-4' />
                {view.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      <DashboardFilter
        filteredAssets={filteredAssets}
        setFilteredAssets={setFilteredAssets}
        assets={assets}
      />

      <DashboardStats
        onRemoveFilter={handleRemoveFilter}
        stats={stats}
        assets={assets}
        isPending={isPending}
        onStatClick={handleStatClick}
        onCategoryClick={handleCategoryClick}
        onDepartmentClick={handleDepartmentClick}
        currentFilter={filteredAssets}
      />
    </div>
  )
}
