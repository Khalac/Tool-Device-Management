import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components'
import type { AssetStatus, FilterType } from '../../../model'

export const StatusFilter = ({
  filteredAssets,
  setFilteredAssets,
}: {
  filteredAssets: FilterType
  setFilteredAssets: React.Dispatch<React.SetStateAction<FilterType>>
}) => {
  const statusOptions: AssetStatus[] = ['New', 'In Use', 'Under Maintenance', 'Retired', 'Disposed']
  return (
    <Select
      value={filteredAssets.status || ''}
      onValueChange={(value) => setFilteredAssets({ ...filteredAssets, status: value || null })}
    >
      <SelectTrigger
        value={filteredAssets.status || ''}
        className='w-full md:w-[180px]'
      >
        <SelectValue placeholder='Status' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {statusOptions.map((status) => (
            <SelectItem
              key={status}
              value={status}
            >
              {status}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
