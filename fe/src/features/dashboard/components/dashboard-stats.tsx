import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { ReusablePieChart } from '@/components/ui/charts/pie-chart'
import {
  Package,
  CheckCircle,
  Users,
  AlertTriangle,
  ClockIcon,
  Loader2,
  PieChart,
  Box,
  Briefcase,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface DashboardStatsProps {
  stats: {
    total_assets: number
  }
  assets: Array<{
    id: number
    assetName: string
    status: string
    cost: number
    category: { categoryName: string; id?: number }
    department: { departmentName: string; id?: number }
  }>
  isPending: boolean
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
    category: { categoryName: string }
    department: { departmentName: string }
  }
}

export const DashboardStats = ({
  stats,
  assets,
  isPending,
  onStatClick,
  onCategoryClick,
  onDepartmentClick,
  onRemoveFilter,
  currentFilter,
  previousMonthStats,
}: DashboardStatsProps) => {
  const navigate = useNavigate()

  if (!isPending && (!assets || assets.length === 0)) {
    return (
      <div className='space-y-4 sm:space-y-6'>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
          <Card>
            <CardContent className='p-3 sm:p-4'>
              <div className='text-muted-foreground text-xs font-medium sm:text-sm'>No Assets Available</div>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader className='pb-3 sm:pb-6'>
              <CardTitle className='text-base sm:text-lg'>Asset Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-muted-foreground flex h-[250px] items-center justify-center sm:h-[300px]'>
                <div className='text-center'>
                  <p className='text-sm font-medium sm:text-lg'>No results.</p>
                  <p className='text-xs sm:text-sm'>Try adjusting your filters or create a new asset.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-3 sm:pb-6'>
              <CardTitle className='text-base sm:text-lg'>
                <div className='flex items-center gap-2'>
                  <ClockIcon className='h-5 w-5' />
                  Recent Purchased Assets
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-muted-foreground flex h-[250px] items-center justify-center sm:h-[300px]'>
                <div className='text-center'>
                  <p className='text-sm font-medium sm:text-lg'>No assets found.</p>
                  <p className='text-xs sm:text-sm'>Assets will appear here once available.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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

  const pieChartData = [
    { name: 'In Use', value: inUseCount },
    { name: 'Under Maintenance', value: underMaintenanceCount },
    { name: 'Retired / Disposed', value: retiredAndDisposedCount },
    { name: 'New', value: newCount },
  ]

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
    <div className='space-y-4 sm:space-y-6'>
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

      <div className='grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2'>
        <ReusablePieChart
          icon={<PieChart className='h-5 w-5' />}
          data={pieChartData}
          title='Asset Status Distribution'
          isPending={isPending}
          showAnimation={true}
          animationDelay={2000}
        />

        <Card className='transition-shadow duration-200 hover:shadow-lg'>
          <CardHeader className='pb-0 sm:pb-0'>
            <CardTitle className='text-base sm:text-lg'>
              <div className='flex items-center gap-2'>
                <ClockIcon className='h-5 w-5' />
                Recent Purchased Assets
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className='flex h-[250px] items-center justify-center sm:h-[300px] lg:h-[350px]'>
                <Loader2 className='h-6 w-6 animate-spin sm:h-8 sm:w-8' />
              </div>
            ) : (
              <div className='space-y-3 sm:space-y-4'>
                {assets
                  .sort((a, b) => a.id - b.id)
                  .slice(0 - 5)
                  .reverse()
                  .map((asset) => (
                    <div
                      className='hover:bg-muted/50 flex items-center rounded-lg border border-transparent p-2 transition-all duration-200 hover:cursor-pointer hover:shadow-md sm:p-3'
                      key={asset.id}
                      onClick={() => navigate(`/assets/${asset.id}`)}
                    >
                      <div className='min-w-0 flex-1 space-y-1'>
                        <p className='truncate text-xs leading-none font-medium sm:text-sm'>{asset.assetName}</p>
                        <p className='text-muted-foreground truncate text-xs sm:text-sm'>
                          {asset.category.categoryName} • {asset.status} • ${asset.cost}
                        </p>
                      </div>
                      <div className='ml-2 min-w-0 flex-shrink-0 text-right text-xs font-medium sm:ml-4 sm:text-sm'>
                        <span className='truncate'>{asset.department.departmentName || 'No Department'} </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardStats
