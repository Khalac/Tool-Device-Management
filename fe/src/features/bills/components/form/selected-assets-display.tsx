import { Button, Badge } from '@/components/ui'
import { X, ImageIcon } from 'lucide-react'

interface Asset {
  id: number
  assetName: string
  status: string
  cost: number
  category?: { categoryName: string }
  imageUpload?: string
  fileAttachment?: string
}

interface SelectedAssetsDisplayProps {
  assets: Asset[]
  selectedAssets: string[]
  onRemoveAsset: (assetId: string) => void
}

const AssetImage = ({ asset, size = 'md' }: { asset: Asset; size?: 'sm' | 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 object-cover',
    md: 'w-8 h-8 object-cover',
  }

  const imageUrl = asset.imageUpload || asset.fileAttachment

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0 overflow-hidden rounded border bg-gray-100`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={asset.assetName || 'Asset'}
          className='h-full w-full object-cover'
        />
      ) : (
        <div className='flex h-full w-full items-center justify-center bg-gray-200'>
          <ImageIcon className='h-4 w-4 text-gray-400' />
        </div>
      )}
    </div>
  )
}

const getAssetStatusColor = (status: string) => {
  const colors = {
    New: 'bg-green-100 text-green-800',
    'In Use': 'bg-blue-100 text-blue-800',
    'Under Maintenance': 'bg-amber-100 text-amber-800',
    Disposed: 'bg-red-100 text-red-800',
  } as const
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

export const SelectedAssetsDisplay = ({ assets, selectedAssets, onRemoveAsset }: SelectedAssetsDisplayProps) => {
  const getSelectedAssetDetails = () => {
    return assets.filter((asset) => selectedAssets.includes(asset.id.toString()))
  }

  const getTotalAmount = () => {
    return getSelectedAssetDetails().reduce((total, asset) => total + (asset?.cost || 0), 0)
  }

  const selectedAssetDetails = getSelectedAssetDetails()

  if (selectedAssets.length === 0) {
    return null
  }

  return (
    <div className='space-y-3'>
      <div className='grid gap-2'>
        {selectedAssetDetails.map((asset) => (
          <div
            key={asset.id}
            className='dark:bg-background flex items-center gap-3 rounded-lg border bg-gray-50 p-3'
          >
            <AssetImage
              asset={asset}
              size='md'
            />

            <div className='min-w-0 flex-1 dark:text-white'>
              <div className='truncate font-medium'>{asset.assetName}</div>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Badge
                  variant='outline'
                  className={getAssetStatusColor(asset.status)}
                >
                  {asset.status}
                </Badge>
                <span className='text-sm font-medium dark:text-white'>${asset.cost?.toLocaleString()}</span>
                <span className='text-sm font-medium dark:text-white'>• {asset.category?.categoryName}</span>
              </div>
            </div>

            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => onRemoveAsset(asset.id.toString())}
              className='flex-shrink-0 text-red-600 hover:bg-red-50 hover:text-red-800'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>

      <div className='rounded-lg bg-blue-50 p-3 dark:bg-blue-950'>
        <p className='text-sm font-medium'>
          Selected: {selectedAssets.length} asset{selectedAssets.length > 1 ? 's' : ''}
        </p>
        <p className='text-sm font-medium text-gray-600 dark:text-white'>
          Total Amount: ${getTotalAmount().toLocaleString()}
        </p>
      </div>
    </div>
  )
}
