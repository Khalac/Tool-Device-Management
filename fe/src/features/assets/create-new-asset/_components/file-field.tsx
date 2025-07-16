import { FormControl, FormField, FormItem, FormMessage, FormLabel, Input } from '@/components/ui'
import { PaperclipIcon } from 'lucide-react'
import type { CreateAssetFormType } from '../model'
import type { UseFormReturn } from 'react-hook-form'

export const FileField = ({
  form,
  fileName,
  setFileName,
  highlightOnValue = true,
}: {
  form: UseFormReturn<CreateAssetFormType>
  fileName: string
  setFileName: React.Dispatch<React.SetStateAction<string>>
  highlightOnValue?: boolean
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('file', file)

      setFileName(file.name)
    }
  }
  return (
    <FormField
      control={form.control}
      name='file'
      render={({}) => (
        <FormItem>
          <FormLabel>Attachment</FormLabel>
          <FormControl highlightOnValue={highlightOnValue}>
            <div className='flex w-full flex-col items-center justify-center'>
              <label
                htmlFor='file-upload'
                className='flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-slate-900 dark:hover:border-gray-500'
              >
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  <PaperclipIcon className='mb-2 h-8 w-8 text-gray-500 dark:text-gray-400' />
                  <p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
                    {fileName ? fileName : <span>Click to attach file</span>}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>PDF, DOC, XLS, etc.</p>
                </div>
                <Input
                  id='file-upload'
                  type='file'
                  className='hidden'
                  onChange={handleFileChange}
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
