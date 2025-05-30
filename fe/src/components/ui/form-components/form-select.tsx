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
import { useFormContext } from 'react-hook-form'

type DataType = {
  id: number | string
  categoryName?: string
  departmentName?: string
  firstName?: string
  lastName?: string
  value?: string
}

export const FormSelect = ({
  name,
  label,
  placeholder,
  data,
  onChange,
}: {
  name: string
  label: string
  placeholder: string
  data: DataType[]
  onChange?: (value: string) => void
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
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data.map((d) => (
                <SelectItem
                  key={d.id}
                  value={d.id.toString()}
                >
                  {d.categoryName || d.departmentName || d.firstName + ' ' + d.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
