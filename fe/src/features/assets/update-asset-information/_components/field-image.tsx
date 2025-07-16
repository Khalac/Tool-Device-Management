import { FormField, FormItem, FormControl, Input, Button } from '@/components/ui'
import { ImageIcon, Upload, Image } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { CreateAssetFormType } from '../../create-new-asset'
export const FieldImage = ({
  form,
  imagePreview,
  setImagePreview,
}: {
  form: UseFormReturn<CreateAssetFormType>
  imagePreview: string
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
      form.setValue('image', file, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
    }
  }
  return (
    <div className='flex h-48 flex-col'>
      <div className='relative mb-4 flex flex-grow items-center justify-center'>
        {imagePreview ? (
          <>
            <Image className='text-muted-foreground/10 absolute z-0 h-20 w-20' />

            <div className='relative z-10 flex-grow overflow-hidden'>
              <img
                src={imagePreview}
                alt='Asset preview'
                className='m-auto max-h-[120px] rounded-md object-contain'
              />
            </div>
          </>
        ) : (
          <div className='relative flex h-32 items-center justify-center rounded-md border border-dashed'>
            <Image className='text-muted-foreground/5 absolute z-0 h-16 w-16' />
            <ImageIcon className='text-muted-foreground relative z-10 h-10 w-10' />
          </div>
        )}
      </div>

      <FormField
        control={form.control}
        name='image'
        render={() => (
          <FormItem>
            <FormControl highlightOnValue={false}>
              <div>
                <Input
                  type='file'
                  accept='image/*'
                  id='imageUpload'
                  className='hidden'
                  onChange={handleImageUpload}
                />
                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={() => document.getElementById('imageUpload')?.click()}
                >
                  <Upload className='mr-2 h-4 w-4' />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </Button>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
