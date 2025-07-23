import type { SetStateAction } from 'react'
import type { AssetsType } from '@/features/assets/view-all-assets/model'
import type { FilterType } from '../../../assets/view-all-assets/model'
import type { DateFilter } from '../../model/statistics-types'
import { DateFilter as DateFilterComponent } from '../date-filter'
import {
  CategoriesFilter,
  DepartmentsFilter,
  StatusFilter,
} from '../../../assets/view-all-assets/_components/filter/_components'

interface ReportFiltersProps {
  assets: AssetsType[]
  dateFilter: DateFilter
  assetFilter: FilterType
  onDateFilterChange: (filter: DateFilter) => void
  onAssetFilterChange: React.Dispatch<SetStateAction<FilterType>>
}

export const ReportFilters = ({
  assets,
  dateFilter,
  assetFilter,
  onDateFilterChange,
  onAssetFilterChange,
}: ReportFiltersProps) => {
  return (
    <div className='flex flex-wrap items-end gap-4'>
      <DateFilterComponent
        dateFilter={dateFilter}
        onDateFilterChange={onDateFilterChange}
        assets={assets}
        originalAssets={assets}
      />

      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium text-black dark:text-white'>Category</label>
        <div className='h-9 w-30 sm:w-45 [&_button]:h-full [&>*]:h-full [&>*]:w-full'>
          <CategoriesFilter
            filteredAssets={assetFilter}
            setFilteredAssets={onAssetFilterChange}
          />
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium text-black dark:text-white'>Department</label>
        <div className='h-9 w-30 sm:w-45 [&_button]:h-full [&>*]:h-full [&>*]:w-full'>
          <DepartmentsFilter
            filteredAssets={assetFilter}
            setFilteredAssets={onAssetFilterChange}
          />
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium text-black dark:text-white'>Status</label>
        <div className='h-9 w-30 sm:w-45 [&_button]:h-full [&>*]:h-full [&>*]:w-full'>
          <StatusFilter
            filteredAssets={assetFilter}
            setFilteredAssets={onAssetFilterChange}
          />
        </div>
      </div>
    </div>
  )
}
