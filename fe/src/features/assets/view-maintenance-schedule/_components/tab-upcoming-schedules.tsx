import {
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  DataTable,
  SkeletonForTable,
} from '@/components'
import { Calendar } from 'lucide-react'
import { columnTableMaintenance } from '../column-table'
import type { MaintenanceSchedule } from '../model'

export const TabUpcomingSchedules = ({
  isLoading,
  upcoming,
  onSuccess,
}: {
  isLoading: boolean
  upcoming: MaintenanceSchedule[]
  onSuccess: () => void
}) => {
  return (
    <TabsContent
      value='upcoming'
      className='space-y-4'
    >
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-primary text-lg'>Scheduled Maintenance</CardTitle>
          <CardDescription className='text-primary'>Assets scheduled for maintenance</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonForTable />
          ) : upcoming.length > 0 ? (
            <DataTable
              columns={columnTableMaintenance({ onSuccessUpdate: onSuccess })}
              data={upcoming}
            />
          ) : (
            <div className='py-10 text-center'>
              <Calendar className='text-muted-foreground mx-auto h-10 w-10' />
              <h3 className='mt-2 text-lg font-medium'>No scheduled maintenance</h3>
              <p className='text-muted-foreground'>There are no assets scheduled for maintenance.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}
