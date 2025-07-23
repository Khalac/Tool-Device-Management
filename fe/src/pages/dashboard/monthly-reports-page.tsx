import { MonthlyReport } from '@/features/dashboard/components/reports/monthly-report'
import { getAllAssets } from '@/features/assets/api'
import { useState, useEffect } from 'react'
import { tryCatch } from '@/utils'
import type { AssetsType } from '@/features/assets/view-all-assets/model'
import { Loader2 } from 'lucide-react'

const MonthlyReportsPage = () => {
  const [assets, setAssets] = useState<AssetsType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAssets = async () => {
    setIsLoading(true)
    try {
      const response = await tryCatch(getAllAssets())
      if (!response.error) {
        setAssets(response.data.data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='text-primary mx-auto h-8 w-8 animate-spin dark:text-gray-300' />
          <p className='text-primary mt-2 dark:text-gray-400'>Loading assets...</p>
        </div>
      </div>
    )
  }

  return <MonthlyReport assets={assets} />
}

export default MonthlyReportsPage
