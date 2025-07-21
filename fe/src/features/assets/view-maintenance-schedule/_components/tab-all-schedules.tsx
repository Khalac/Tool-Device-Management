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
export const TabAllSchedules = ({
  isLoading,
  schedules,
  onSuccess,
}: {
  isLoading: boolean
  schedules: MaintenanceSchedule[]
  onSuccess: () => void
}) => {
  return (
    <TabsContent
      value='all'
      className='space-y-4'
    >
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-primary text-lg'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              All Maintenance Schedules
            </div>
          </CardTitle>
          <CardDescription className='text-primary'>
            All assets's information have been scheduled for maintenance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonForTable />
          ) : schedules.length > 0 ? (
            <DataTable
              columns={columnTableMaintenance({ onSuccessUpdate: onSuccess })}
              data={schedules}
            />
          ) : (
            <div className='py-10 text-center'>
              <Calendar className='text-muted-foreground mx-auto h-10 w-10' />
              <h3 className='mt-2 text-lg font-medium'>No maintenance schedules found</h3>
              <p className='text-muted-foreground'>No maintenance schedules have been created yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}
