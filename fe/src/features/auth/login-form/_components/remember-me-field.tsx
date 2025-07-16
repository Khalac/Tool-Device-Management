import { FormControl, FormField, FormItem, FormMessage, Checkbox, Label } from '@/components/ui'
import type { DataLoginType } from '../model'
import type { UseFormReturn } from 'react-hook-form'

export const RememberMeField = ({
  form,
  highlightOnValue,
}: {
  form: UseFormReturn<DataLoginType>
  highlightOnValue?: boolean
}) => {
  return (
    <FormField
      name='rememberMe'
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormControl highlightOnValue={highlightOnValue}>
            <div className='mt-2 flex items-center'>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label className='text-muted-foreground ml-2 block text-xs sm:text-sm'>Remember me</Label>
            </div>
          </FormControl>
          <FormMessage className='text-xs sm:text-sm' />
        </FormItem>
      )}
    />
  )
}
