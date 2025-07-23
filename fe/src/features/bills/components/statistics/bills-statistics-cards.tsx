import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Receipt, FileText, CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '../../../dashboard/utils/statistics-calculator'
import type { BillType } from '../../model/bill-types'

interface BillsStatisticsCardsProps {
  bills: BillType[]
  getBillTotalCost: (bill: BillType) => number
  getBillAssetNames: (bill: BillType) => string
}

export const BillsStatisticsCards = ({ bills, getBillTotalCost, getBillAssetNames }: BillsStatisticsCardsProps) => {
  const totalCost = bills.reduce((sum, bill) => sum + getBillTotalCost(bill), 0)
  const unpaidCount = bills.filter((bill) => bill.statusBill === 'Unpaid').length
  const paidCount = bills.filter((bill) => bill.statusBill === 'Paid').length

  const highestBill = bills.length
    ? bills.reduce((max, bill) => {
        const maxCost = getBillTotalCost(max)
        const billCost = getBillTotalCost(bill)
        return billCost > maxCost ? bill : max
      })
    : null

  const lowestBill = bills.length
    ? bills.reduce((min, bill) => {
        const minCost = getBillTotalCost(min)
        const billCost = getBillTotalCost(bill)
        return billCost < minCost ? bill : min
      })
    : null

  const uniqueCategories = Array.from(
    new Set(
      bills.flatMap((bill) => {
        const assets = Array.isArray(bill.assets) ? bill.assets : bill.assets ? [bill.assets] : []
        return assets.map((asset) => asset?.category?.categoryName).filter(Boolean)
      })
    )
  )

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7'>
      <Card className='relative gap-0 overflow-hidden'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-muted-foreground text-sm font-medium'>Total Bills</CardTitle>
          <div className='rounded-full bg-cyan-500/10 p-2'>
            <Receipt className='h-4 w-4 text-cyan-600 dark:text-cyan-400' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-cyan-600 dark:text-cyan-400'>{bills.length}</div>
          <p className='text-muted-foreground truncate text-xs'>
            {bills.length > 0 ? `Total active bills in system` : 'No bills'}
          </p>
        </CardContent>
        <div className='absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-500 to-cyan-600' />
      </Card>

      <Card className='relative gap-0 overflow-hidden'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-muted-foreground text-sm font-medium'>Total Value</CardTitle>
          <div className='rounded-full bg-cyan-500/10 p-2'>
            <Receipt className='h-4 w-4 text-cyan-600 dark:text-cyan-400' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-cyan-600 dark:text-cyan-400'>{formatCurrency(totalCost)}</div>
          <p className='text-muted-foreground truncate text-xs'>Combined value of all bills</p>
        </CardContent>
        <div className='absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-500 to-cyan-600' />
      </Card>

      <Card className='relative gap-0 overflow-hidden'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-muted-foreground text-sm font-medium'>Unpaid</CardTitle>
          <div className='rounded-full bg-red-500/10 p-2'>
            <FileText className='h-4 w-4 text-red-600' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-red-600'>{unpaidCount}</div>
          <p className='text-muted-foreground truncate text-xs'>
            {bills.length > 0 ? `${((unpaidCount / bills.length) * 100).toFixed(1)}% of total bills` : 'No bills'}
          </p>
        </CardContent>
        <div className='absolute bottom-0 left-0 h-1 w-full bg-red-500' />
      </Card>

      <Card className='relative gap-0 overflow-hidden'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-muted-foreground text-sm font-medium'>Paid</CardTitle>
          <div className='rounded-full bg-green-500/10 p-2'>
            <CheckCircle2 className='h-4 w-4 text-green-600' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-green-600'>{paidCount}</div>
          <p className='text-muted-foreground truncate text-xs'>
            {bills.length > 0 ? `${((paidCount / bills.length) * 100).toFixed(1)}% of total bills` : 'No bills'}
          </p>
        </CardContent>
        <div className='absolute bottom-0 left-0 h-1 w-full bg-green-500' />
      </Card>

      <Card className='relative gap-0 overflow-hidden'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-muted-foreground text-sm font-medium'>Total Categories</CardTitle>
          <div className='rounded-full bg-purple-500/10 p-2'>
            <FileText className='h-4 w-4 text-purple-600' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-purple-600'>{uniqueCategories.length}</div>
          <p className='text-muted-foreground truncate text-xs'>
            {uniqueCategories.slice(0, 2).join(', ') || 'N/A'}
            {uniqueCategories.length > 2 && '...'}
          </p>
        </CardContent>
        <div className='absolute bottom-0 left-0 h-1 w-full bg-purple-500' />
      </Card>

      <Card className='relative gap-0 overflow-hidden'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-muted-foreground text-sm font-medium'>Highest Bill</CardTitle>
          <div className='rounded-full bg-orange-500/10 p-2'>
            <Receipt className='h-4 w-4 text-orange-600' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-orange-600'>
            {highestBill ? formatCurrency(getBillTotalCost(highestBill)) : '--'}
          </div>
          <p className='text-muted-foreground truncate text-xs'>
            {highestBill ? getBillAssetNames(highestBill) : 'N/A'}
          </p>
        </CardContent>
        <div className='absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-orange-600' />
      </Card>

      <Card className='relative gap-0 overflow-hidden'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-muted-foreground text-sm font-medium'>Lowest Bill</CardTitle>
          <div className='rounded-full bg-yellow-500/10 p-2'>
            <Receipt className='h-4 w-4 text-yellow-600' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-yellow-600'>
            {lowestBill ? formatCurrency(getBillTotalCost(lowestBill)) : '--'}
          </div>
          <p className='text-muted-foreground truncate text-xs'>{lowestBill ? getBillAssetNames(lowestBill) : 'N/A'}</p>
        </CardContent>
        <div className='absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-500 to-yellow-600' />
      </Card>
    </div>
  )
}
