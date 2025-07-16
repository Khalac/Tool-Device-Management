export type RequestTransferStatusType = 'Pending' | 'Confirm' | 'Deny'
export type RequestTransferType = {
  id: number
  status: RequestTransferStatusType
  category: {
    id: number
    categoryName: string
  }
  description: string
  user: {
    id: number
    firstName: string
    lastName: string
    email: string
    departmentId: string
  }
}
