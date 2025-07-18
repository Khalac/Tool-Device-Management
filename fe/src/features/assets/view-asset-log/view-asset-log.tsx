import { getData } from '@/utils'
import { useEffect, useState } from 'react'
import { getAssetLog } from '../api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, LoadingSpinner, ScrollArea } from '@/components/ui'
import type { AssetLog } from './model'
import { LogIcon, LogInformation } from './_components'
import { Clock } from 'lucide-react'

const ViewAssetLog = ({ id }: { id: string }) => {
  const [assetLog, setAssetLog] = useState<AssetLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      await getData(() => getAssetLog(id), setAssetLog)
      setIsLoading(false)
    })()
  }, [id])

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
          <Clock className='h-5 w-5' />
          Asset History
        </CardTitle>
        <CardDescription>Tracking log of all activities related to this asset</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex justify-center py-8'>
            <LoadingSpinner className='text-muted-foreground h-8 w-8 animate-pulse' />
          </div>
        ) : assetLog.length === 0 ? (
          <div className='text-muted-foreground py-8 text-center'>
            <p>No history available for this asset</p>
          </div>
        ) : (
          <ScrollArea className='h-[180px] rounded-xl border px-4 pt-3'>
            <div className='space-y-4'>
              {assetLog.map((item, index) => (
                <div
                  key={index}
                  className='mt-1 mb-2 flex gap-4 border-b pb-4 last:border-b-0 last:pb-0'
                >
                  <LogIcon item={item} />
                  <LogInformation item={item} />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

export default ViewAssetLog
