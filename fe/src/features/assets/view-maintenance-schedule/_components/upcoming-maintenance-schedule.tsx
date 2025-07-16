import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@/components/ui'
import { Calendar, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import type { MaintenanceSchedule } from '../model'

export const UpcomingMaintenanceSchedule = ({ upcoming }: { upcoming: MaintenanceSchedule[] }) => {
  const nextMaintenance = upcoming[0]
  if (upcoming.length === 0)
    return (
      <Card className='border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg text-sky-700 dark:text-sky-400'>No Upcoming Maintenance Scheduled</CardTitle>
          <CardDescription className='text-gray-500 dark:text-gray-400'>All assets are up to date.</CardDescription>
        </CardHeader>
      </Card>
    )
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
      case 'under-maintenance':
        return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
      case 'in-use':
        return 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-200'
      case 'disposed':
        return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-200'
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
    }
  }
  return (
    <Card className='border-gray-200 bg-blue-50 dark:border-gray-800 dark:bg-gray-900/70'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center text-lg text-sky-700 dark:text-sky-400'>
          <Calendar className='mr-2 h-5 w-5 text-sky-700 dark:text-sky-400' />
          Next Scheduled Maintenance
        </CardTitle>
        <CardDescription className='text-sky-500 dark:text-sky-300'>
          Scheduled for {format(new Date(nextMaintenance.startDate), 'MMMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col justify-between gap-4 md:flex-row'>
          <div>
            <p className='text-lg font-medium text-gray-900 dark:text-gray-100'>{nextMaintenance.asset.assetName}</p>
            <div className='mt-1 flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-sky-600 dark:text-sky-400' />
              <span className='text-sm text-sky-700 dark:text-sky-300'>
                {format(new Date(nextMaintenance.startDate), 'MMMM d, yyyy')} -{' '}
                {format(new Date(nextMaintenance.endDate), 'MMMM d, yyyy')}
              </span>
            </div>
            <div className='mt-2'>
              <Badge
                variant='outline'
                className={getStatusColor(nextMaintenance.asset.status)}
              >
                {nextMaintenance.asset.status}
              </Badge>
            </div>
          </div>
          <Button className='bg-sky-100 text-sky-700 hover:bg-sky-200 hover:text-sky-800 dark:bg-sky-900 dark:text-sky-200 dark:hover:bg-sky-800'>
            <Link
              to={`/assets/${nextMaintenance.asset.id}`}
              className='flex items-center'
            >
              View Asset Details
              <ChevronRight className='ml-1 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
