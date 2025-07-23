import { Button, CardHeader, CardTitle } from '@/components/ui'
import { FileText, FilterX } from 'lucide-react'
import type { DateFilter } from '../../model/statistics-types'
import type { MonthlyStats } from '../../model'
import type { AssetsType } from '@/features/assets/view-all-assets/model'
import { ExportMonthlyReport } from '@/components/ui/export/export-monthly-report'
import { getDateRangeText } from '../../utils'

interface ReportHeaderProps {
  dateFilter: DateFilter
  monthlyStats: MonthlyStats
  filteredAssets: AssetsType[]
  hasActiveFilters: boolean
  onClearAllFilters: () => void
  onExport: (format: 'pdf' | 'csv' | 'html') => void
}

export const ReportHeader = ({
  dateFilter,
  monthlyStats,
  filteredAssets,
  hasActiveFilters,
  onClearAllFilters,
  onExport,
}: ReportHeaderProps) => {
  return (
    <CardHeader>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <CardTitle className='text-primary flex items-center gap-2 text-2xl'>
          <FileText className='text-primary h-6 w-6' />
          Reports - {getDateRangeText(dateFilter)}
        </CardTitle>

        <div className='flex items-center gap-2'>
          {hasActiveFilters && (
            <Button
              variant='outline'
              size='default'
              onClick={onClearAllFilters}
              className='flex h-9 items-center gap-2 px-4'
              type='button'
            >
              <FilterX className='h-4 w-4' />
              Clear Filters
            </Button>
          )}

          <div className='flex h-10 items-center'>
            <ExportMonthlyReport
              data={monthlyStats}
              assets={filteredAssets}
              dateFilter={dateFilter}
              onExport={onExport}
            />
          </div>
        </div>
      </div>
    </CardHeader>
  )
}
