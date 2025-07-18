import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge, Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui'
import { Link } from 'react-router-dom'
import type { MaintenanceSchedule } from '../model'
import { Calendar, Eye } from 'lucide-react'
import { UpdateMaintenanceSchedule } from '../../update-maintenance-schedule'
import { useState } from 'react'
import { useAppSelector } from '@/hooks'
export const columnTableMaintenance = ({
  onSuccessUpdate,
}: {
  onSuccessUpdate: () => void
}): ColumnDef<MaintenanceSchedule>[] => [
  {
    accessorKey: 'asset.assetName',
    header: 'Asset Name',
    cell: ({ row }) => (
      <div>
        <div className='font-medium'>{row.original.asset.assetName}</div>
        <div className='text-muted-foreground text-xs'>ID: {row.original.asset.id}</div>
      </div>
    ),
  },

  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => format(new Date(row.original.startDate), 'MM/dd/yyyy'),
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => format(new Date(row.original.endDate), 'MM/dd/yyyy'),
  },
  {
    accessorKey: 'asset.status',
    header: 'Asset Status',
    cell: ({ row }) => (
      <Badge
        variant='outline'
        className={
          row.original.asset.status === 'New'
            ? 'border-green-200 bg-green-100 text-green-800'
            : row.original.asset.status === 'In Use'
              ? 'border-blue-200 bg-blue-100 text-blue-800'
              : row.original.asset.status === 'Under Maintenance'
                ? 'border-yellow-200 bg-yellow-100 text-yellow-800'
                : 'border-red-200 bg-red-100 text-red-800'
        }
      >
        {row.original.asset.status}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const id = row.original.id
      const status = row.original.asset.status
      const [isDialogOpen, setIsDialogOpen] = useState(false)
      const role = useAppSelector((state) => state.auth.user?.role.slug)
      const startDate = row.original.startDate
      const endDate = row.original.endDate
      const isUnderMaintenance = status === 'Under Maintenance'
      const isEmployee = role === 'employee'
      return (
        <div className='flex items-center gap-2'>
          <UpdateMaintenanceSchedule
            startDate={startDate}
            endDate={endDate}
            id={id.toString()}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            onSuccessUpdate={onSuccessUpdate}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className='border-primary text-primary hover:text-primary/80'
                variant='outline'
                size='sm'
                asChild
              >
                <Link to={`/assets/${row.original.asset.id}`}>
                  <span className='flex items-center gap-2 text-sm font-medium'>
                    <Eye className='h-4 w-4' />
                  </span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top'>
              <p>View Asset</p>
            </TooltipContent>
          </Tooltip>
          {!isEmployee && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='inline-block'>
                  <Button
                    className={`border-primary text-primary hover:text-primary/80 ${
                      isUnderMaintenance ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    variant='outline'
                    size='sm'
                    disabled={isUnderMaintenance}
                    onClick={() => {
                      if (!isUnderMaintenance) {
                        setIsDialogOpen(true)
                      }
                    }}
                  >
                    <Calendar className='text-primary mr-1 h-4 w-4' />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side='top'>
                <p>{isUnderMaintenance ? 'Cannot update while under maintenance' : 'Update schedule'}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )
    },
  },
]
