import { useState } from 'react'
import { Search, X, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Card,
  CardContent,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui'
import { cn } from '@/lib'
import type { AssetsType } from '../../view-all-assets/model'
import type { ComparisonAsset } from '../model'

interface AssetSelectorProps {
  availableAssets: AssetsType[]
  selectedAssets: ComparisonAsset[]
  onAssetSelect: (asset: ComparisonAsset) => void
  onAssetRemove: (assetId: number) => void
  maxSelection?: number
}

const getStatusBadgeClasses = (status: string) => {
  return cn(
    'flex items-center gap-1',
    status === 'New' &&
      'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400',
    status === 'In Use' &&
      'border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    status === 'Under Maintenance' &&
      'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    status === 'Retired' &&
      'border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300',
    status === 'Disposed' &&
      'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400'
  )
}

export const AssetSelector = ({
  availableAssets,
  selectedAssets,
  onAssetSelect,
  onAssetRemove,
  maxSelection = 4,
}: AssetSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const safeAvailableAssets = Array.isArray(availableAssets) ? availableAssets : []

  const selectedCategory = selectedAssets.length > 0 ? selectedAssets[0].category : null

  const filteredAssets = safeAvailableAssets
    .filter(
      (asset) =>
        asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((asset) => !selectedAssets.some((selected) => selected.id === asset.id))

    .filter((asset) => {
      if (selectedCategory) {
        return asset.category.id === selectedCategory.id
      }
      return true
    })

  const toISOStringSafe = (date: any): string => {
    if (!date) return ''
    if (typeof date === 'string') return date
    if (date instanceof Date) return date.toISOString()
    return new Date(date).toISOString()
  }

  const convertToComparisonAsset = (asset: AssetsType): ComparisonAsset => ({
    id: asset.id,
    assetName: asset.assetName,
    serialNumber: asset.serialNumber,
    cost: asset.cost,
    purchaseDate: toISOStringSafe(asset.purchaseDate),
    warrantExpiry: toISOStringSafe(asset.warrantExpiry),
    imageUpload: asset.imageUpload,
    status: asset.status,
    category: asset.category,
    department: asset.department,
    location: {
      id: asset.department.location.id,
      locationAddress: asset.department.location.locationAddress,
    },
  })

  const handleAssetClick = (asset: AssetsType) => {
    if (selectedAssets.length < maxSelection) {
      onAssetSelect(convertToComparisonAsset(asset))
      setIsOpen(false)
      setSearchTerm('')
    }
  }

  const handleCloseModal = () => {
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className='space-y-4 py-0'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        {selectedAssets.map((asset) => (
          <Card
            key={asset.id}
            className='relative'
          >
            <CardContent className='p-3 py-0'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-10 w-10 rounded-md'>
                  <AvatarImage src={asset.imageUpload} />
                  <AvatarFallback className='rounded-md'>{asset.assetName[0]}</AvatarFallback>
                </Avatar>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>{asset.assetName}</p>
                  <p className='text-muted-foreground truncate text-xs'>{asset.serialNumber}</p>
                  <Badge
                    variant='outline'
                    className='mt-1 text-xs'
                  >
                    {asset.category.categoryName}
                  </Badge>
                </div>
                <Button
                  size='sm'
                  variant='ghost'
                  className='text-muted-foreground hover:bg-muted absolute top-1 right-1 h-6 w-6 flex-shrink-0 p-0'
                  onClick={() => onAssetRemove(asset.id)}
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {selectedAssets.length < maxSelection && (
          <Dialog open={isOpen}>
            <DialogTrigger asChild>
              <Card
                className='hover:bg-muted/50 cursor-pointer border-dashed'
                onClick={() => setIsOpen(true)}
              >
                <CardContent className='flex h-full items-center justify-center p-3'>
                  <div className='text-muted-foreground flex items-center gap-2 py-0'>
                    <Plus className='h-4 w-4' />
                    <span className='text-sm'>Add Asset</span>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>

            <DialogContent
              className='max-w-2xl'
              onInteractOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              showCloseButton={false}
            >
              <DialogHeader>
                <DialogTitle className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Plus className='h-4 w-4' />
                    <span className='text-sm'>Select Device to Compare</span>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleCloseModal}
                    className='hover:bg-muted h-6 w-6 p-0'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </DialogTitle>
              </DialogHeader>

              <div className='space-y-4'>
                <div className='relative'>
                  <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                  <Input
                    placeholder='Search device...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10'
                  />
                </div>

                <div className='max-h-96 space-y-2 overflow-y-auto'>
                  {filteredAssets.length === 0 ? (
                    <div className='text-muted-foreground py-8 text-center'>
                      No more devices available for comparison
                    </div>
                  ) : (
                    filteredAssets.map((asset) => (
                      <Card
                        key={asset.id}
                        className='bg-card hover:bg-muted/50 dark:bg-card/50 dark:hover:bg-muted/80 cursor-pointer transition-colors'
                        onClick={() => handleAssetClick(asset)}
                      >
                        <CardContent className='p-3 py-0'>
                          <div className='flex items-center gap-3'>
                            <Avatar className='rounded-md'>
                              <AvatarImage src={asset.imageUpload} />
                              <AvatarFallback className='rounded-md'>{asset.assetName[0]}</AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                              <p className='font-medium'>{asset.assetName}</p>
                              <p className='text-muted-foreground text-sm'>{asset.serialNumber}</p>
                              <div className='mt-1 flex gap-2'>
                                <Badge variant='outline'>{asset.category.categoryName}</Badge>
                                <Badge
                                  variant='outline'
                                  className={getStatusBadgeClasses(asset.status)}
                                >
                                  {asset.status}
                                </Badge>
                              </div>
                            </div>
                            <div className='text-right'>
                              <p className='font-medium'>${asset.cost.toLocaleString()}</p>
                              <p className='text-muted-foreground text-sm'>{asset.department.departmentName}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {selectedAssets.length >= maxSelection && (
        <p className='text-muted-foreground text-sm'>Maximum {maxSelection} assets can be compared at once</p>
      )}
    </div>
  )
}
