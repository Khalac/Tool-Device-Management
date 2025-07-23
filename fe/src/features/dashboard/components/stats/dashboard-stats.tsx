import { Card, CardContent } from '@/components/ui'
import { FileText } from 'lucide-react'
import { StatsOverviewCards } from './stats-overview-cards'
import { AssetStatusPieChart } from './asset-status-pie-chart'
import { RecentAssetsList } from './recent-assets-list'
import type { Asset } from './stats-overview-cards'

interface DashboardStatsProps {
  stats: {
    total_assets: number
  }
  assets: Asset[]
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
  if (!isPending && (!assets || assets.length === 0)) {
    return (
      <div className='space-y-4 sm:space-y-6'>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
          <Card>
            <CardContent className='p-3 sm:p-4'>
              <div className='text-muted-foreground flex items-center gap-2 text-xs font-medium sm:text-sm'>
                <FileText className='h-4 w-4 text-gray-400' />
                No Assets Available
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2'>
          <Card>
            <CardContent>
              <div className='text-muted-foreground flex h-[250px] items-center justify-center sm:h-[300px]'>
                <div className='flex flex-col items-center justify-center py-12'>
                  <FileText className='h-12 w-12 text-gray-400' />
                  <h3 className='mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100'>No data available</h3>
                  <p className='mt-2 text-gray-600 dark:text-gray-400'>
                    Try adjusting your filters to see more results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className='text-muted-foreground flex h-[250px] items-center justify-center sm:h-[300px]'>
                <div className='flex flex-col items-center justify-center py-12'>
                  <FileText className='h-12 w-12 text-gray-400' />
                  <h3 className='mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100'>No data available</h3>
                  <p className='mt-2 text-gray-600 dark:text-gray-400'>
                    Try adjusting your filters to see more results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      <StatsOverviewCards
        stats={stats}
        assets={assets}
        onStatClick={onStatClick}
        onCategoryClick={onCategoryClick}
        onDepartmentClick={onDepartmentClick}
        onRemoveFilter={onRemoveFilter}
        currentFilter={currentFilter}
        previousMonthStats={previousMonthStats}
      />

      <div className='grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2'>
        <AssetStatusPieChart
          assets={assets}
          isPending={isPending}
        />
        <RecentAssetsList
          assets={assets}
          isPending={isPending}
        />
      </div>
    </div>
  )
}

export default DashboardStats
