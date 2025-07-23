import { X } from 'lucide-react'

interface ActiveFilter {
  key: string
  label: string
  onClear: () => void
}

interface ActiveFiltersDisplayProps {
  activeFilters: ActiveFilter[]
  hasActiveFilters: boolean
}

export const ActiveFiltersDisplay = ({ activeFilters, hasActiveFilters }: ActiveFiltersDisplayProps) => {
  if (!hasActiveFilters) return null

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>Active filters:</span>
      {activeFilters.map((filter) => (
        <div
          key={filter.key}
          className='flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-sm text-blue-700'
        >
          <span>{filter.label}</span>
          <button
            onClick={filter.onClear}
            type='button'
            className='ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300'
          >
            <X className='h-3 w-3' />
          </button>
        </div>
      ))}
    </div>
  )
}
