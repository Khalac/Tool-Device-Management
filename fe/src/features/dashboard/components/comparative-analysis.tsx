import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { TrendingUp, TrendingDown, Minus, GitCompare } from 'lucide-react'
import type { ComparisonData } from '../model'
import { formatCurrency, formatNumber, formatPercentage } from '../utils'

interface ComparativeAnalysisProps {
  comparisonData: ComparisonData
  className?: string
}

export const ComparativeAnalysis = ({ comparisonData, className = '' }: ComparativeAnalysisProps) => {
  const { currentPeriod, previousPeriod, yearOverYear, growthRate } = comparisonData

  const getTrendIcon = (rate: number) => {
    if (rate > 5) return <TrendingUp className='h-5 w-5 text-green-500 dark:text-green-400' />
    if (rate < -5) return <TrendingDown className='h-5 w-5 text-red-500 dark:text-red-400' />
    return <Minus className='h-5 w-5 text-gray-500 dark:text-gray-400' />
  }

  const getTrendColor = (rate: number) => {
    if (rate > 5) return 'text-green-600 dark:text-green-400'
    if (rate < -5) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const comparisonMetrics = [
    {
      title: 'Total Assets',
      current: formatNumber(currentPeriod.totalAssets),
      previous: formatNumber(previousPeriod.totalAssets),
      yoy: formatNumber(yearOverYear.totalAssets),
      growth: growthRate.assets,
    },
    {
      title: 'Total Value',
      current: formatCurrency(currentPeriod.totalValue),
      previous: formatCurrency(previousPeriod.totalValue),
      yoy: formatCurrency(yearOverYear.totalValue),
      growth: growthRate.value,
    },
    {
      title: 'New Assets',
      current: formatNumber(currentPeriod.newAssetsCount),
      previous: formatNumber(previousPeriod.newAssetsCount),
      yoy: formatNumber(yearOverYear.newAssetsCount),
      growth:
        ((currentPeriod.newAssetsCount - previousPeriod.newAssetsCount) / (previousPeriod.newAssetsCount || 1)) * 100,
    },
    {
      title: 'In Use',
      current: formatNumber(currentPeriod.inUseCount),
      previous: formatNumber(previousPeriod.inUseCount),
      yoy: formatNumber(yearOverYear.inUseCount),
      growth: ((currentPeriod.inUseCount - previousPeriod.inUseCount) / (previousPeriod.inUseCount || 1)) * 100,
    },
    {
      title: 'Under Maintenance',
      current: formatNumber(currentPeriod.maintenanceCount),
      previous: formatNumber(previousPeriod.maintenanceCount),
      yoy: formatNumber(yearOverYear.maintenanceCount),
      growth:
        ((currentPeriod.maintenanceCount - previousPeriod.maintenanceCount) / (previousPeriod.maintenanceCount || 1)) *
        100,
    },
    {
      title: 'Retired/Disposed',
      current: formatNumber(currentPeriod.retiredAssetsCount),
      previous: formatNumber(previousPeriod.retiredAssetsCount),
      yoy: formatNumber(yearOverYear.retiredAssetsCount),
      growth:
        ((currentPeriod.retiredAssetsCount - previousPeriod.retiredAssetsCount) /
          (previousPeriod.retiredAssetsCount || 1)) *
        100,
    },
  ]

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      <Card className='transition-all duration-200 dark:border-gray-700 dark:bg-gray-800/50'>
        <CardHeader>
          <CardTitle className='text-primary flex items-center gap-2 text-lg sm:text-xl dark:text-gray-200'>
            <GitCompare className='text-primary h-5 w-5' />
            Period Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='border-b dark:border-gray-700'>
                  <th className='p-2 text-left text-xs font-semibold sm:p-3 sm:text-sm dark:text-gray-300'>Metric</th>
                  <th className='p-2 text-left text-xs font-semibold sm:p-3 sm:text-sm dark:text-gray-300'>
                    Current Period
                  </th>
                  <th className='p-2 text-left text-xs font-semibold sm:p-3 sm:text-sm dark:text-gray-300'>
                    Previous Period
                  </th>
                  <th className='p-2 text-left text-xs font-semibold sm:p-3 sm:text-sm dark:text-gray-300'>
                    Year over Year
                  </th>
                  <th className='p-2 text-left text-xs font-semibold sm:p-3 sm:text-sm dark:text-gray-300'>Growth</th>
                </tr>
              </thead>
              <tbody>
                {comparisonMetrics.map((metric, index) => (
                  <tr
                    key={metric.title}
                    className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800/50'}
                  >
                    <td className='p-2 text-xs font-medium sm:p-3 sm:text-sm dark:text-gray-200'>{metric.title}</td>
                    <td className='p-2 text-left text-xs text-gray-900 sm:p-3 sm:text-sm dark:text-gray-300'>
                      {metric.current}
                    </td>
                    <td className='p-2 text-left text-xs text-gray-900 sm:p-3 sm:text-sm dark:text-gray-300'>
                      {metric.previous}
                    </td>
                    <td className='p-2 text-left text-xs text-gray-900 sm:p-3 sm:text-sm dark:text-gray-300'>
                      {metric.yoy}
                    </td>
                    <td className='p-2 text-left sm:p-3'>
                      <div className='flex gap-1 text-left'>
                        {getTrendIcon(metric.growth)}
                        <span className={`text-xs font-medium sm:text-sm ${getTrendColor(metric.growth)}`}>
                          {formatPercentage(Math.abs(metric.growth))}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Card className='gap-0 transition-all duration-200 dark:border-gray-700 dark:bg-gray-800/50'>
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 text-base sm:text-lg ${
                growthRate.assets > 0
                  ? 'text-green-600 dark:text-green-400'
                  : growthRate.assets < 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-800 dark:text-white'
              }`}
            >
              {getTrendIcon(growthRate.assets)}
              Asset Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='text-xl font-bold sm:text-2xl dark:text-white'>
                {formatPercentage(Math.abs(growthRate.assets))}
              </div>
              <div className='text-xs text-gray-600 sm:text-sm dark:text-gray-400'>
                {growthRate.assets > 0 ? 'Increase' : growthRate.assets < 0 ? 'Decrease' : 'No change'} from previous
                period
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='gap-0 transition-all duration-200 dark:border-gray-700 dark:bg-gray-800/50'>
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 text-base sm:text-lg ${
                growthRate.value > 0
                  ? 'text-green-600 dark:text-green-400'
                  : growthRate.value < 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-800 dark:text-white'
              }`}
            >
              {getTrendIcon(growthRate.value)}
              Value Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='text-xl font-bold sm:text-2xl dark:text-white'>
                {formatPercentage(Math.abs(growthRate.value))}
              </div>
              <div className='text-xs text-gray-600 sm:text-sm dark:text-gray-400'>
                {growthRate.value > 0 ? 'Increase' : growthRate.value < 0 ? 'Decrease' : 'No change'} from previous
                period
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
