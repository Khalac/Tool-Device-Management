import { Card, CardContent } from '@/components/ui'
import { Calendar, FileText } from 'lucide-react'
import type { AssetsType } from '@/features/assets/view-all-assets/model'
import type { FilterType } from '../../../assets/view-all-assets/model'
import type { MonthlyStats } from '../../model'
import { TrendCharts } from '../trend-charts'
import { ComparativeAnalysis } from '../comparative-analysis'
import { StatisticsCards } from '../statistics/statistics-cards'

interface ReportContentProps {
  activeTab: 'overview' | 'comparison'
  filteredAssets: AssetsType[]
  assets: AssetsType[]
  assetFilter: FilterType
  monthlyStats: MonthlyStats
  trendData: any
  comparisonData: any
  onStatClick: (filterType: 'total' | 'new' | 'in-use' | 'maintenance' | 'retired') => void
  onCategoryClick: (categoryName: string) => void
  onDepartmentClick: (departmentName: string) => void
}

export const ReportContent = ({
  activeTab,
  filteredAssets,
  assetFilter,
  monthlyStats,
  trendData,
  comparisonData,
  onStatClick,
  onCategoryClick,
  onDepartmentClick,
}: ReportContentProps) => {
  if (filteredAssets.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <FileText className='h-12 w-12 text-gray-400' />
        <h3 className='mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100'>No data available</h3>
        <p className='mt-2 text-gray-600 dark:text-gray-400'>Try adjusting your filters to see more results.</p>
      </div>
    )
  }

  if (activeTab === 'overview') {
    return (
      <div className='space-y-6'>
        <StatisticsCards
          onCategoryClick={onCategoryClick}
          onDepartmentClick={onDepartmentClick}
          onStatClick={onStatClick}
          currentFilter={assetFilter}
          assets={filteredAssets}
          stats={monthlyStats}
          showComparison={!!comparisonData}
          comparisonData={
            comparisonData
              ? {
                  previousValue: comparisonData.previousPeriod.totalAssets,
                  growthRate: comparisonData.growthRate.assets,
                }
              : undefined
          }
        />

        {filteredAssets.length > 0 && (
          <TrendCharts
            trendData={trendData}
            departmentData={monthlyStats.departmentBreakdown}
            statusData={monthlyStats.statusDistribution}
          />
        )}
      </div>
    )
  }

  if (activeTab === 'comparison') {
    if (comparisonData) {
      return <ComparativeAnalysis comparisonData={comparisonData} />
    } else {
      return (
        <Card>
          <CardContent className='py-8'>
            <div className='text-center text-gray-500'>
              <Calendar className='mx-auto mb-4 h-12 w-12 text-gray-300' />
              <h3 className='mb-2 text-lg font-medium'>Comparison requires specific month and year</h3>
              <p className='text-sm'>Please select both month and year to view comparison data.</p>
            </div>
          </CardContent>
        </Card>
      )
    }
  }

  return null
}
