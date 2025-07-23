import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui'
import { formatCamelCase } from '@/utils/format-camel-case'
import { useFormContext } from 'react-hook-form'

type DataType = {
  id: number | string
  name?: string
  categoryName?: string
  departmentName?: string
  firstName?: string
  lastName?: string
  value?: string
  assetName?: string
  slug?: string
}

export const FormSelect = ({
  name,
  label,
  placeholder,
  data,
  onChange,
  highlightOnValue = true,
}: {
  name: string
  label: string
  placeholder: string
  data: DataType[]
  onChange?: (value: string) => void
  highlightOnValue?: boolean
}) => {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Label>{label}</Label>
          <Select
            onValueChange={(value) => {
              field.onChange(value)
              if (onChange) {
                onChange(value)
              }
            }}
            value={field.value}
          >
            <FormControl highlightOnValue={highlightOnValue}>
              <SelectTrigger className='w-full group-[.create-asset-form]:w-full group-[.create-maintenance-schedule]:w-full group-[.new-department-form]:w-52 group-[.user-assign-role]:w-50'>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data.map((d) => {
                return (
                  <SelectItem
                    key={d.id}
                    value={d.slug || d.id.toString() || ''}
                  >
                    {(d.slug && formatCamelCase(d.slug)) ||
                      d.assetName ||
                      d.categoryName ||
                      d.departmentName ||
                      d.name ||
                      d.firstName + ' ' + d.lastName}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
