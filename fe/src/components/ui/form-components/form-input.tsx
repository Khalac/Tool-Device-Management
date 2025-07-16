import { FormField, FormItem, FormControl, FormMessage, Input, Label } from '@/components/ui'
import { cn } from '@/lib'
import { useFormContext } from 'react-hook-form'

export const FormInput = ({
  name,
  type,
  label,
  Icon,
  placeholder,
  highlightOnValue = true,
}: {
  name: string
  type: string
  label: string
  placeholder: string
  Icon?: React.ElementType
  highlightOnValue?: boolean
}) => {
  const { control } = useFormContext()
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <Label>{label}</Label>
          <FormControl highlightOnValue={highlightOnValue}>
            <div className='relative'>
              {Icon && (
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <Icon className='h-4 w-4 text-gray-400 sm:h-5 sm:w-5' />
                </div>
              )}
              <Input
                highlightOnValue={false}
                type={type}
                placeholder={placeholder || ''}
                className={cn('h-9 text-sm', {
                  'pl-9 sm:pl-10': Icon,
                })}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage className='text-xs sm:text-sm' />
        </FormItem>
      )}
    />
  )
}
