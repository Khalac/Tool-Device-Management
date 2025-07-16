import { FormControl, FormField, FormItem, FormMessage, FormLabel, Input } from '@/components/ui'
import { ImageIcon } from 'lucide-react'
import type { CreateAssetFormType } from '../model'
import type { UseFormReturn } from 'react-hook-form'

export const ImageField = ({
  form,
  imageName,
  setImageName,
  highlightOnValue = true,
}: {
  form: UseFormReturn<CreateAssetFormType>
  imageName: string
  setImageName: React.Dispatch<React.SetStateAction<string>>
  highlightOnValue?: boolean
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('image', file)
      setImageName(file.name)
    }
  }

  return (
    <FormField
      control={form.control}
      name='image'
      render={() => (
        <FormItem>
          <FormLabel>Asset Image</FormLabel>
          <FormControl highlightOnValue={highlightOnValue}>
            <div className='flex w-full flex-col items-center justify-center truncate'>
              <label
                htmlFor='image-upload'
                className='flex h-28 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-slate-900 dark:hover:border-gray-500'
              >
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  <ImageIcon className='mb-2 h-8 w-8 text-gray-500 dark:text-gray-400' />
                  <p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
                    {imageName ? imageName : 'Click to upload image'}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>PNG, JPG, GIF up to 10MB</p>
                </div>
                <Input
                  id='image-upload'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
