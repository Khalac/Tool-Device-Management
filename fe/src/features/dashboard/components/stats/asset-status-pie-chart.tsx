import { ReusablePieChart } from '@/components/ui/charts/pie-chart'
import { PieChart } from 'lucide-react'
import type { Asset } from './stats-overview-cards'

interface AssetStatusPieChartProps {
  assets: Asset[]
  isPending: boolean
}

export const AssetStatusPieChart = ({ assets, isPending }: AssetStatusPieChartProps) => {
  const getStatusCount = (status: string) => {
    return assets?.filter((asset) => asset.status === status)?.length || 0
  }

  const newCount = getStatusCount('New')
  const retiredAndDisposedCount = getStatusCount('Retired') + getStatusCount('Disposed')
  const inUseCount = getStatusCount('In Use')
  const underMaintenanceCount = getStatusCount('Under Maintenance')

  const pieChartData = [
    { name: 'In Use', value: inUseCount },
    { name: 'Under Maintenance', value: underMaintenanceCount },
    { name: 'Retired / Disposed', value: retiredAndDisposedCount },
    { name: 'New', value: newCount },
  ]

  return (
    <ReusablePieChart
      icon={<PieChart className='text-primary h-5 w-5' />}
      data={pieChartData}
      title='Asset Status Distribution'
      isPending={isPending}
      showAnimation={true}
      animationDelay={2000}
      className='text-primary'
    />
  )
}
