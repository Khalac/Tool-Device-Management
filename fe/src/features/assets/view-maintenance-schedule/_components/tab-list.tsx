import { TabsList, TabsTrigger, Badge } from '@/components'
import type { MaintenanceSchedule } from '../model'

export const TabList = ({
  schedules,
  upcoming,
  inProgress,
}: {
  schedules: MaintenanceSchedule[]
  upcoming: MaintenanceSchedule[]
  inProgress: MaintenanceSchedule[]
}) => {
  return (
    <TabsList className='grid w-full grid-cols-3 md:w-auto'>
      <TabsTrigger
        value='all'
        className='flex items-center justify-center gap-1 px-2 text-xs sm:text-sm md:text-base'
      >
        <span className='truncate'>All</span>
        <Badge
          variant='secondary'
          className='min-w-0 shrink-0 text-xs'
        >
          {schedules.length}
        </Badge>
      </TabsTrigger>

      <TabsTrigger
        value='upcoming'
        className='flex items-center justify-center gap-1 px-2 text-xs sm:text-sm md:text-base'
      >
        <span className='truncate'>Scheduled</span>
        <Badge
          variant='secondary'
          className='min-w-0 shrink-0 text-xs'
        >
          {upcoming.length}
        </Badge>
      </TabsTrigger>

      <TabsTrigger
        value='in-progress'
        className='flex items-center justify-center gap-1 px-2 text-xs sm:text-sm md:text-base'
      >
        <span className='truncate'>Under Maintenance</span>
        <Badge
          variant='secondary'
          className='min-w-0 shrink-0 text-xs'
        >
          {inProgress.length}
        </Badge>
      </TabsTrigger>
    </TabsList>
  )
}
