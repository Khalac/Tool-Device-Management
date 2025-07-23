import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui'
import type { AssetsType } from '@/features/assets/view-all-assets/model'
import type { FilterType } from '../../../assets/view-all-assets/model'
import type { DateFilter } from '../../model/statistics-types'
import type { SetStateAction } from 'react'
import { calculateMonthlyStats, generateFilteredTrend, generateComparisonData, filterAssetsByDate } from '../../utils'
import { ReportHeader } from './report-header'
import { ActiveFiltersDisplay } from './active-filters-display'
import { ReportFilters } from './report-filters'
import { ReportTabs } from './report-tabs'
import { ReportContent } from './report-content'
import { ReportSummary } from './report-summary'

interface MonthlyReportProps {
  assets: AssetsType[]
  className?: string
  initialDateFilter?: DateFilter
  onDateFilterChange?: (filter: DateFilter) => void
  assetFilter?: FilterType
  onAssetFilterChange?: (filter: FilterType) => void
}

export const MonthlyReport = ({
  assets,
  className = '',
  initialDateFilter,
  onDateFilterChange,
  assetFilter = { assetName: '', categoryId: null, departmentId: null, status: null },
  onAssetFilterChange,
}: MonthlyReportProps) => {
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    dateField: 'purchase',
    month: undefined,
    year: undefined,
  })

  const [activeTab, setActiveTab] = useState<'overview' | 'comparison'>('overview')

  useEffect(() => {
    if (initialDateFilter) {
      setDateFilter(initialDateFilter)
    }
  }, [initialDateFilter])

  const handleDateFilterChange = (filter: DateFilter) => {
    setDateFilter(filter)
    if (onDateFilterChange) {
      onDateFilterChange(filter)
    }
  }

  const handleAssetFilterChange: React.Dispatch<SetStateAction<FilterType>> = (value) => {
    if (onAssetFilterChange) {
      const newFilter = typeof value === 'function' ? value(assetFilter) : value
      onAssetFilterChange(newFilter)
    }
  }

  const clearDateFilter = () => {
    const clearedFilter: DateFilter = {
      dateField: 'purchase',
      month: undefined,
      year: undefined,
      startDate: undefined,
      endDate: undefined,
      singleDate: undefined,
    }
    setDateFilter(clearedFilter)
    if (onDateFilterChange) {
      onDateFilterChange(clearedFilter)
    }
  }

  const clearCategoryFilter = () => {
    handleAssetFilterChange((prev) => ({ ...prev, categoryId: null }))
  }

  const clearDepartmentFilter = () => {
    handleAssetFilterChange((prev) => ({ ...prev, departmentId: null }))
  }

  const clearStatusFilter = () => {
    handleAssetFilterChange((prev) => ({ ...prev, status: null }))
  }

  const handleClearAllFilters = () => {
    clearDateFilter()
    if (onAssetFilterChange) {
      onAssetFilterChange({
        assetName: '',
        categoryId: null,
        departmentId: null,
        status: null,
      })
    }
  }

  const getActiveFilters = () => {
    const filters = []

    if (dateFilter.month && dateFilter.year) {
      const monthName = new Date(2024, dateFilter.month - 1).toLocaleString('default', { month: 'long' })
      filters.push({
        key: 'date',
        label: `${monthName} ${dateFilter.year}`,
        onClear: clearDateFilter,
      })
    } else if (dateFilter.year && !dateFilter.month) {
      filters.push({
        key: 'date',
        label: `Year: ${dateFilter.year}`,
        onClear: clearDateFilter,
      })
    } else if (dateFilter.month && !dateFilter.year) {
      const monthName = new Date(2024, dateFilter.month - 1).toLocaleString('default', { month: 'long' })
      filters.push({
        key: 'date',
        label: `Month: ${monthName}`,
        onClear: clearDateFilter,
      })
    } else if (dateFilter.startDate && dateFilter.endDate) {
      filters.push({
        key: 'date',
        label: 'Date Range',
        onClear: clearDateFilter,
      })
    }

    if (assetFilter.categoryId) {
      const categoryName =
        assets.find((a) => a.category.id.toString() === assetFilter.categoryId)?.category.categoryName || 'Category'
      filters.push({
        key: 'category',
        label: categoryName,
        onClear: clearCategoryFilter,
      })
    }

    if (assetFilter.departmentId) {
      const departmentName =
        assets.find((a) => a.department.id.toString() === assetFilter.departmentId)?.department.departmentName ||
        'Department'
      filters.push({
        key: 'department',
        label: departmentName,
        onClear: clearDepartmentFilter,
      })
    }

    if (assetFilter.status) {
      filters.push({
        key: 'status',
        label: assetFilter.status,
        onClear: clearStatusFilter,
      })
    }

    return filters
  }

  const activeFilters = getActiveFilters()
  const hasActiveFilters = activeFilters.length > 0

  const filteredAssets = useMemo(() => {
    if (!Array.isArray(assets)) return []
    return filterAssetsByDate(assets, dateFilter)
  }, [assets, dateFilter])

  const monthlyStats = useMemo(() => {
    return calculateMonthlyStats(filteredAssets)
  }, [filteredAssets])

  const trendData = useMemo(() => {
    return generateFilteredTrend(assets, dateFilter, assetFilter, 12)
  }, [assets, dateFilter, assetFilter])

  const comparisonData = useMemo(() => {
    if (!dateFilter.month || !dateFilter.year) return null
    return generateComparisonData(assets, dateFilter.month, dateFilter.year)
  }, [assets, dateFilter.month, dateFilter.year])

  const handleExport = (format: 'pdf' | 'csv' | 'html') => {
    console.log(`Exporting ${format} report`)
  }

  const handleStatClick = (filterType: 'total' | 'new' | 'in-use' | 'maintenance' | 'retired') => {
    const newFilter = { ...assetFilter }

    switch (filterType) {
      case 'total':
        newFilter.status = null
        break
      case 'new':
        newFilter.status = 'New'
        break
      case 'in-use':
        newFilter.status = 'In Use'
        break
      case 'maintenance':
        newFilter.status = 'Under Maintenance'
        break
      case 'retired':
        newFilter.status = 'Disposed'
        break
    }

    handleAssetFilterChange(newFilter)
  }

  const handleCategoryClick = (categoryName: string) => {
    const category = assets.find((asset) => asset.category.categoryName === categoryName)
    if (category) {
      handleAssetFilterChange((prev) => ({
        ...prev,
        categoryId: category.category.id?.toString() || null,
      }))
    }
  }

  const handleDepartmentClick = (departmentName: string) => {
    const department = assets.find((asset) => asset.department.departmentName === departmentName)
    if (department) {
      handleAssetFilterChange((prev) => ({
        ...prev,
        departmentId: department.department.id?.toString() || null,
      }))
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <ReportHeader
          dateFilter={dateFilter}
          monthlyStats={monthlyStats}
          filteredAssets={filteredAssets}
          hasActiveFilters={hasActiveFilters}
          onClearAllFilters={handleClearAllFilters}
          onExport={handleExport}
        />

        <CardContent className='space-y-4'>
          <ReportFilters
            assets={assets}
            dateFilter={dateFilter}
            assetFilter={assetFilter}
            onDateFilterChange={handleDateFilterChange}
            onAssetFilterChange={handleAssetFilterChange}
          />

          <ActiveFiltersDisplay
            activeFilters={activeFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <ReportTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <CardContent>
          <ReportContent
            activeTab={activeTab}
            filteredAssets={filteredAssets}
            assets={assets}
            assetFilter={assetFilter}
            monthlyStats={monthlyStats}
            trendData={trendData}
            comparisonData={comparisonData}
            onStatClick={handleStatClick}
            onCategoryClick={handleCategoryClick}
            onDepartmentClick={handleDepartmentClick}
          />
        </CardContent>
      </Card>

      <ReportSummary
        dateFilter={dateFilter}
        monthlyStats={monthlyStats}
      />
    </div>
  )
}
