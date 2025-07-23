import { Input, Label } from '@/components/ui'
import { User, Phone, Mail, MapPin } from 'lucide-react'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { CreateBillFormType } from '../../model/create-bill-schema'

interface BuyerInformationSectionProps {
  register: UseFormRegister<CreateBillFormType>
  errors: FieldErrors<CreateBillFormType>
}

export const BuyerInformationSection = ({ register, errors }: BuyerInformationSectionProps) => {
  return (
    <div className='border-t pt-6'>
      <h3 className='mb-4 flex items-center gap-2 text-base font-medium'>
        <User className='h-5 w-5' />
        Buyer Information
      </h3>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label
            htmlFor='buyerName'
            className='flex items-center gap-2'
          >
            <User className='h-4 w-4' />
            Buyer Name *
          </Label>
          <Input
            id='buyerName'
            {...register('buyerName')}
            placeholder='Enter buyer name'
            className={`${errors.buyerName ? 'border-red-500' : ''} text-sm`}
          />
          {errors.buyerName && <p className='text-sm text-red-600'>{errors.buyerName.message}</p>}
        </div>

        <div className='space-y-2'>
          <Label
            htmlFor='buyerPhone'
            className='flex items-center gap-2'
          >
            <Phone className='h-4 w-4' />
            Phone Number *
          </Label>
          <Input
            id='buyerPhone'
            {...register('buyerPhone')}
            placeholder='Enter phone number'
            className={`${errors.buyerPhone ? 'border-red-500' : ''} text-sm`}
          />
          {errors.buyerPhone && <p className='text-sm text-red-600'>{errors.buyerPhone.message}</p>}
        </div>

        <div className='space-y-2'>
          <Label
            htmlFor='buyerEmail'
            className='flex items-center gap-2'
          >
            <Mail className='h-4 w-4' />
            Email Address *
          </Label>
          <Input
            id='buyerEmail'
            type='email'
            {...register('buyerEmail')}
            placeholder='Enter email address'
            className={`${errors.buyerEmail ? 'border-red-500' : ''} text-sm`}
          />
          {errors.buyerEmail && <p className='text-sm text-red-600'>{errors.buyerEmail.message}</p>}
        </div>

        <div className='space-y-2'>
          <Label
            htmlFor='buyerAddress'
            className='flex items-center gap-2'
          >
            <MapPin className='h-4 w-4' />
            Address *
          </Label>
          <Input
            id='buyerAddress'
            {...register('buyerAddress')}
            placeholder='Enter full address'
            className={`${errors.buyerAddress ? 'border-red-500' : ''} overflow-x-auto text-sm`}
            style={{ textOverflow: 'ellipsis' }}
          />
          {errors.buyerAddress && <p className='text-sm text-red-600'>{errors.buyerAddress.message}</p>}
        </div>
      </div>
    </div>
  )
}
