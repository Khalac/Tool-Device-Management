import { Input } from '@/components'
import { Search } from 'lucide-react'
import type { FilterData } from '../model'
export const AssetNameFilter = ({
  filters,
  setFilters,
}: {
  filters: FilterData
  setFilters: React.Dispatch<React.SetStateAction<FilterData>>
}) => {
  return (
    <div className='flex-1 space-y-2'>
      <label className='text-sm font-medium'>Asset Name</label>
      <div className='relative'>
        <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
        <Input
          placeholder='Filter by asset name...'
          className='mt-1 pl-8'
          value={filters.assetName}
          onChange={(e) => setFilters((prev) => ({ ...prev, assetName: e.target.value }))}
        />
      </div>
    </div>
  )
}
