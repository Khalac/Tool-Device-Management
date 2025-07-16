import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Label,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  Calendar,
} from '@/components/ui'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useFormContext } from 'react-hook-form'

export const FormDatePicker = ({
  name,
  label,
  fn,
  highlightOnValue = true,
}: {
  name: string
  label: string
  fn?: Function
  highlightOnValue?: boolean
}) => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const hasValue = !!field.value

        return (
          <FormItem className='flex flex-col'>
            <Label>{label}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl highlightOnValue={highlightOnValue}>
                  <Button
                    variant='outline'
                    className={`w-full pl-3 text-left font-normal group-[.create-maintenance-schedule]:w-full ${!hasValue ? 'text-muted-foreground' : ''} ${
                      highlightOnValue && hasValue ? 'border-primary ring-primary/10 ring-[3px]' : ''
                    } `}
                  >
                    {hasValue ? format(field.value, 'PPP') : <span>Select date</span>}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className='w-auto p-0'
                align='start'
              >
                <Calendar
                  mode='single'
                  selected={field.value}
                  onSelect={(value) => {
                    if (fn) {
                      fn(value)
                    } else {
                      field.onChange(value)
                    }
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
