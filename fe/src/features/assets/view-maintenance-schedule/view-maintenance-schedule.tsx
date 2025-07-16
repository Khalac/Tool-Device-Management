import { useState, useEffect } from 'react'
import { Tabs, Button, Skeleton } from '@/components/ui'
import { ArrowDownUp, Wrench } from 'lucide-react'
import type { MaintenanceSchedule } from './model/type'
import { getData } from '@/utils'
import { getAllMaintenanceSchedules } from '../api'
import {
  TabAllSchedules,
  TabList,
  TabUpcomingSchedules,
  UpcomingMaintenanceSchedule,
  TabUnderMaintenance,
} from './_components'

const ViewMaintenanceSchedule = () => {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [upcoming, setUpcoming] = useState<MaintenanceSchedule[]>([])
  const [inProgress, setInProgress] = useState<MaintenanceSchedule[]>([])

  const fetchMaintenanceSchedules = async () => {
    setIsLoading(true)
    await getData(getAllMaintenanceSchedules, setSchedules)
    setIsLoading(false)
  }
  const getSchedulesData = (allSchedules: MaintenanceSchedule[]) => {
    const upcomingSchedule = allSchedules.filter(
      (schedule) =>
        schedule.asset.status !== 'Under Maintenance' &&
        schedule.asset.status !== 'Retired' &&
        schedule.asset.status !== 'Disposed'
    )
    const inProgress = allSchedules.filter((schedule) => schedule.asset.status === 'Under Maintenance')
    upcomingSchedule.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    setInProgress(inProgress)
    setUpcoming(upcomingSchedule)
  }

  useEffect(() => {
    fetchMaintenanceSchedules()
  }, [])
  useEffect(() => {
    if (schedules.length > 0) {
      getSchedulesData(schedules)
    }
  }, [schedules])

  return (
    <div className='container mx-auto space-y-6 px-4 py-6'>
      <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h1 className='text-primary flex items-center text-2xl font-bold'>
            <Wrench className='text-primary mr-2 h-6 w-6' />
            Asset Maintenance Schedule
          </h1>
          <p className='text-primary'>View and manage maintenance schedules for all assets</p>
        </div>

        <Button
          variant='outline'
          onClick={fetchMaintenanceSchedules}
        >
          <ArrowDownUp className='h-4 w-4' />
          Refresh
        </Button>
      </div>

      {isLoading ? <Skeleton className='h-36 w-full' /> : <UpcomingMaintenanceSchedule upcoming={upcoming} />}

      <Tabs defaultValue='all'>
        <TabList
          schedules={schedules}
          upcoming={upcoming}
          inProgress={inProgress}
        />
        <TabAllSchedules
          isLoading={isLoading}
          schedules={schedules}
          onSuccess={fetchMaintenanceSchedules}
        />

        <TabUpcomingSchedules
          isLoading={isLoading}
          upcoming={upcoming}
          onSuccess={fetchMaintenanceSchedules}
        />
        <TabUnderMaintenance
          isLoading={isLoading}
          inProgress={inProgress}
          onSuccess={fetchMaintenanceSchedules}
        />
      </Tabs>
    </div>
  )
}

export default ViewMaintenanceSchedule
