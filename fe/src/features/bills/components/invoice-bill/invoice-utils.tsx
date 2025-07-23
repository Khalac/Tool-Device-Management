import type { BillType } from '../../model/bill-types'

export const getStatusColor = (status: string) => {
  const colors = {
    Unpaid: 'bg-red-100 text-red-800 dark:bg-red-400 dark:text-red-700',
    Paid: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
    Cancelled: 'bg-red-100 text-red-800 border-red-200',
    Draft: 'bg-gray-100 text-gray-800 border-gray-200',
  } as const
  return colors[status as keyof typeof colors] || colors.Unpaid
}

export const formatDateShort = (dateString: string) => {
  try {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'N/A'
  }
}

export const getAssetName = (bill: BillType) => {
  if (Array.isArray(bill.assets)) {
    return bill.assets.map((asset) => asset.assetName).join(', ')
  }
  return bill.assets?.assetName || 'Unknown Asset'
}

export const getCategoryName = (bill: BillType) => {
  if (Array.isArray(bill.assets)) {
    const categories = bill.assets.map((asset) => asset.category?.categoryName).filter(Boolean)
    return [...new Set(categories)].join(', ') || 'No Category'
  }
  return bill.assets?.category?.categoryName || 'No Category'
}

export const getAssetCost = (bill: BillType) => {
  if (Array.isArray(bill.assets)) {
    return bill.assets.reduce((total, asset) => total + (asset.cost || 0), 0)
  }
  if (bill.assets?.cost !== undefined && bill.assets.cost !== null) {
    return bill.assets.cost
  }
  return bill.amount || 0
}

export const getInvoiceItems = (bill: BillType) => {
  if (Array.isArray(bill.assets)) {
    return bill.assets.map((asset, index) => ({
      stt: index + 1,
      assetName: asset.assetName,
      category: asset.category?.categoryName || 'No Category',
      quantity: 1,
      unitPrice: asset.cost || 0,
      amount: asset.cost || 0,
    }))
  } else if (bill.assets) {
    return [
      {
        stt: 1,
        assetName: bill.assets.assetName,
        category: bill.assets.category?.categoryName || getCategoryName(bill),
        quantity: 1,
        unitPrice: bill.assets.cost || getAssetCost(bill),
        amount: bill.assets.cost || getAssetCost(bill),
      },
    ]
  } else {
    return [
      {
        stt: 1,
        assetName: getAssetName(bill),
        category: getCategoryName(bill),
        quantity: 1,
        unitPrice: getAssetCost(bill),
        amount: getAssetCost(bill),
      },
    ]
  }
}

export const getSellerInfo = () => ({
  companyName: 'SUNRISE SOFTWARE SOLUTIONS CORPORATION',
  taxCode: '0305089644',
  address: '307/12 Nguyen Van Troi, Ward 1, Tan Binh District, HCMC, Viet Nam',
  phoneNumber: '028-35471411',
  accountNumber: '1982738238232',
})

export const getBuyerInfo = (bill: BillType) => ({
  name: bill.buyer?.buyerName || 'N/A',
  address: bill.buyer?.buyerAddress || 'N/A',
  phoneNumber: bill.buyer?.buyerPhone || 'N/A',
  email: bill.buyer?.buyerEmail || 'N/A',
})
