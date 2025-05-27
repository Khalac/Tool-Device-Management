import type { ColumnDef } from '@tanstack/react-table'
import type { AssetsType, AssetStatus } from '../model'
import { Badge, Button } from '@/components/ui'
import { CircleIcon, UserIcon, WrenchIcon, ArchiveIcon, TrashIcon } from 'lucide-react'
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
    accessorKey: 'category.categoryName',
    header: 'Category',
  },
  {
    accessorKey: 'department.departmentName',
    header: 'Department Name',
  },
  {
    accessorKey: 'department.location.locationAddress',
    header: 'Location',
    cell: ({ row }) => {
      const location = row.getValue('department_location_locationAddress') as string

      return (
        <div
          className='max-w-[100px] truncate'
          title={location}
        >
          {location}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
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
        <Button
          variant='outline'
          className='w-fit'
        >
          <Link to={`/assets/${assetId}`}>
            <span className='text-sm font-medium'>View</span>
          </Link>
        </Button>
      )
    },
  },
]
