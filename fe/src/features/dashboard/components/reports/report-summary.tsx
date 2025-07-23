import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { FileText } from 'lucide-react'
import type { DateFilter } from '../../model/statistics-types'
import type { MonthlyStats } from '../../model'
import { getDateRangeText } from '../../utils'

interface ReportSummaryProps {
  dateFilter: DateFilter
  monthlyStats: MonthlyStats
}

export const ReportSummary = ({ dateFilter, monthlyStats }: ReportSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className='text-primary flex items-center gap-2'>
            <FileText className='text-primary h-5 w-5' />
            Report Summary
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='mt-0 grid grid-cols-1 gap-2 text-sm md:grid-cols-2 lg:grid-cols-4'>
          <div>
            <div className='font-medium text-gray-700 dark:text-gray-200'>Report Period</div>
            <div>{getDateRangeText(dateFilter)}</div>
          </div>
          <div>
            <div className='font-medium text-gray-700 dark:text-gray-200'>Total Assets</div>
            <div>{monthlyStats.totalAssets} assets</div>
          </div>
          <div>
            <div className='font-medium text-gray-700 dark:text-gray-200'>Generated</div>
            <div>{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
