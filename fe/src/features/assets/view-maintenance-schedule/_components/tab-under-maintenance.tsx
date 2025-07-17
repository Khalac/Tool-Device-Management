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
import { columnTableMaintenance } from '../column-table'
import type { MaintenanceSchedule } from '../model'
import { Wrench } from 'lucide-react'

export const TabUnderMaintenance = ({
  isLoading,
  inProgress,
  onSuccess,
}: {
  isLoading: boolean
  inProgress: MaintenanceSchedule[]
  onSuccess: () => void
}) => {
  return (
    <TabsContent
      value='in-progress'
      className='space-y-4'
    >
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-primary text-lg'>Assets Under Maintenance</CardTitle>
          <CardDescription className='text-primary'>Assets are being maintained</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonForTable />
          ) : inProgress.length > 0 ? (
            <DataTable
              columns={columnTableMaintenance({ onSuccessUpdate: onSuccess })}
              data={inProgress}
            />
          ) : (
            <div className='py-10 text-center'>
              <Wrench className='text-muted-foreground mx-auto h-10 w-10' />
              <h3 className='mt-2 text-lg font-medium'>No assets under maintenance</h3>
              <p className='text-muted-foreground'>There are no assets currently under maintenance.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}
