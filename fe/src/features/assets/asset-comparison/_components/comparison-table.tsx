import { useState } from 'react'
import { Badge, Card, CardContent, CardHeader, CardTitle, Checkbox, Label } from '@/components/ui'
import { cn } from '@/lib'
import type { ComparisonAsset, ComparisonField } from '../model'
import { Info } from 'lucide-react'

interface ComparisonTableProps {
  assets: ComparisonAsset[]
}

export const ComparisonTable = ({ assets }: ComparisonTableProps) => {
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false)

  if (assets.length === 0) {
    return (
      <Card>
        <CardContent className='p-8 text-center'>
          <p className='text-muted-foreground'>Select assets to start comparison</p>
        </CardContent>
      </Card>
    )
  }

  const comparisonFields: ComparisonField[] = [
    { key: 'imageUpload', label: 'Image', type: 'image', group: 'basic' },
    { key: 'assetName', label: 'Asset Name', type: 'text', group: 'basic' },
    { key: 'serialNumber', label: 'Serial Number', type: 'text', group: 'basic' },
    { key: 'category.categoryName', label: 'Category', type: 'text', group: 'basic' },
    { key: 'cost', label: 'Cost', type: 'currency', group: 'basic' },
    { key: 'purchaseDate', label: 'Purchase Date', type: 'date', group: 'basic' },
    { key: 'warrantExpiry', label: 'Warranty Expiry', type: 'date', group: 'basic' },
    { key: 'department.departmentName', label: 'Department', type: 'text', group: 'basic' },
    { key: 'location.locationAddress', label: 'Location', type: 'text', group: 'basic' },
    { key: 'status', label: 'Status', type: 'badge', group: 'basic' },
  ]

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  const hasFieldDifferences = (field: ComparisonField) => {
    if (assets.length <= 1) return false

    const values = assets.map((asset) => {
      const value = getNestedValue(asset, field.key)
      if (field.type === 'date' && value) {
        return new Date(value).toDateString()
      }
      if (field.type === 'currency') {
        return Number(value) || 0
      }
      return String(value || '')
        .toLowerCase()
        .trim()
    })

    const firstValue = values[0]
    return !values.every((value) => value === firstValue)
  }

  const visibleFields = showDifferencesOnly
    ? comparisonFields.filter((field) => hasFieldDifferences(field))
    : comparisonFields

  const renderFieldValue = (asset: ComparisonAsset, field: ComparisonField) => {
    const value = getNestedValue(asset, field.key)

    switch (field.type) {
      case 'image':
        return (
          <div className='bg-muted/50 mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border-none'>
            {value ? (
              <img
                src={value}
                alt={asset.assetName}
                className='h-full w-full object-cover'
              />
            ) : (
              <span className='text-muted-foreground text-lg font-medium'>{asset.assetName[0]}</span>
            )}
          </div>
        )
      case 'currency':
        return <span className='font-medium'>${value?.toLocaleString() || '0'}</span>
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-'
      case 'badge':
        return (
          <Badge
            variant='outline'
            className={cn(
              'flex items-center gap-1',
              value === 'New' &&
                'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400',
              value === 'In Use' &&
                'border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
              value === 'Under Maintenance' &&
                'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
              value === 'Retired' &&
                'border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300',
              value === 'Disposed' &&
                'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400'
            )}
          >
            {value || '-'}
          </Badge>
        )
      default:
        return <span>{value || '-'}</span>
    }
  }

  return (
    <Card className='pt-6 pb-0'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
        <CardTitle className='text-primary flex items-center gap-2'>
          <Info className='text-primary h-5 w-5' />
          Asset Information
        </CardTitle>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='show-differences'
            checked={showDifferencesOnly}
            onCheckedChange={(checked) => setShowDifferencesOnly(checked === true)}
          />
          <Label
            htmlFor='show-differences'
            className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Show differences only
          </Label>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        {visibleFields.length === 0 && showDifferencesOnly ? (
          <div className='p-8 text-center'>
            <p className='text-muted-foreground'>No differences found between selected assets</p>
          </div>
        ) : (
          <div className='comparison-table-container overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='comparison-table-header bg-muted/50 border-b'>
                  <th className='bg-muted/50 sticky left-0 z-20 w-48 p-4 text-left font-medium shadow-sm'>Property</th>
                  {assets.map((asset) => (
                    <th
                      key={asset.id}
                      className='border-border min-w-56 border-l p-4 text-center'
                    >
                      <div className='font-medium'>{asset.assetName}</div>
                      <div className='text-muted-foreground text-sm'>{asset.serialNumber}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleFields.map((field) => (
                  <tr
                    key={field.key}
                    className={cn('hover:bg-muted/25 border-b', '')}
                  >
                    <td className='bg-background sticky left-0 z-10 border-r p-4 font-medium shadow-sm'>
                      {field.label}
                    </td>
                    {assets.map((asset, index) => (
                      <td
                        key={`${asset.id}-${field.key}`}
                        className={cn('border-border border-l p-4', index % 2 === 0 ? 'bg-muted/10' : '', '')}
                      >
                        {renderFieldValue(asset, field)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
