import type { BillType } from '../../model/bill-types'

export const formatDate = (dateString: string) => {
  try {
    if (!dateString) {
      return new Date().toLocaleDateString()
    }
    return new Date(dateString).toLocaleDateString()
  } catch {
    return new Date().toLocaleDateString()
  }
}

export const formatCurrency = (amount: number) => {
  try {
    return `$${(amount || 0).toLocaleString()}`
  } catch {
    return '$0'
  }
}

export const getBuyerName = (bill: BillType) => {
  if (bill.buyer?.buyerName) {
    return bill.buyer.buyerName
  }
  return 'Unknown Asset'
}

export const getAssetCount = (bill: BillType) => {
  if (Array.isArray(bill.assets)) {
    return bill.assets.length
  }
  if (bill.assets) {
    return 1
  }
  return 0
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
