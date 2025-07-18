import { useState } from 'react'
import { GitCompare, Plus, X } from 'lucide-react'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { AppPaths } from '@/router/path'
import type { AssetsType } from '../../view-all-assets/model'
import { SimpleAssetSelector } from './simple-asset-selector'

interface CompareSimilarAssetsProps {
  currentAsset: AssetsType
  className?: string
}

export const CompareSimilarAssets = ({ currentAsset, className }: CompareSimilarAssetsProps) => {
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAssets, setSelectedAssets] = useState<AssetsType[]>([currentAsset])
  const [showAssetSelector, setShowAssetSelector] = useState(false)

  const handleAddAsset = (asset: AssetsType) => {
    if (selectedAssets.length < 4 && !selectedAssets.find((a) => a.id === asset.id)) {
      setSelectedAssets([...selectedAssets, asset])
    }
    setShowAssetSelector(false)
  }

  const handleRemoveAsset = (assetId: number) => {
    if (assetId === currentAsset.id) return
    setSelectedAssets(selectedAssets.filter((asset) => asset.id !== assetId))
  }

  const handleClearAll = () => {
    setSelectedAssets([currentAsset])
    setIsDialogOpen(false)
  }

  const handleCompareNow = () => {
    if (selectedAssets.length >= 2) {
      const assetIds = selectedAssets.map((asset) => asset.id).join(',')
      navigate(`${AppPaths.ASSET_COMPARISON}?assets=${assetIds}`)
      setIsDialogOpen(false)
    }
  }

  const handleOpenDialog = () => {
    setSelectedAssets([currentAsset])
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  return (
    <>
      <Dialog open={isDialogOpen}>
        <DialogTrigger asChild>
          <button
            className={`flex w-full cursor-pointer font-semibold ${className}`}
            onClick={handleOpenDialog}
          >
            <GitCompare className='mr-2 h-4 w-4' />
            <span className='hidden sm:inline'>Compare with Similar</span>
            <span className='sm:hidden'>Compare with Similar</span>
          </button>
        </DialogTrigger>

        <DialogContent
          className='max-h-[90vh] max-w-6xl overflow-y-auto'
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          showCloseButton={false}
        >
          <DialogHeader className='pb-0'>
            <DialogTitle className='text-primary flex items-center justify-between text-xl font-semibold'>
              <div className='flex items-center gap-2'>
                <GitCompare className='text-primary h-5 w-5' />
                Device Comparison
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleCloseDialog}
                className='hover:bg-muted h-6 w-6 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-6'>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                {selectedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className='group relative'
                  >
                    <div className='border-border bg-card relative h-full rounded-lg border-2 p-3 shadow-sm transition-all duration-200 hover:shadow-md'>
                      {asset.id !== currentAsset.id && (
                        <button
                          onClick={() => handleRemoveAsset(asset.id)}
                          className='text-foreground hover:bg-muted/80 hover:bg-muted absolute top-0 right-1 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md transition-colors'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      )}

                      {asset.id === currentAsset.id && (
                        <div className='absolute top-1 left-1 rounded-full bg-blue-500 px-2 py-1 text-[10px] font-medium text-white'>
                          Current
                        </div>
                      )}

                      <div className='mb-3 flex h-32 w-full items-center justify-center overflow-hidden rounded-xl'>
                        <img
                          src={asset.imageUpload}
                          alt={asset.assetName}
                          className='h-20 w-20 rounded-lg object-contain'
                        />
                      </div>

                      <div className='space-y-2'>
                        <h3
                          className='text-foreground line-clamp-2 text-sm leading-tight font-semibold'
                          title={asset.assetName}
                        >
                          {asset.assetName}
                        </h3>
                        <p className='bg-muted text-muted-foreground rounded-lg px-2 py-1 font-mono text-xs'>
                          {asset.serialNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {Array.from({ length: 4 - selectedAssets.length }, (_, index) => (
                  <div
                    key={`add-${index}`}
                    className='h-full min-h-[220px]'
                  >
                    <button
                      onClick={() => setShowAssetSelector(true)}
                      className='group border-border hover:border-primary hover:bg-muted/50 flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200'
                    >
                      <Plus className='text-muted-foreground group-hover:text-primary mb-2 h-8 w-8' />
                      <span className='text-muted-foreground group-hover:text-foreground text-sm font-medium'>
                        Add Device
                      </span>
                      <span className='text-muted-foreground mt-1 text-xs'>Max 4 devices</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className='border-primary/20 bg-primary/10 rounded-lg border p-4'>
              <p className='text-primary text-center text-sm font-medium'>
                {selectedAssets.length === 1
                  ? 'Select at least 1 more device to start comparison'
                  : `Selected ${selectedAssets.length}/4 devices for comparison`}
              </p>
            </div>

            <div className='flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row'>
              <Button
                variant='outline'
                onClick={handleClearAll}
                disabled={selectedAssets.length <= 1}
                className='w-full border-red-200 text-red-600 hover:bg-red-50 sm:w-auto dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20'
              >
                <X className='h-4 w-4' />
                Clear All Devices
              </Button>

              <Button
                onClick={handleCompareNow}
                disabled={selectedAssets.length < 2}
                className='bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground h-9 w-full sm:w-auto'
                size='lg'
              >
                <GitCompare className='h-4 w-4' />
                Compare Now ({selectedAssets.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showAssetSelector && (
        <SimpleAssetSelector
          isOpen={showAssetSelector}
          onClose={() => setShowAssetSelector(false)}
          onSelectAsset={handleAddAsset}
          excludeAssetIds={selectedAssets.map((asset) => asset.id)}
          currentAsset={currentAsset}
        />
      )}
    </>
  )
}
