import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks'
import { getBillsFilter } from '../api'
import { getAssetInformation } from '@/features/assets/api/get-asset-information'
import type { BillType, BillFilterType } from '../model/bill-types'
import { tryCatch } from '@/utils'
import Cookies from 'js-cookie'

export const useBillsData = (debouncedFilters: BillFilterType) => {
  const [bills, setBills] = useState<BillType[]>([])
  const [isLoading, setIsLoading] = useState(false)

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

  const fetchBills = async () => {
    setIsLoading(true)
    const response = await tryCatch(getBillsFilter(debouncedFilters))

    if (response.error) {
      toast.error('Failed to fetch bills')
      console.error('Bills fetch error:', response.error)
    } else {
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

      setBills(billsWithCompleteData)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchBills()
  }, [debouncedFilters])

  const getBillTotalCost = (bill: BillType) => {
    const assets = Array.isArray(bill.assets) ? bill.assets : bill.assets ? [bill.assets] : []
    return assets.reduce((total, asset) => total + (asset?.cost || 0), 0) || bill.amount || 0
  }

  const getBillAssetNames = (bill: BillType) => {
    const assets = Array.isArray(bill.assets) ? bill.assets : bill.assets ? [bill.assets] : []
    return assets.map((asset) => asset?.assetName || 'N/A').join(', ') || 'N/A'
  }

  const handleBillCreated = (newBill: BillType) => {
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

    setBills((prev) => [billWithCreator as BillType, ...prev])
    toast.success('Bill created successfully')

    setTimeout(() => {
      fetchBills()
    }, 1000)
  }

  const handleBillUpdated = (updatedBillNumber: string, billId: number, newStatus: 'Unpaid' | 'Paid') => {
    console.log('🚀 ~ handleBillUpdated ~ billId:', billId)
    setBills((currentBills) =>
      currentBills.map((bill) => (bill.billNumber === updatedBillNumber ? { ...bill, statusBill: newStatus } : bill))
    )
  }

  return {
    bills,
    setBills,
    isLoading,
    getBillTotalCost,
    getBillAssetNames,
    handleBillCreated,
    handleBillUpdated,
    refetch: fetchBills,
  }
}
