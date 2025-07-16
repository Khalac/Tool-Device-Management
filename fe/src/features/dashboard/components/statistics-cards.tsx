import { Card, CardContent, CardTitle } from '@/components/ui'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  Minus,
  Users,
  Briefcase,
  Box,
  StopCircle,
} from 'lucide-react'
import type { MonthlyStats } from '../model'
import { formatCurrency, formatNumber, formatPercentage } from '../utils'

interface StatisticsCardsProps {
  stats: MonthlyStats
  assets: Array<{
    id: number
    assetName: string
    status: string
    cost: number
    category: { categoryName: string; id?: number }
    department: { departmentName: string; id?: number }
  }>
  className?: string
  showComparison?: boolean
  comparisonData?: {
    previousValue: number
    growthRate: number
  }
  previousMonthStats?: MonthlyStats
  onStatClick?: (filterType: 'total' | 'new' | 'in-use' | 'maintenance' | 'retired') => void
  onCategoryClick?: (categoryName: string) => void
  onDepartmentClick?: (departmentName: string) => void
  currentFilter?: {
    status: string | null
    categoryId: string | null
    departmentId: string | null
  }
}

export const StatisticsCards = ({
  stats,
  assets,
  showComparison = false,
  comparisonData,
  previousMonthStats,
  onStatClick,
  onCategoryClick,
  onDepartmentClick,
  currentFilter,
}: StatisticsCardsProps) => {
  const getTrendIcon = (rate: number) => {
    if (rate > 0) return <TrendingUp className='h-3.5 w-3.5 text-green-500 sm:h-4 sm:w-4 dark:text-green-400' />
    if (rate < 0) return <TrendingDown className='h-3.5 w-3.5 text-red-500 sm:h-4 sm:w-4 dark:text-red-400' />
    return <Minus className='h-3.5 w-3.5 text-gray-500 sm:h-4 sm:w-4 dark:text-gray-400' />
  }

  const inUseCount = stats.statusDistribution.find((status) => status.status === 'In Use')?.count || 0
  const categoryCount = [...new Set(assets.map((asset) => asset.category.categoryName))]
  const departmentCount = [...new Set(assets.map((asset) => asset.department.departmentName))]

  const getTotalAssetsMessage = () => {
    if (!previousMonthStats || typeof previousMonthStats.totalAssets !== 'number') {
      return `Increased ${stats.totalAssets} assets compared to last month`
    }

    const difference = stats.totalAssets - previousMonthStats.totalAssets

    if (difference > 0) {
      return `Increased by ${difference} assets compared to last month`
    } else if (difference < 0) {
      return `Decreased by ${Math.abs(difference)} assets compared to last month`
    } else {
      return 'No change compared to last month'
    }
  }

  const getTotalValueMessage = () => {
    if (!previousMonthStats || typeof previousMonthStats.totalValue !== 'number') {
      return `Increased ${formatCurrency(stats.totalValue)} compared to last month`
    }

    const difference = stats.totalValue - previousMonthStats.totalValue

    if (difference > 0) {
      return `Increased by ${formatCurrency(difference)} compared to last month`
    } else if (difference < 0) {
      return `Decreased by ${formatCurrency(Math.abs(difference))} compared to last month`
    } else {
      return 'No change compared to last month'
    }
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

  const isCategoryActive = () => {
    return currentFilter?.categoryId !== null
  }

  const isDepartmentActive = () => {
    return currentFilter?.departmentId !== null
  }

  return (
    <div className='xs:grid-cols-2 max-w-[430px]:grid-cols-1 grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4 lg:grid-cols-8'>
      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-cyan-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
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
              {stats.totalAssets.toString()}
            </div>
            <p className='text-muted-foreground truncate text-xs'>{getTotalAssetsMessage()}</p>
            {showComparison && comparisonData && (
              <div className='flex items-center text-xs text-gray-600 dark:text-gray-400'>
                {getTrendIcon(comparisonData.growthRate)}
                <span className='ml-1 truncate'>
                  {formatPercentage(Math.abs(comparisonData.growthRate))} from last period
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className='dark:bg-card group relative w-full overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-green-500 dark:border-gray-700'>
        <CardContent className='p-2.5 sm:p-3 md:p-4'>
          <div className='mb-1 flex items-center justify-between'>
            <CardTitle className='line-clamp-2 text-xs leading-tight font-medium text-gray-600 sm:text-sm dark:text-gray-400'>
              Total Value
            </CardTitle>
            <div className='rounded-full bg-green-50 p-1.5 transition-all duration-300 group-hover:scale-110 sm:p-2 dark:bg-green-950/50'>
              <DollarSign className='h-3 w-3 text-green-500 sm:h-4 sm:w-4 dark:text-green-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-lg font-bold text-green-600 transition-colors duration-300 sm:text-xl md:text-2xl dark:text-green-400'>
              {formatCurrency(stats.totalValue)}
            </div>
            <p className='text-muted-foreground truncate text-xs'>{getTotalValueMessage()}</p>

            {showComparison && comparisonData && (
              <div className='flex items-center text-xs text-gray-600 dark:text-gray-400'>
                {getTrendIcon(comparisonData.growthRate)}
                <span className='ml-1 truncate'>
                  {formatPercentage(Math.abs(comparisonData.growthRate))} from last period
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-emerald-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCardActive('new') ? 'scale-105 border border-emerald-500 shadow-lg dark:border-emerald-500' : ''
        }`}
        onClick={() => onStatClick?.('new')}
      >
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
              {formatNumber(stats.newAssetsCount)}
            </div>
            <p className='text-muted-foreground truncate text-xs'>
              {`${stats.totalAssets > 0 ? ((stats.newAssetsCount / stats.totalAssets) * 100).toFixed(1) : '0.0'}% of total assets`}
            </p>

            {showComparison && comparisonData && (
              <div className='flex items-center text-xs text-gray-600 dark:text-gray-400'>
                {getTrendIcon(comparisonData.growthRate)}
                <span className='ml-1 truncate'>
                  {formatPercentage(Math.abs(comparisonData.growthRate))} from last period
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-blue-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCardActive('in-use') ? 'scale-105 border border-blue-500 shadow-lg dark:border-blue-500' : ''
        }`}
        onClick={() => onStatClick?.('in-use')}
      >
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
              {formatNumber(inUseCount)}
            </div>
            <p className='text-muted-foreground truncate text-xs'>
              {`${stats.totalAssets > 0 ? ((inUseCount / stats.totalAssets) * 100).toFixed(1) : '0.0'}% of total assets`}
            </p>

            {showComparison && comparisonData && (
              <div className='flex items-center text-xs text-gray-600 dark:text-gray-400'>
                {getTrendIcon(comparisonData.growthRate)}
                <span className='ml-1 truncate'>
                  {formatPercentage(Math.abs(comparisonData.growthRate))} from last period
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-amber-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCardActive('maintenance') ? 'scale-105 border border-amber-500 shadow-lg dark:border-amber-500' : ''
        }`}
        onClick={() => onStatClick?.('maintenance')}
      >
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
              {formatNumber(stats.maintenanceCount)}
            </div>
            <p className='text-muted-foreground truncate text-xs'>
              {`${stats.totalAssets > 0 ? ((stats.maintenanceCount / stats.totalAssets) * 100).toFixed(1) : '0.0'}% of total assets`}
            </p>

            {showComparison && comparisonData && (
              <div className='flex items-center text-xs text-gray-600 dark:text-gray-400'>
                {getTrendIcon(comparisonData.growthRate)}
                <span className='ml-1 truncate'>
                  {formatPercentage(Math.abs(comparisonData.growthRate))} from last period
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-red-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCardActive('retired') ? 'scale-105 border border-red-500 shadow-lg dark:border-red-500' : ''
        }`}
        onClick={() => onStatClick?.('retired')}
      >
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
              {formatNumber(stats.retiredAssetsCount)}
            </div>
            <p className='text-muted-foreground truncate text-xs'>
              {`${stats.totalAssets > 0 ? ((stats.retiredAssetsCount / stats.totalAssets) * 100).toFixed(1) : '0.0'}% of total assets`}
            </p>

            {showComparison && comparisonData && (
              <div className='flex items-center text-xs text-gray-600 dark:text-gray-400'>
                {getTrendIcon(comparisonData.growthRate)}
                <span className='ml-1 truncate'>
                  {formatPercentage(Math.abs(comparisonData.growthRate))} from last period
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-indigo-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isCategoryActive() ? 'scale-105 border border-indigo-500 shadow-lg dark:border-indigo-500' : ''
        }`}
      >
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
              {formatNumber(categoryCount.length)}
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

            {showComparison && comparisonData && (
              <div className='flex items-center text-xs text-gray-600 dark:text-gray-400'>
                {getTrendIcon(comparisonData.growthRate)}
                <span className='ml-1 truncate'>
                  {formatPercentage(Math.abs(comparisonData.growthRate))} from last period
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card
        className={`dark:bg-card group relative w-full cursor-pointer overflow-hidden py-2 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-br-lg after:rounded-bl-lg after:bg-teal-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 ${
          isDepartmentActive() ? 'scale-105 border border-teal-500 shadow-lg dark:border-teal-500' : ''
        }`}
      >
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
              {formatNumber(departmentCount.length)}
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

            {showComparison && comparisonData && (
              <div className='flex items-center text-xs text-gray-600 dark:text-gray-400'>
                {getTrendIcon(comparisonData.growthRate)}
                <span className='ml-1 truncate'>
                  {formatPercentage(Math.abs(comparisonData.growthRate))} from last period
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
