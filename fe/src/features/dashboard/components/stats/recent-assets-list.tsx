import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { ClockIcon, Loader2, Laptop } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Asset } from './stats-overview-cards'

interface RecentAssetsListProps {
  assets: Asset[]
  isPending: boolean
}

export const RecentAssetsList = ({ assets, isPending }: RecentAssetsListProps) => {
  const navigate = useNavigate()

  return (
    <Card className='transition-shadow duration-200 hover:shadow-lg'>
      <CardHeader className='pb-0 sm:pb-0'>
        <CardTitle className='text-base sm:text-lg'>
          <div className='text-primary flex items-center gap-2'>
            <ClockIcon className='text-primary h-5 w-5' />
            Recent Purchased Assets
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className='flex h-[250px] items-center justify-center sm:h-[300px] lg:h-[350px]'>
            <Loader2 className='text-primary h-6 w-6 animate-spin sm:h-8 sm:w-8' />
          </div>
        ) : (
          <div className='space-y-3 sm:space-y-4'>
            {assets
              .sort((a, b) => a.id - b.id)
              .slice(0 - 5)
              .reverse()
              .map((asset) => (
                <div
                  className='hover:bg-muted/50 border-b-muted-foreground/20 flex items-center rounded-lg border border-b-2 border-transparent p-2 transition-all duration-200 hover:cursor-pointer hover:shadow-md sm:p-3'
                  key={asset.id}
                  onClick={() => navigate(`/assets/${asset.id}`)}
                >
                  <div className='min-w-0 flex-1 space-y-1'>
                    <div className='flex items-center gap-2 truncate text-xs leading-none font-medium sm:text-sm'>
                      <Laptop className='h-4 w-4 shrink-0' />
                      <p className='truncate'>{asset.assetName}</p>
                    </div>
                    <p className='text-muted-foreground truncate text-xs sm:text-sm'>
                      {asset.category.categoryName} • {asset.status} • ${asset.cost}
                    </p>
                  </div>
                  <div className='ml-2 min-w-0 flex-shrink-0 text-right text-xs font-medium sm:ml-4 sm:text-sm'>
                    <span className='truncate'>{asset.department.departmentName || 'No Department'} </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
