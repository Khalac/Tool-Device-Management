import { Input } from '@/components'
import { Search } from 'lucide-react'
import type { FilterData } from '../model'
export const AssignedByFilter = ({
  filters,
  setFilters,
}: {
  filters: FilterData
  setFilters: React.Dispatch<React.SetStateAction<FilterData>>
}) => {
  return (
    <div className='flex-1 space-y-2'>
      <label className='text-sm font-medium'>Assigned By (Email)</label>
      <div className='relative'>
        <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
        <Input
          placeholder='Filter by assigner email...'
          className='mt-1 pl-8'
          value={filters.emailAssign}
          onChange={(e) => setFilters((prev) => ({ ...prev, emailAssign: e.target.value }))}
        />
      </div>
    </div>
  )
}
