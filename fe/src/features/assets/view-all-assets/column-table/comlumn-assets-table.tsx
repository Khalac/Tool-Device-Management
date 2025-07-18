import type { ColumnDef } from '@tanstack/react-table'
import type { AssetsType, AssetStatus } from '../model'
import { Badge, Button, TooltipTrigger, TooltipContent, Tooltip } from '@/components/ui'
import { CircleIcon, UserIcon, WrenchIcon, ArchiveIcon, TrashIcon, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

export const columnsAssetsTable: ColumnDef<AssetsType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },

  {
    accessorKey: 'assetName',
    header: 'Asset Name',
  },
  {
    accessorKey: 'serialNumber',
    header: 'Serial Number',
  },
  {
    accessorKey: 'category.categoryName',
    header: 'Category',
  },
  {
    accessorKey: 'department.departmentName',
    header: 'Department',
  },
  {
    accessorKey: 'department.location.locationAddress',
    header: 'Location',
    cell: ({ row }) => {
      const location = row.getValue('department_location_locationAddress') as string

      return (
        <div
          className='max-w-[500px] truncate'
          title={location}
        >
          {location}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Asset Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as AssetStatus

      const statusConfig = {
        New: {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CircleIcon className='mr-1 h-3 w-3 fill-green-500' />,
        },
        'In Use': {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <UserIcon className='mr-1 h-3 w-3' />,
        },
        'Under Maintenance': {
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <WrenchIcon className='mr-1 h-3 w-3' />,
        },
        Retired: {
          color: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: <ArchiveIcon className='mr-1 h-3 w-3' />,
        },
        Disposed: {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <TrashIcon className='mr-1 h-3 w-3' />,
        },
      }

      const config = statusConfig[status]

      return (
        <Badge
          variant='outline'
          className={`${config.color} flex items-center gap-1`}
        >
          {config.icon}
          {status}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const assetId = row.getValue('id') as number

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              className='border-primary text-primary hover:text-primary/80 w-fit'
            >
              <Link
                to={`/assets/${assetId}`}
                className='flex items-center gap-2 text-sm font-medium'
              >
                <Eye className='h-4 w-4' />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View details</p>
          </TooltipContent>
        </Tooltip>
      )
    },
  },
]
