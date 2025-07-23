import { format } from 'date-fns'
import { LoadingSpinner, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import type { MaintenanceSchedule } from '../../view-maintenance-schedule/model'
import { useEffect, useState } from 'react'
import { getData } from '@/utils'
import { getMaintenanceScheduleById } from '../../api'

export const AssetMaintenanceSchedule = ({ id }: { id: string }) => {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fetchSchedules = async () => {
    setIsLoading(true)
    await getData(() => getMaintenanceScheduleById(id), setSchedules)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchSchedules()
  }, [id])

  if (isLoading) {
    return (
      <div className='flex justify-center py-8'>
        <LoadingSpinner className='text-primary h-8 w-8 animate-spin' />
      </div>
    )
  }
  if (!schedules.length) {
    return (
      <div className='text-muted-foreground flex h-[200px] items-center justify-center'>
        No maintenance schedules found
      </div>
    )
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.map((schedule) => (
          <TableRow key={schedule.id}>
            <TableCell>{format(new Date(schedule.startDate), 'PPP')}</TableCell>
            <TableCell>{format(new Date(schedule.endDate), 'PPP')}</TableCell>
            <TableCell>{schedule.asset.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
