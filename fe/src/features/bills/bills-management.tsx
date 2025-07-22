import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, CardDescription } from '@/components/ui'
import { Receipt, Download, FileText, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { useDebounce, useAppSelector } from '@/hooks'
import { getBillsFilter } from './api'
import { getAssetInformation } from '@/features/assets/api/get-asset-information'
import { BillsFilter } from './components/bills-filter'
import { BillsTable } from './components/bills-table'
import { CreateBillModal } from './components/create-bill-modal'
import { BillDetailModal } from './components/bill-detail-modal'
import type { BillType, BillFilterType } from './model/bill-types'
import { tryCatch } from '@/utils'
import Cookies from 'js-cookie'
import { useSearchParams } from 'react-router-dom'
import { formatCurrency } from '../dashboard/utils/statistics-calculator'

export const BillsManagement = () => {
  const [bills, setBills] = useState<BillType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBill, setSelectedBill] = useState<BillType | null>(null)
  const [showBillDetail, setShowBillDetail] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  console.log('🚀 ~ BillsManagement ~ searchParams:', searchParams)

  const currentUser = useAppSelector((state) => state.auth.user)

  const getCurrentUserInfo = () => {
    const firstName = Cookies.get('firstName') || currentUser.firstName
    const lastName = Cookies.get('lastName') || currentUser.lastName
    const email = Cookies.get('email') || currentUser.email
    const avatar = Cookies.get('avatar') || currentUser.avatar
    const id = Cookies.get('id') || currentUser.id

    return {
      id: parseInt(id) || parseInt(currentUser.id),
      fullName: `${firstName} ${lastName}`.trim() || 'Current User',
      email: email || 'No email',
      avatar: avatar || null,
    }
  }

  const [filters, setFilters] = useState<BillFilterType>({
    billNumber: '',
    categoryId: null,
    companyId: null,
    statusBill: null,
  })

  const debouncedFilters = useDebounce(filters, 500)

  const fetchBills = async () => {
    setIsLoading(true)
    const response = await tryCatch(getBillsFilter(debouncedFilters))

    if (response.error) {
      toast.error('Failed to fetch bills')
      console.error('Bills fetch error:', response.error)
    } else {
      console.log('Bills response:', response.data)
      const billsData = response.data.data || []

      const billsWithCompleteData = await Promise.all(
        billsData.map(async (bill: any) => {
          let assetsData = bill.assets || []

          if (!Array.isArray(assetsData) && bill.asset) {
            assetsData = [bill.asset]
          }

          if (bill.assetId && (!assetsData || assetsData.length === 0)) {
            try {
              const assetIds = Array.isArray(bill.assetId) ? bill.assetId : [bill.assetId]
              const assetPromises = assetIds.map(async (id: string) => {
                const assetResponse = await tryCatch(getAssetInformation(id.toString()))
                return assetResponse.error ? null : assetResponse.data?.data
              })
              const fetchedAssets = await Promise.all(assetPromises)
              assetsData = fetchedAssets.filter(Boolean)
            } catch (error) {
              console.error('Failed to fetch asset details:', error)
            }
          }

          const userInfo = getCurrentUserInfo()

          return {
            ...bill,
            statusBill: bill.statusBill || 'Unpaid',
            createdAt: bill.createdAt || new Date().toISOString(),
            updatedAt: bill.updatedAt || new Date().toISOString(),
            assets: assetsData,

            asset: Array.isArray(assetsData) && assetsData.length > 0 ? assetsData[0] : null,
            creator: {
              id: userInfo.id,
              fullName: userInfo.fullName,
              email: userInfo.email,
              avatar: userInfo.avatar,
            },

            buyerName: bill.buyerName || 'N/A',
            buyerEmail: bill.buyerEmail || 'N/A',
            buyerPhone: bill.buyerPhone || 'N/A',
            buyerAddress: bill.buyerAddress || 'N/A',
          }
        })
      )

      console.log('Bills with complete data:', billsWithCompleteData)
      setBills(billsWithCompleteData)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchBills()
  }, [debouncedFilters])

  useEffect(() => {
    const params: any = {}
    if (filters.billNumber) params.billNumber = filters.billNumber
    if (filters.categoryId) params.categoryId = filters.categoryId
    if (filters.statusBill) params.statusBill = filters.statusBill
    setSearchParams(params)
  }, [filters])

  const handleResetFilters = () => {
    setFilters({
      billNumber: '',
      categoryId: null,
      companyId: null,
      statusBill: null,
    })
  }

  const handleBillCreated = (newBill: BillType) => {
    console.log('Received new bill in bills-management:', newBill)

    const userInfo = getCurrentUserInfo()
    const billWithCreator = {
      ...newBill,
      createdAt: newBill.createAt || new Date().toISOString(),
      updatedAt: newBill.updateAt || new Date().toISOString(),
      creator: {
        id: userInfo.id,
        fullName: userInfo.fullName,
        email: userInfo.email,
        avatar: userInfo.avatar,
      },
    }

    console.log('Bill with creator info:', billWithCreator)

    setBills((prev) => [billWithCreator as BillType, ...prev])
    toast.success('Bill created successfully')

    setTimeout(() => {
      fetchBills()
    }, 1000)
  }

  const handleViewBill = (bill: BillType) => {
    setSelectedBill(bill)
    setShowBillDetail(true)
  }

  const handleCloseBillDetail = () => {
    setShowBillDetail(false)
    setSelectedBill(null)
  }

  const generateMonthlyReport = () => {
    if (bills.length === 0) {
      toast.warning('No bills available to export')
      return
    }

    const exportData = bills.map((bill) => {
      const assets = Array.isArray(bill.assets) ? bill.assets : bill.assets ? [bill.assets] : []
      const assetNames = assets.map((asset) => asset?.assetName || 'N/A').join('; ')
      const totalCost = assets.reduce((total, asset) => total + (asset?.cost || 0), 0)
      const categories = assets.map((asset) => asset?.category?.categoryName || 'N/A').join('; ')

      return {
        billNumber: bill.billNumber,
        buyerName: bill.buyer?.buyerName || 'N/A',
        buyerEmail: bill.buyer?.buyerEmail || 'N/A',
        buyerPhone: bill.buyer?.buyerPhone || 'N/A',
        buyerAddress: bill.buyer?.buyerAddress || 'N/A',
        assetNames: assetNames,
        assetCount: assets.length,
        description: bill.description,
        totalCost: totalCost || bill.amount || 0,
        statusBill: bill.statusBill,
        categories: categories,
        createdBy: bill.creator?.fullName || 'Unknown',
        createdAt: new Date(bill.createAt || bill.createAt).toLocaleDateString(),
      }
    })

    const headers = [
      'Bill Number',
      'Buyer Name',
      'Buyer Email',
      'Buyer Phone',
      'Buyer Address',
      'Asset Names',
      'Asset Count',
      'Description',
      'Total Cost',
      'Status',
      'Categories',
      'Created By',
      'Created Date',
    ]

    const csvContent = [
      headers.join(','),
      ...exportData.map((bill) =>
        [
          `"${bill.billNumber}"`,
          `"${bill.buyerName}"`,
          `"${bill.buyerEmail}"`,
          `"${bill.buyerPhone}"`,
          `"${bill.buyerAddress}"`,
          `"${bill.assetNames}"`,
          bill.assetCount,
          `"${bill.description}"`,
          bill.totalCost,
          `"${bill.statusBill}"`,
          `"${bill.categories}"`,
          `"${bill.createdBy}"`,
          bill.createdAt,
        ].join(',')
      ),
    ].join('\n')

    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bills-monthly-report-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Monthly report exported successfully')
  }

  const totalCost = bills.reduce((sum, bill) => {
    const assets = Array.isArray(bill.assets) ? bill.assets : bill.assets ? [bill.assets] : []
    const billCost = assets.reduce((total, asset) => total + (asset?.cost || 0), 0) || bill.amount || 0
    return sum + billCost
  }, 0)

  const unpaidCount = bills.filter((bill) => bill.statusBill === 'Unpaid').length
  const paidCount = bills.filter((bill) => bill.statusBill === 'Paid').length

  const highestBill = bills.length
    ? bills.reduce((max, bill) => {
        const maxAssets = Array.isArray(max.assets) ? max.assets : max.assets ? [max.assets] : []
        const maxCost = maxAssets.reduce((total, asset) => total + (asset?.cost || 0), 0) || max.amount || 0

        const billAssets = Array.isArray(bill.assets) ? bill.assets : bill.assets ? [bill.assets] : []
        const billCost = billAssets.reduce((total, asset) => total + (asset?.cost || 0), 0) || bill.amount || 0

        return billCost > maxCost ? bill : max
      })
    : null

  const lowestBill = bills.length
    ? bills.reduce((min, bill) => {
        const minAssets = Array.isArray(min.assets) ? min.assets : min.assets ? [min.assets] : []
        const minCost = minAssets.reduce((total, asset) => total + (asset?.cost || 0), 0) || min.amount || 0

        const billAssets = Array.isArray(bill.assets) ? bill.assets : bill.assets ? [bill.assets] : []
        const billCost = billAssets.reduce((total, asset) => total + (asset?.cost || 0), 0) || bill.amount || 0

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

  const handleBillUpdated = (updatedBillNumber: string, billId: number, newStatus: 'Unpaid' | 'Paid') => {
    console.log('🚀 ~ handleBillUpdated ~ billId:', billId)
    setBills((currentBills) =>
      currentBills.map((bill) => (bill.billNumber === updatedBillNumber ? { ...bill, statusBill: newStatus } : bill))
    )
  }

  const getBillTotalCost = (bill: BillType) => {
    const assets = Array.isArray(bill.assets) ? bill.assets : bill.assets ? [bill.assets] : []
    return assets.reduce((total, asset) => total + (asset?.cost || 0), 0) || bill.amount || 0
  }

  const getBillAssetNames = (bill: BillType) => {
    const assets = Array.isArray(bill.assets) ? bill.assets : bill.assets ? [bill.assets] : []
    return assets.map((asset) => asset?.assetName || 'N/A').join(', ') || 'N/A'
  }

  return (
    <div className='space-y-4 p-4 sm:space-y-6 sm:p-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <CardTitle className='text-primary flex items-center text-2xl font-bold'>
            <Receipt
              strokeWidth={2.5}
              className='text-primary mr-2 h-5 w-5'
            />
            Bills Management
          </CardTitle>
          <CardDescription className='text-primary'>Manage and track all bills for your assets</CardDescription>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={generateMonthlyReport}
            className='text-primary border-primary hover:bg-primary/10 hover:text-primary flex items-center gap-2'
            disabled={bills.length === 0}
          >
            <Download className='text-primary h-4 w-4' />
            Export Report
          </Button>
          <CreateBillModal onBillCreated={handleBillCreated} />
        </div>
      </div>

      <BillsFilter
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
      />

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
            <p className='text-muted-foreground truncate text-xs'>
              {lowestBill ? getBillAssetNames(lowestBill) : 'N/A'}
            </p>
          </CardContent>
          <div className='absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-500 to-yellow-600' />
        </Card>
      </div>

      <BillsTable
        bills={bills}
        onViewBill={handleViewBill}
        isLoading={isLoading}
        onStatusChange={handleBillUpdated}
      />

      <BillDetailModal
        bill={selectedBill}
        open={showBillDetail}
        onClose={handleCloseBillDetail}
      />
    </div>
  )
}
