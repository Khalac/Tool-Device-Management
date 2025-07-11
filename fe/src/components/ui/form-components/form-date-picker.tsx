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

export const FormDatePicker = ({ name, label, fn }: { name: string; label: string; fn?: Function }) => {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          <Label>{label}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={`w-full pl-3 text-left font-normal group-[.create-maintenance-schedule]:w-60 ${!field.value && 'text-muted-foreground'}`}
                >
                  {field.value ? format(field.value, 'PPP') : <span>Select date</span>}
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
      )}
    />
  )
}
