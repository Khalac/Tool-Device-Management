import { useState } from 'react'
import { useDebounce } from '@/hooks'
import { useBillsData } from './hooks/use-bills-data'
import { useBillsExport } from './hooks/use-bills-export'
import { BillsHeader } from './components/layout/bills-header'
import { BillsStatisticsCards } from './components/statistics/bills-statistics-cards'
import { BillsFilter } from './components/bills-filter'
import { BillsTable } from './components/table-bills/bills-table'
import { BillDetailModal } from './components/bill-detail-modal'
import type { BillType, BillFilterType } from './model/bill-types'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'

export const BillsManagement = () => {
  const [selectedBill, setSelectedBill] = useState<BillType | null>(null)
  const [showBillDetail, setShowBillDetail] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  console.log('🚀 ~ BillsManagement ~ searchParams:', searchParams)

  const [filters, setFilters] = useState<BillFilterType>({
    billNumber: '',
    categoryId: null,
    companyId: null,
    statusBill: null,
  })

  const debouncedFilters = useDebounce(filters, 500)

  const { bills, isLoading, getBillTotalCost, getBillAssetNames, handleBillCreated, handleBillUpdated } =
    useBillsData(debouncedFilters)

  const { generateMonthlyReport } = useBillsExport(bills, getBillTotalCost)

  useEffect(() => {
    const params: any = {}
    if (filters.billNumber) params.billNumber = filters.billNumber
    if (filters.categoryId) params.categoryId = filters.categoryId
    if (filters.statusBill) params.statusBill = filters.statusBill
    setSearchParams(params)
  }, [filters, setSearchParams])

  const handleResetFilters = () => {
    setFilters({
      billNumber: '',
      categoryId: null,
      companyId: null,
      statusBill: null,
    })
  }

  const handleViewBill = (bill: BillType) => {
    setSelectedBill(bill)
    setShowBillDetail(true)
  }

  const handleCloseBillDetail = () => {
    setShowBillDetail(false)
    setSelectedBill(null)
  }

  return (
    <div className='space-y-4 p-4 sm:space-y-6 sm:p-6'>
      <BillsHeader
        billsCount={bills.length}
        onExport={generateMonthlyReport}
        onBillCreated={handleBillCreated}
      />

      <BillsFilter
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
      />

      <BillsStatisticsCards
        bills={bills}
        getBillTotalCost={getBillTotalCost}
        getBillAssetNames={getBillAssetNames}
      />

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
