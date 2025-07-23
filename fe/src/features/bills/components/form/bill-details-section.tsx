import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { FileText, CreditCard } from 'lucide-react'
import type { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form'
import type { CreateBillFormType } from '../../model/create-bill-schema'

interface BillDetailsSectionProps {
  register: UseFormRegister<CreateBillFormType>
  errors: FieldErrors<CreateBillFormType>
  setValue: UseFormSetValue<CreateBillFormType>
}

export const BillDetailsSection = ({ register, errors, setValue }: BillDetailsSectionProps) => {
  const statusOptions = [
    { value: 'Unpaid', label: 'Unpaid' },
    { value: 'Paid', label: 'Paid' },
  ]

  return (
    <div className='border-t pt-6'>
      <h3 className='mb-4 flex items-center gap-2 text-base font-medium'>
        <FileText className='h-5 w-5' />
        Bill Details
      </h3>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label
            htmlFor='description'
            className='flex items-center gap-2'
          >
            <FileText className='h-4 w-4' />
            Description *
          </Label>
          <Input
            id='description'
            {...register('description')}
            placeholder='Enter bill description'
            className={`${errors.description ? 'border-red-500' : ''} overflow-x-auto text-sm`}
            style={{ textOverflow: 'ellipsis' }}
          />
          {errors.description && <p className='text-sm text-red-600'>{errors.description.message}</p>}
        </div>

        <div className='space-y-2'>
          <Label
            htmlFor='statusBill'
            className='flex items-center gap-2'
          >
            <CreditCard className='h-4 w-4' />
            Payment Status
          </Label>
          <Select
            onValueChange={(value) => setValue('statusBill', value as 'Unpaid' | 'Paid')}
            defaultValue='Unpaid'
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent className='w-full'>
              {statusOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className='w-full'
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
