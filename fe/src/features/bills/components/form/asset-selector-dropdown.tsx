import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Badge,
} from '@/components/ui'
import { Package, ChevronDown, ImageIcon } from 'lucide-react'

interface Asset {
  id: number
  assetName: string
  status: string
  cost: number
  category?: { categoryName: string }
  imageUpload?: string
  fileAttachment?: string
}

interface AssetSelectorDropdownProps {
  assets: Asset[]
  selectedAssets: string[]
  isLoading: boolean
  onAssetSelect: (assetId: string) => void
}

const AssetImage = ({ asset, size = 'sm' }: { asset: Asset; size?: 'sm' | 'md' }) => {
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

export const AssetSelectorDropdown = ({
  assets,
  selectedAssets,
  isLoading,
  onAssetSelect,
}: AssetSelectorDropdownProps) => {
  const getAvailableAssets = () => {
    return assets.filter((asset) => !selectedAssets.includes(asset.id.toString()))
  }

  const availableAssets = getAvailableAssets()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type='button'
          variant='outline'
          className='w-full justify-between'
          disabled={isLoading || availableAssets.length === 0}
        >
          <span className='flex items-center gap-2'>
            <Package className='h-4 w-4' />
            {isLoading ? 'Loading assets...' : 'Add Asset'}
          </span>
          <ChevronDown className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='max-h-60 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto'
        align='start'
        sideOffset={4}
      >
        {availableAssets.length === 0 ? (
          <DropdownMenuItem disabled>No available assets</DropdownMenuItem>
        ) : (
          availableAssets.map((asset) => (
            <DropdownMenuItem
              key={asset.id}
              onClick={() => onAssetSelect(asset.id.toString())}
              className='flex cursor-pointer items-start gap-3 p-3 hover:bg-gray-50'
            >
              <AssetImage
                asset={asset}
                size='sm'
              />

              <div className='min-w-0 flex-1'>
                <div className='truncate font-medium'>{asset.assetName}</div>
                <div className='mt-1 flex items-center gap-2 text-sm text-gray-600'>
                  <div className='truncate text-sm font-medium text-gray-500'>{asset.category?.categoryName}</div>
                  <Badge
                    variant='outline'
                    className={getAssetStatusColor(asset.status)}
                  >
                    {asset.status}
                  </Badge>
                  <span className='text-sm font-medium'>${asset.cost?.toLocaleString()}</span>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
