import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components'
import type { FilterType } from '../../../model'
import { useEffect, useState } from 'react'
import { tryCatch } from '@/utils'
import { getAllCategories } from '@/features/assets/api'
import type { CategoryType } from '@/features/assets/create-new-asset'
export const CategoriesFilter = ({
  filteredAssets,
  setFilteredAssets,
}: {
  filteredAssets: FilterType
  setFilteredAssets: React.Dispatch<React.SetStateAction<FilterType>>
}) => {
  const [isPending, setIsPending] = useState(false)
  const [categories, setCategories] = useState<CategoryType[]>([])
  const getCategories = async () => {
    setIsPending(true)
    const response = await tryCatch(getAllCategories())
    if (response.error) {
      return
    }
    setCategories(response.data.data)
    setIsPending(false)
  }
  useEffect(() => {
    getCategories()
  }, [])
  return (
    <Select
      disabled={isPending}
      value={filteredAssets.categoryId || ''}
      onValueChange={(value) => setFilteredAssets({ ...filteredAssets, categoryId: value || null })}
    >
      <SelectTrigger
        value={filteredAssets.categoryId || ''}
        className='w-full md:w-[180px]'
      >
        <SelectValue placeholder='Category'>
          {filteredAssets.categoryId &&
            categories.find((category) => category.id.toString() === filteredAssets.categoryId)?.categoryName}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id.toString()}
            >
              {category.categoryName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
