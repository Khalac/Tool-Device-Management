import { Card, CardContent, CardTitle } from '@/components/ui'
import { Package, CheckCircle, Users, AlertTriangle, Box, Briefcase, StopCircle, X } from 'lucide-react'

export interface Asset {
  id: number
  assetName: string
  status: string
  cost: number
  category: { categoryName: string; id?: number }
  department: { departmentName: string; id?: number }
}

interface StatsOverviewCardsProps {
  stats: {
    total_assets: number
  }
  assets: Asset[]
  onStatClick: (filterType: 'total' | 'new' | 'in-use' | 'maintenance' | 'retired') => void
  onCategoryClick: (categoryName: string) => void
  onDepartmentClick: (departmentName: string) => void
  onRemoveFilter: (filterType: 'status' | 'category' | 'department') => void
  currentFilter: {
    status: string | null
    categoryId: string | null
    departmentId: string | null
  }
  previousMonthStats?: {
    total_assets: number
    newCount: number
    inUseCount: number
    underMaintenanceCount: number
    retiredAndDisposedCount: number
  }
}

export const StatsOverviewCards = ({
  stats,
  assets,
  onStatClick,
  onCategoryClick,
  onDepartmentClick,
  onRemoveFilter,
  currentFilter,
  previousMonthStats,
}: StatsOverviewCardsProps) => {
  const getStatusCount = (status: string) => {
    return assets?.filter((asset) => asset.status === status)?.length || 0
  }

  const newCount = getStatusCount('New')
  const retiredAndDisposedCount = getStatusCount('Retired') + getStatusCount('Disposed')
  const inUseCount = getStatusCount('In Use')
  const underMaintenanceCount = getStatusCount('Under Maintenance')
  const categoryCount = [...new Set(assets.map((asset) => asset.category.categoryName))]
  const departmentCount = [...new Set(assets.map((asset) => asset.department.departmentName))]

  const getTotalAssetsMessage = () => {
    if (!previousMonthStats || typeof previousMonthStats.total_assets !== 'number') {
      return `Increased ${stats.total_assets} assets compared to last month`
    }

    const difference = stats.total_assets - previousMonthStats.total_assets

    if (difference > 0) {
      return `Increased by ${difference} assets compared to last month`
    } else if (difference < 0) {
      return `Decreased by ${Math.abs(difference)} assets compared to last month`
    } else {
      return 'No change compared to last month'
    }
  }

  const isCardActive = (filterType: string) => {
    switch (filterType) {
      case 'total':
        return currentFilter.status === null
      case 'new':
        return currentFilter.status === 'New'
      case 'in-use':
        return currentFilter.status === 'In Use'
      case 'maintenance':
        return currentFilter.status === 'Under Maintenance'
      case 'retired':
        return currentFilter.status === 'Disposed'
      default:
        return false
    }
  }

  const isCategoryActive = () => {
    return currentFilter.categoryId !== null
  }

  const isDepartmentActive = () => {
    return currentFilter.departmentId !== null
  }

  const handleRemoveFilterClick = (e: React.MouseEvent, filterType: 'status' | 'category' | 'department') => {
    e.stopPropagation()
    onRemoveFilter(filterType)
  }

  return (
    <div className='xs:grid-cols-2 max-w-[430px]:grid-cols-1 grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4 lg:grid-cols-7'>
      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-cyan-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCardActive('total') ? 'scale-105 border border-cyan-500 shadow-lg dark:border-cyan-500' : ''
        }`}
        onClick={() => onStatClick('total')}
      >
        <CardContent className='p-2.5 sm:p-3 md:p-4'>
          <div className='mb-1 flex items-center justify-between'>
            <CardTitle className='line-clamp-2 text-xs leading-tight font-medium text-gray-600 sm:text-sm dark:text-gray-400'>
              Total Assets
            </CardTitle>
            <div className='rounded-full bg-cyan-50 p-1.5 transition-all duration-300 group-hover:scale-110 sm:p-2 dark:bg-cyan-950/50'>
              <Package className='h-3 w-3 text-cyan-500 sm:h-4 sm:w-4 dark:text-cyan-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-lg font-bold text-cyan-600 transition-colors duration-300 sm:text-xl md:text-2xl dark:text-cyan-400'>
              {stats.total_assets.toString()}
            </div>
            <p className='text-muted-foreground truncate text-xs'>{getTotalAssetsMessage()}</p>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-emerald-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCardActive('new') ? 'scale-105 border border-emerald-500 shadow-lg dark:border-emerald-500' : ''
        }`}
        onClick={() => onStatClick('new')}
      >
        {isCardActive('new') && (
          <button
            onClick={(e) => handleRemoveFilterClick(e, 'status')}
            className='absolute -top-0.5 -right-0.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-emerald-300 text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-emerald-400 sm:h-5 sm:w-5 dark:bg-emerald-700 dark:hover:bg-emerald-600'
          >
            <X className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
          </button>
        )}
        <CardContent className='p-2.5 sm:p-3 md:p-4'>
          <div className='mb-1 flex items-center justify-between'>
            <CardTitle className='line-clamp-2 text-xs leading-tight font-medium text-gray-600 sm:text-sm dark:text-gray-400'>
              New Assets
            </CardTitle>
            <div className='rounded-full bg-emerald-50 p-1.5 transition-all duration-300 group-hover:scale-110 sm:p-2 dark:bg-emerald-950/50'>
              <CheckCircle className='h-3 w-3 text-emerald-500 sm:h-4 sm:w-4 dark:text-emerald-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-lg font-bold text-emerald-600 transition-colors duration-300 sm:text-xl md:text-2xl dark:text-emerald-400'>
              {newCount.toString()}
            </div>
            <p className='text-muted-foreground truncate text-xs'>
              {`${stats.total_assets > 0 ? ((newCount / stats.total_assets) * 100).toFixed(1) : '0.0'}% of total assets`}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-blue-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCardActive('in-use') ? 'scale-105 border border-blue-500 shadow-lg dark:border-blue-500' : ''
        }`}
        onClick={() => onStatClick('in-use')}
      >
        {isCardActive('in-use') && (
          <button
            onClick={(e) => handleRemoveFilterClick(e, 'status')}
            className='absolute -top-0.5 -right-0.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-blue-300 text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-blue-400 sm:h-5 sm:w-5 dark:bg-blue-700 dark:hover:bg-blue-600'
          >
            <X className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
          </button>
        )}
        <CardContent className='p-2.5 sm:p-3 md:p-4'>
          <div className='mb-1 flex items-center justify-between'>
            <CardTitle className='line-clamp-2 text-xs leading-tight font-medium text-gray-600 sm:text-sm dark:text-gray-400'>
              In Use Assets
            </CardTitle>
            <div className='rounded-full bg-blue-50 p-1.5 transition-all duration-300 group-hover:scale-110 sm:p-2 dark:bg-blue-950/50'>
              <Users className='h-3 w-3 text-blue-500 sm:h-4 sm:w-4 dark:text-blue-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-lg font-bold text-blue-600 transition-colors duration-300 sm:text-xl md:text-2xl dark:text-blue-400'>
              {inUseCount.toString()}
            </div>
            <p className='text-muted-foreground truncate text-xs'>
              {`${stats.total_assets > 0 ? ((inUseCount / stats.total_assets) * 100).toFixed(1) : '0.0'}% of total assets`}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-amber-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCardActive('maintenance') ? 'scale-105 border border-amber-500 shadow-lg dark:border-amber-500' : ''
        }`}
        onClick={() => onStatClick('maintenance')}
      >
        {isCardActive('maintenance') && (
          <button
            onClick={(e) => handleRemoveFilterClick(e, 'status')}
            className='absolute -top-0.5 -right-0.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-amber-300 text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-amber-400 sm:h-5 sm:w-5 dark:bg-amber-700 dark:hover:bg-amber-600'
          >
            <X className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
          </button>
        )}
        <CardContent className='p-2.5 sm:p-3 md:p-4'>
          <div className='mb-1 flex items-center justify-between'>
            <CardTitle className='line-clamp-2 text-xs leading-tight font-medium text-gray-600 sm:text-sm dark:text-gray-400'>
              Under Maintenance
            </CardTitle>
            <div className='rounded-full bg-amber-50 p-1.5 transition-all duration-300 group-hover:scale-110 sm:p-2 dark:bg-amber-950/50'>
              <AlertTriangle className='h-3 w-3 text-amber-500 sm:h-4 sm:w-4 dark:text-amber-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-lg font-bold text-amber-600 transition-colors duration-300 sm:text-xl md:text-2xl dark:text-amber-400'>
              {underMaintenanceCount.toString()}
            </div>
            <p className='text-muted-foreground truncate text-xs'>
              {`${stats.total_assets > 0 ? ((underMaintenanceCount / stats.total_assets) * 100).toFixed(1) : '0.0'}% of total assets`}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-red-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCardActive('retired') ? 'scale-105 border border-red-500 shadow-lg dark:border-red-500' : ''
        }`}
        onClick={() => onStatClick('retired')}
      >
        {isCardActive('retired') && (
          <button
            onClick={(e) => handleRemoveFilterClick(e, 'status')}
            className='absolute -top-0.5 -right-0.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-300 text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-red-400 sm:h-5 sm:w-5 dark:bg-red-700 dark:hover:bg-red-600'
          >
            <X className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
          </button>
        )}
        <CardContent className='p-2.5 sm:p-3 md:p-4'>
          <div className='mb-1 flex items-center justify-between'>
            <CardTitle className='line-clamp-2 text-xs leading-tight font-medium text-gray-600 sm:text-sm dark:text-gray-400'>
              Retired/Disposed
            </CardTitle>
            <div className='rounded-full bg-red-50 p-1.5 transition-all duration-300 group-hover:scale-110 sm:p-2 dark:bg-red-950/50'>
              <StopCircle className='h-3 w-3 text-red-500 sm:h-4 sm:w-4 dark:text-red-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-lg font-bold text-red-600 transition-colors duration-300 sm:text-xl md:text-2xl dark:text-red-400'>
              {retiredAndDisposedCount.toString()}
            </div>
            <p className='text-muted-foreground truncate text-xs'>
              {`${stats.total_assets > 0 ? ((retiredAndDisposedCount / stats.total_assets) * 100).toFixed(1) : '0.0'}% of total assets`}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-indigo-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCategoryActive() ? 'scale-105 border border-indigo-500 shadow-lg dark:border-indigo-500' : ''
        }`}
      >
        {isCategoryActive() && (
          <button
            onClick={(e) => handleRemoveFilterClick(e, 'category')}
            className='absolute -top-0.5 -right-0.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-indigo-300 text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-indigo-400 sm:h-5 sm:w-5 dark:bg-indigo-700 dark:hover:bg-indigo-600'
          >
            <X className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
          </button>
        )}
        <CardContent className='p-2.5 sm:p-3 md:p-4'>
          <div className='mb-1 flex items-center justify-between'>
            <CardTitle className='line-clamp-2 text-xs leading-tight font-medium text-gray-600 sm:text-sm dark:text-gray-400'>
              Category
            </CardTitle>
            <div className='rounded-full bg-indigo-50 p-1.5 transition-all duration-300 group-hover:scale-110 sm:p-2 dark:bg-indigo-950/50'>
              <Box className='h-3 w-3 text-indigo-500 sm:h-4 sm:w-4 dark:text-indigo-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-lg font-bold text-indigo-600 transition-colors duration-300 sm:text-xl md:text-2xl dark:text-indigo-400'>
              {categoryCount.length}
            </div>
            <div className='text-muted-foreground truncate text-xs'>
              {categoryCount.map((category, index) => (
                <span
                  key={category}
                  className='cursor-pointer transition-colors duration-200 hover:text-indigo-600 hover:underline'
                  onClick={(e) => {
                    e.stopPropagation()
                    onCategoryClick(category)
                  }}
                >
                  {category}
                  {index < categoryCount.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-teal-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isDepartmentActive() ? 'scale-105 border border-teal-500 shadow-lg dark:border-teal-500' : ''
        }`}
      >
        {isDepartmentActive() && (
          <button
            onClick={(e) => handleRemoveFilterClick(e, 'department')}
            className='absolute -top-0.5 -right-0.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-teal-300 text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-teal-400 sm:h-5 sm:w-5 dark:bg-teal-700 dark:hover:bg-teal-600'
          >
            <X className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
          </button>
        )}
        <CardContent className='p-2.5 sm:p-3 md:p-4'>
          <div className='mb-1 flex items-center justify-between'>
            <CardTitle className='line-clamp-2 text-xs leading-tight font-medium text-gray-600 sm:text-sm dark:text-gray-400'>
              Department
            </CardTitle>
            <div className='rounded-full bg-teal-50 p-1.5 transition-all duration-300 group-hover:scale-110 sm:p-2 dark:bg-teal-950/50'>
              <Briefcase className='h-3 w-3 text-teal-500 sm:h-4 sm:w-4 dark:text-teal-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-lg font-bold text-teal-600 transition-colors duration-300 sm:text-xl md:text-2xl dark:text-teal-400'>
              {departmentCount.length}
            </div>
            <div className='text-muted-foreground truncate text-xs'>
              {departmentCount.map((department, index) => (
                <span
                  key={department}
                  className='cursor-pointer transition-colors duration-200 hover:text-teal-600 hover:underline'
                  onClick={(e) => {
                    e.stopPropagation()
                    onDepartmentClick(department)
                  }}
                >
                  {department}
                  {index < departmentCount.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
