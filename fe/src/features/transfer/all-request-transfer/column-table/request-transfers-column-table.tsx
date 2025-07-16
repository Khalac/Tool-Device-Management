import type { ColumnDef } from '@tanstack/react-table'
import type { RequestTransferStatusType, RequestTransferType } from '../model'
import { Badge, Button } from '@/components/ui'
import { Check, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DialogSelectAsset } from '../../request-transfer-information/dialog-select-asset'
import { useState } from 'react'
import { tryCatch } from '@/utils'
import { approveRequestTransfer, denyRequestTransfer } from '../../api'
import type { ApproveFormValues } from '../../request-transfer-information/dialog-select-asset/model'
import { toast } from 'sonner'

export const columns = (refreshData: () => void): ColumnDef<RequestTransferType>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <span>{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'category',
    header: () => {
      return <div>Category</div>
    },
    cell: ({ row }) => {
      const category = row.original.category
      return (
        <div className='flex items-center gap-2'>
          <span className='font-medium'>{category.categoryName}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'user',
    header: 'Requested By',
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div>
          <p className='text-sm font-medium'>
            {user.firstName} {user.lastName}
          </p>
          <p className='text-muted-foreground text-xs'>{user.email}</p>
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return (
        <div className='max-w-[200px]'>
          <p
            className='truncate text-sm'
            title={description}
          >
            {description}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as RequestTransferStatusType

      const statusConfig: Record<RequestTransferStatusType, { color: string }> = {
        Pending: {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        },
        Confirm: {
          color: 'bg-green-100 text-green-800 border-green-200',
        },
        Deny: {
          color: 'bg-red-100 text-red-800 border-red-200',
        },
      }

      const config = statusConfig[status]

      return (
        <Badge
          variant='outline'
          className={`${config.color} flex items-center gap-1`}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const status = row.getValue('status') as RequestTransferStatusType
      const disabled = status !== 'Pending'
      const [isDialogOpen, setIsDialogOpen] = useState(false)
      const [isProcessing, setIsProcessing] = useState(false)
      const id = row.original.id
      const handleApprove = async (values: ApproveFormValues) => {
        setIsProcessing(true)

        const data = await tryCatch(approveRequestTransfer(values.assetId, id.toString()))

        if (data.error) {
          toast.error(data.error.message || 'Failed to approve transfer request')
          setIsProcessing(false)
          return
        }
        toast.success(`Transfer request #${id} has been approved`)
        refreshData()
        setIsDialogOpen(false)
        setIsProcessing(false)
      }

      const handleReject = async () => {
        setIsProcessing(true)
        const data = await tryCatch(denyRequestTransfer(id.toString()))
        if (data.error) {
          toast.error(data.error.message || 'Failed to deny transfer request')
          setIsProcessing(false)
          return
        }
        toast.success(`Transfer request #${id} has been denied`)
        refreshData()
        setIsProcessing(false)
      }

      return (
        <div className='flex gap-2'>
          <DialogSelectAsset
            categoryId={row.original.category.id.toString()}
            departmentId={row.original.user.departmentId.toString()}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleApprove={handleApprove}
            isProcessing={isProcessing}
          />
          <Button
            variant='outline'
            size='sm'
            className='border-green-500 text-green-500 hover:bg-green-100 hover:text-green-600'
            disabled={disabled || isProcessing}
            onClick={() => setIsDialogOpen(true)}
          >
            <Check className='mr-1 h-4 w-4' />
            Approve
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='border-red-500 text-red-500 hover:bg-red-100 hover:text-red-600'
            disabled={disabled || isProcessing}
            onClick={handleReject}
          >
            <X className='mr-1 h-4 w-4' />
            Reject
          </Button>
        </div>
      )
    },
  },
  {
    id: 'view',
    header: 'Details',
    cell: ({ row }) => {
      const id = row.original.id

      return (
        <Button
          variant='outline'
          size='sm'
          asChild
          className='border-primary text-primary hover:text-primary/80'
        >
          <Link to={`/transfers/${id}`}>View Details</Link>
        </Button>
      )
    },
  },
]
