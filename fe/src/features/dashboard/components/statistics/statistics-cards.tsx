import { MonthlyStatsCards } from './monthly-stats-cards'
import type { MonthlyStats } from '../../model'

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
  previousMonthStats,
  onStatClick,
  onCategoryClick,
  onDepartmentClick,
  currentFilter,
}: StatisticsCardsProps) => {
  return (
    <MonthlyStatsCards
      stats={stats}
      assets={assets}
      previousMonthStats={previousMonthStats}
      onStatClick={onStatClick}
      onCategoryClick={onCategoryClick}
      onDepartmentClick={onDepartmentClick}
      currentFilter={currentFilter}
    />
  )
}
