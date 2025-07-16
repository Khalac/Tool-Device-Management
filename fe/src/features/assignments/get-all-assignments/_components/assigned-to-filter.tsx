import { Input } from '@/components'
import { Search } from 'lucide-react'
import type { FilterData } from '../model'
export const AssignedToFilter = ({
  filters,
  setFilters,
}: {
  filters: FilterData
  setFilters: React.Dispatch<React.SetStateAction<FilterData>>
}) => {
  return (
    <div className='flex-1 space-y-2'>
      <label className='text-sm font-medium'>Assigned To (Email)</label>
      <div className='relative'>
        <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
        <Input
          placeholder='Filter by assignee email...'
          className='mt-1 pl-8'
          value={filters.emailAssigned}
          onChange={(e) => setFilters((prev) => ({ ...prev, emailAssigned: e.target.value }))}
        />
      </div>
    </div>
  )
}
