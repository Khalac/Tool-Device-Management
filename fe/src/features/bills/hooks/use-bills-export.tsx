import { toast } from 'sonner'
import type { BillType } from '../model/bill-types'

export const useBillsExport = (bills: BillType[], getBillTotalCost: (bill: BillType) => number) => {
  const generateMonthlyReport = () => {
    if (bills.length === 0) {
      toast.warning('No bills available to export')
      return
    }

    const exportData = bills.map((bill) => {
      const assets = Array.isArray(bill.assets) ? bill.assets : bill.assets ? [bill.assets] : []
      const assetNames = assets.map((asset) => asset?.assetName || 'N/A').join('; ')
      const totalCost = getBillTotalCost(bill)
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
        totalCost: totalCost,
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

  return { generateMonthlyReport }
}
