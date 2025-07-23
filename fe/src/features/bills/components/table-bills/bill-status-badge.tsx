import { Badge } from '@/components/ui'

interface BillStatusBadgeProps {
  status: string
  onClick?: (e: React.MouseEvent) => void
}

export const BillStatusBadge = ({ status, onClick }: BillStatusBadgeProps) => {
  const statusConfig = {
    Unpaid: {
      color: 'bg-red-100 text-red-800',
    },
    Paid: {
      color: 'bg-green-100 text-green-800',
    },
  } as const

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Unpaid

  return (
    <Badge
      className={config.color}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
      }}
    >
      {status || 'Unpaid'}
    </Badge>
  )
}
