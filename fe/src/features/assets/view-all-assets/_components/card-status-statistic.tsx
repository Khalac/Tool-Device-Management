import { Card, CardContent, CardTitle } from '@/components/ui'
import { Package, CheckCircle, Users, AlertTriangle, X, Box, Briefcase } from 'lucide-react'
import type { AssetsType } from '../model'

interface CardStatusStatisticProps {
  isPending: boolean
  assets: AssetsType[]
  currentFilter?: {
    status: string | null
    categoryId: string | null
    departmentId: string | null
  }
  onRemoveFilter?: (filterType: 'status' | 'category' | 'department') => void
  onStatClick?: (filterType: 'total' | 'new' | 'in-use' | 'maintenance' | 'retired') => void
  onCategoryClick?: (categoryName: string) => void
  onDepartmentClick?: (departmentName: string) => void
}

export const CardStatusStatistic = ({
  assets,
  currentFilter,
  onRemoveFilter,
  onStatClick,
  onCategoryClick,
  onDepartmentClick,
}: CardStatusStatisticProps) => {
  if (assets.length === 0) {
    return (
      <div className='mb-6 grid grid-cols-2 gap-4 md:grid-cols-5'>
        <Card>
          <CardContent className='p-4'>
            <div className='text-muted-foreground text-sm font-medium'>No Assets Available</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const newCount = assets.filter((asset) => asset.status === 'New').length
  const inUseCount = assets.filter((asset) => asset.status === 'In Use').length
  const underMaintenanceCount = assets.filter((asset) => asset.status === 'Under Maintenance').length
  const retiredAndDisposedCount = assets.filter((asset) => ['Retired', 'Disposed'].includes(asset.status)).length
  const categoryCount = [...new Set(assets.map((asset) => asset.category.categoryName))]
  const departmentCount = [...new Set(assets.map((asset) => asset.department.departmentName))]

  const handleRemoveFilterClick = (e: React.MouseEvent, filterType: 'status' | 'category' | 'department') => {
    e.stopPropagation()
    onRemoveFilter?.(filterType)
  }

  const isCardActive = (filterType: string) => {
    switch (filterType) {
      case 'total':
        return currentFilter?.status === null
      case 'new':
        return currentFilter?.status === 'New'
      case 'in-use':
        return currentFilter?.status === 'In Use'
      case 'maintenance':
        return currentFilter?.status === 'Under Maintenance'
      case 'retired':
        return currentFilter?.status === 'Disposed' || currentFilter?.status === 'Retired'
      default:
        return false
    }
  }

  const isCategoryActive = () => currentFilter?.categoryId !== null
  const isDepartmentActive = () => currentFilter?.departmentId !== null

  return (
    <div className='xs:grid-cols-2 max-w-[430px]:grid-cols-1 grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4 lg:grid-cols-7'>
      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-cyan-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCardActive('total') ? 'scale-105 border border-cyan-500 shadow-lg dark:border-cyan-500' : ''
        }`}
        onClick={() => onStatClick?.('total')}
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
              {assets.length.toString()}
            </div>
            <p className='text-muted-foreground truncate text-xs'>
              {`${assets.length > 0 ? ((assets.length / assets.length) * 100).toFixed(1) : '0.0'}% of total assets`}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-emerald-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCardActive('new') ? 'scale-105 border border-emerald-500 shadow-lg dark:border-emerald-500' : ''
        }`}
        onClick={() => onStatClick?.('new')}
      >
        {isCardActive('new') && (
          <button
            onClick={(e) => handleRemoveFilterClick(e, 'status')}
            className='absolute -top-0.5 -right-0.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-400 text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-red-500 sm:h-5 sm:w-5'
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
              {`${assets.length > 0 ? ((newCount / assets.length) * 100).toFixed(1) : '0.0'}% of total assets`}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-blue-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCardActive('in-use') ? 'scale-105 border border-blue-500 shadow-lg dark:border-blue-500' : ''
        }`}
        onClick={() => onStatClick?.('in-use')}
      >
        {isCardActive('in-use') && (
          <button
            onClick={(e) => handleRemoveFilterClick(e, 'status')}
            className='absolute -top-0.5 -right-0.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-400 text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-red-500 sm:h-5 sm:w-5'
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
              {`${assets.length > 0 ? ((inUseCount / assets.length) * 100).toFixed(1) : '0.0'}% of total assets`}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-amber-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCardActive('maintenance') ? 'scale-105 border border-amber-500 shadow-lg dark:border-amber-500' : ''
        }`}
        onClick={() => onStatClick?.('maintenance')}
      >
        {isCardActive('maintenance') && (
          <button
            onClick={(e) => handleRemoveFilterClick(e, 'status')}
            className='absolute -top-0.5 -right-0.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-400 text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-red-500 sm:h-5 sm:w-5'
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
              {`${assets.length > 0 ? ((underMaintenanceCount / assets.length) * 100).toFixed(1) : '0.0'}% of total assets`}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-red-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCardActive('retired') ? 'scale-105 border border-red-500 shadow-lg dark:border-red-500' : ''
        }`}
        onClick={() => onStatClick?.('retired')}
      >
        {isCardActive('retired') && (
          <button
            onClick={(e) => handleRemoveFilterClick(e, 'status')}
            className='absolute -top-0.5 -right-0.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-400 text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-red-500 sm:h-5 sm:w-5'
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
              <X className='h-3 w-3 text-red-500 sm:h-4 sm:w-4 dark:text-red-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-lg font-bold text-red-600 transition-colors duration-300 sm:text-xl md:text-2xl dark:text-red-400'>
              {retiredAndDisposedCount.toString()}
            </div>
            <p className='text-muted-foreground truncate text-xs'>
              {`${assets.length > 0 ? ((retiredAndDisposedCount / assets.length) * 100).toFixed(1) : '0.0'}% of total assets`}
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
            className='absolute -top-0.5 -right-0.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-400 text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-red-500 sm:h-5 sm:w-5'
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
              {categoryCount.length.toString()}
            </div>
            <div className='text-muted-foreground truncate text-xs'>
              {categoryCount.map((category, index) => (
                <span
                  key={category}
                  className='cursor-pointer transition-colors duration-200 hover:text-indigo-600 hover:underline'
                  onClick={(e) => {
                    e.stopPropagation()
                    onCategoryClick?.(category)
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
            className='absolute -top-0.5 -right-0.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-400 text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-red-500 sm:h-5 sm:w-5'
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
              {departmentCount.length.toString()}
            </div>
            <div className='text-muted-foreground truncate text-xs'>
              {departmentCount.map((department, index) => (
                <span
                  key={department}
                  className='cursor-pointer transition-colors duration-200 hover:text-teal-600 hover:underline'
                  onClick={(e) => {
                    e.stopPropagation()
                    onDepartmentClick?.(department)
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
