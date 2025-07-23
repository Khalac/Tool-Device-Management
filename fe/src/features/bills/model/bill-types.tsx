export interface BillType {
  id: number
  billNumber: string
  assetId: number | number[]
  description: string
  statusBill: 'Unpaid' | 'Paid'
  companyId: number
  amount: number
  createdBy: number
  createAt: string
  updateAt: string
  purchaseDate?: string
  warrantyExpiry?: string
  qrUrl?: string
  fileAttachmentBill?: string
  imageUploadBill?: string

  buyer?: {
    buyerName: string
    buyerPhone: string
    buyerEmail: string
    buyerAddress: string
  }
  creator?: {
    id: number
    fullName: string
    email: string
    avatar?: string
  }

  assets?:
    | {
        id: number
        assetName: string
        serialNumber?: string
        cost: number
        status?: string
        image?: string
        category: {
          id: number
          categoryName: string
        }
        department?: {
          id: number
          departmentName: string
        }
        purchaseDate?: string
        warrantyExpiry?: string
      }
    | {
        id: number
        assetName: string
        serialNumber?: string
        cost: number
        status?: string
        totalCount?: number
        category: {
          id: number
          categoryName: string
        }
        department?: {
          id: number
          departmentName: string
        }
        purchaseDate?: string
        warrantyExpiry?: string
      }[]
}

export type CreateBillRequest = {
  buyer?: {
    buyerName: string
    buyerEmail: string
    buyerPhone: string
    buyerAddress: string
  }
  assetId: number | number[]
  description: string
  statusBill?: 'Unpaid' | 'Paid'
  fileAttachmentBill?: File
  imageUploadBill?: File
}

export interface BillFilterType {
  billNumber: string | ''
  categoryId: string | null
  companyId: string | null
  statusBill: 'Unpaid' | 'Paid' | null
}

export interface MonthlyBillSummary {
  month: string
  year: number
  totalBills: number
  totalAmount: number
  statusBreakdown: {
    status: string
    count: number
    amount: number
  }[]
  categoryBreakdown: {
    categoryName: string
    count: number
    amount: number
  }[]
}
