import { RotateCcw, BarChart3, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { ExportComparison } from './export-comparison'
import type { ComparisonAsset } from '../model'

interface ComparisonHeaderProps {
  assetCount: number
  onClear: () => void
  selectedAssets: ComparisonAsset[]
}

export const ComparisonHeader = ({ assetCount, onClear, selectedAssets }: ComparisonHeaderProps) => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleGoBack}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>

        <div>
          <h1 className='text-primary flex items-center gap-2 text-2xl font-bold'>
            <BarChart3 className='text-primary h-6 w-6' />
            Asset Comparison
          </h1>
        </div>
      </div>

      {assetCount > 0 && (
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={onClear}
          >
            <RotateCcw className='mr-2 h-4 w-4' />
            Clear All
          </Button>

          <ExportComparison assets={selectedAssets} />
        </div>
      )}
    </div>
  )
}
